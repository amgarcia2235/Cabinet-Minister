# HANDOFF — Cabinet Planner Toolkit ("cabinetminister")

**Written:** 2026-08-21 · **Repo:** `amgarcia2235/Cabinet-Minister` (branch `main`)
**Version:** v0.8.0 — bumped across README, CHANGELOG, Hub, github.md, PROJECT.md
**State:** reskinned to a shared theme; two cross-tool data bugs fixed; 3D editor built in v0.7.0 and verified.

Written to be read cold. Everything a new chat needs is here.

---

# 1. What this project is

A browser-only toolkit for documenting and planning data-center network cabinets. Plain HTML/JS, **no build step, no server, no npm**. Runs from `file://` by double-click. Five tools share one hardware catalog so a spec fix propagates everywhere.

**Core philosophy — data first, not photo first.** Port maps come from manufacturer documentation and are encoded as structured, addressable data (`et-0/0/12`, `C13-7`, `ge-0/1/2`). Every view — 2D elevation, 3D scene, port catalog, connections — renders from that data. Photos are *skins over* the data, never the source of it.

**Second rule: verified stays verified.** Anything inferred is flagged — `assumed: true` on a port group, a value inside `est: {}`, or a sentence in the model's `note`. Never promote a guess into a spec field. Unsourced depths read "TBC" rather than a plausible number.

**Audience:** on-site DC technicians and the sysadmins they hand off to. The vocabulary is theirs — U positions, cold/hot aisle, AFO/AFI airflow, FRU, PSU, PDU banks, patch schedule.

---

# 2. File inventory

## Application files (all at project root)
| File | Role | Notes |
|---|---|---|
| `Hub.dc.html` | Landing page — live stats, tool launcher, release notes | Open first. Reads `.main`/`.blank` + `.connections` for stat counters (lines ~179-195) |
| `catalog.js` | **Single source of truth.** Models, port groups, specs, user-model storage | ~498 lines. Guarded IIFE — `if (window.CabCatalog) return;` (line 27) |
| `Hardware Catalog.dc.html` | Port-map viewer: front + rear faceplate, clickable ports, copyable addresses | ~323 lines |
| `Cabinet Layout.dc.html` | 2D planner: dual-sided 47U elevation, click-to-add, drag, span-resize, rename, autosave | `storageKey = 'cabplanner.v1.main'` (line 178) |
| `Connections.dc.html` | Port→port and outlet→PSU wiring, used/free state, per-PDU load, CSV patch schedule | `storageKey = 'cabplanner.v1.connections'` (line 163) |
| `Cabinet 3D.html` | three.js scene — orbit/zoom to port level, hover to identify, click-to-wire, rear view. **Read-only viewer, left intact** | ~985 lines. Plain `.html`, not a DC — all-canvas/WebGL |
| `Cabinet 3D Editor.html` | **New.** Full 3D build-out — see §7 | ~1050 lines. Built as a copy of the viewer |
| `RELEASE-v0.7.0.md` | Paste-ready GitHub release body | |
| `cabinetminister Hub (offline).html` | Self-contained offline Hub bundle | Built from `Hub (export).dc.html` |
| `support.js` | DC runtime | **Never edit** |
| `Cabinet 3D (standalone).html`, `Cabinet Layout (standalone).html` | Offline single-file bundles | **Both STALE** — regenerate |
| `PROJECT.md` | Structure, confirmed specs, roadmap | Roadmap Phase 2 still open |
| `README.md` | Newbie-facing quick start | Says v0.6.7 — needs bump |
| `CHANGELOG.md` | Version history, newest first | Needs a v0.7.0 entry |
| `github.md` | Repo association, sync receipt, screen map | Needs updating — new assets/models not in the screen map |
| `CR8 Cabinet Layout.xlsx` | Original source spreadsheet | Historical input |

## Assets (`assets/`)
| File | Size | Provenance |
|---|---|---|
| `qfx5200-32c-front.jpg` / `-rear.jpg` | 4096px wide | Product shots, cropped to faceplate, resampled + sharpened (v0.6.7) |
| `qfx5100-48t-front.jpg` / `-rear.jpg` | 4096px wide | Same treatment (v0.6.6/0.6.7) |
| `ex4200-48t-front.png` | 2364×234 | **This session.** Crop (6,6,788,78) → 3× upscale → unsharp 0.35 |
| `ex4200-48t-rear.png` | 2358×228 | **This session.** Crop (7,6,786,76) → 3× → unsharp 0.35 |
| `ap7911b-front.png` | 2955×590 | **This session.** 3/4 shot rectified to true front elevation — see §5 |
| `bh-chassis-plate.png` | 3400×352 | **This session. Drawn, not photographic.** Reusable layer, I/O window transparent |
| `bh-chassis-mc13-le3-front.png` | 3400×352 | **This session.** Plate composited over the board photo |
| `mobo-mc13-le3-io.png` | 800×110 | User-supplied MC13-LE3 rear-edge photo |

## Working files
`scraps/` — throwaway diagnostics (zoom crops, grid overlays, anchor checks). Safe to delete.
`uploads/` — user-pasted originals. Two matter:
- `uploads/pasted-1787327508612-0.png` — the APC AP7911B 3/4 shot the homography was fitted to.
- `uploads/pasted-1787327713306-0.png` — stacked BH chassis photo (1404×1053). **Not usable for rectification** — see §6.2.

---

# 3. Storage keys (browser localStorage, per-origin)

| Key | Written by | Shape |
|---|---|---|
| `cabplanner.v1.main` | 2D planner | `[{name, cells:[…]}]` — array of racks |
| `cabplanner.v1.blank` | 2D planner (blank template) | same |
| `cabplanner.v1.connections` | Connections + 3D wiring | `{devices:[{id,model,name,src}], links:[{a:{devId,port},b:{devId,port},net,kind}]}` |
| `cabplanner.v1.models` | **New this session** — user-defined models | `{modelId: {…model…}}` |

`src` on a device record is `"<storageKey>#<rackIdx>#<cellId>"`.
JSON files are the portable format; localStorage is per-browser only. Every tool has Save file / Open file.

---

# 4. `catalog.js` — full schema reference

Loaded as a **plain script** (not an ES module) so `file://` works without CORS. One global:

```js
window.CabCatalog = { PORT_TYPES, CATALOG, portsOf, skinOf, KIND_TO_MODEL,
  specOf, modelsByCategory, saveUserModel, removeUserModel, isUserModel,
  USER_MODELS_KEY };
```

## Model entry shape
```js
"model-id": {
  name: "Full display name",
  short: "Sidebar label",
  category: "spine|network|dist|pdu|chassis|generic|blank|other",
  accent: "#hex",                  // chip colour in 2D/3D
  u: 1,                            // rack units; 0 with mount:"zeroU"
  mount: "rack" | "zeroU",         // zeroU = vertical, consumes no U
  widthIn: 19,                     // 19 standard; 16.9 for the BH chassis
  depthMm: 520 | null,             // null = TBC, no source found
  generic: true,                   // nominal geometry, not a specific SKU
  custom: true,                    // bespoke / not off-the-shelf
  user: true,                      // came from localStorage (set automatically)

  // validation metadata (added this session)
  psuCount: 2,
  airflow: "AFO" | "AFI" | "none",
  capacityA: 30, volts: 208, derate: 0.8,            // PDUs only
  est: { depthMm: 520, weightKg: 11, watts: 320 },   // ESTIMATES ONLY

  // photo skin
  photo: { front: "assets/x-front.png", aspect: 788/78,
           rear:  "assets/x-rear.png",  rearAspect: 786/76,
           plate: "…", io: "…" },                    // plate/io = BH composite layers

  chassisOf: "cha-1u-b2b-r1", motherboard: "MC13-LE3",   // variant linkage

  note: "Prose shown in the catalog. State what is verified and what is not.",
  groups: [ /* port groups */ ],
}
```

## Port group shape
```js
{ id: "access",
  label: "10/100/1000 RJ45 (0–47)",
  type: "RJ45",                   // key into PORT_TYPES
  count: 48, rows: 2, cols: 24,   // procedural fallback layout
  rear: true,                     // put on the rear FRU panel
  assumed: true,                  // ports inferred, not documented
  naming: { prefix: "ge-0/0/", start: 0 },   // or { names: ["pwr"] }
  region: [x, y, w, h],           // fractions of the faceplate — fallback layout
  anchors: [[x,y,w,h], …]         // per-port, normalised to the PHOTO. Wins over region.
}
```

**`region` vs `anchors`:** `region` lays ports out procedurally in a grid — fine when no photo exists or the grid is perfectly even. `anchors` gives every port its measured position on the actual photo and takes precedence. Anchors are normalised 0–1, **so swapping in higher-res images does not break the maps.**

## `PORT_TYPES`
`RJ45, SFP, SFP+, QSFP+, QSFP28, RS232, USB, VGA, VCP, C13, C19, C14, POWER, LC, BUTTON`
Each `{ label, color, w, h }` where w/h are relative cell proportions. `LC` and `BUTTON` added this session.

## Models in `CATALOG` (14)
| id | Short | U | Status |
|---|---|---|---|
| `qfx5200-32c` | QFX5200-32C | 1 | Verified · photo skins · 32× QSFP28 |
| `qfx5100-48t` | QFX5100-48T | 1 | Verified · photo skins · AFO · 48× 10GBASE-T + 6× QSFP+ |
| `ex4200-48t` | EX4200-48T | 1 | Verified · **photo skins + 48 measured anchors this session** |
| `ap7911b` | AP7911B (2U PDU) | 2 | Verified · **rectified photo + outlet anchors this session** |
| `cha-1u-b2b-r1` | BH chassis (B2B) | 1 | Custom · I/O plate motherboard-dependent |
| `supermicro-1u` | Supermicro 1U | 1 | **`groups: []` — SKU unknown, no ports mapped** |
| `server-1u` | 1U server | 1 | **New** · generic, rear I/O assumed |
| `server-2u` | 2U server | 2 | **New** · generic |
| `server-4u` | 4U server | 4 | **New** · generic |
| `pdu-0u-24` | 0U vertical PDU | 0 | **New** · `mount:"zeroU"` · 24× C13 + 6× C19 · 30A/208V |
| `blank-1u` | Blank 1U | 1 | **New** · no ports |
| `cha-1u-b2b-mc13le3` | BH · MC13-LE3 | 1 | **New** · first motherboard variant |

## `KIND_TO_MODEL`
Planner "kind" → default model id. Keys: `spine, network, dist, mgmt, console, private, pdu, pdu0u, server1u, server2u, server4u, blank, chassis, chassisMc13le3, supermicro, patch`.

## New helpers (this session)
- **`specOf(modelId)`** → `{u, mount, widthIn, depth:{value,est}, weight:{value,est}, watts:{value,est}, psuCount, airflow, capacityA, volts, derate}`. Each physical field carries an `est` boolean so the UI renders "~520 mm (estimate)" instead of pretending a datasheet said it. **Use this for all validation math.**
- **`modelsByCategory()`** → `{category: [modelId, …]}`, sorted by short name. Built for the drag-and-drop hardware palette.
- **`saveUserModel(model)` / `removeUserModel(id)` / `isUserModel(id)`** — CRUD over `cabplanner.v1.models`. `saveUserModel` writes storage *and* merges into the live `CATALOG`, so a new model appears everywhere without a reload. User models are merged at load (lines 435-440) and always get `user: true`.

---

# 5. Asset work this session — exact provenance

## EX4200-48T
Front and rear user photos, cropped to the faceplate face, 3× bicubic upscale, unsharp 0.35.

**48 front port anchors measured off the photo**, not laid out procedurally. The panel is four blocks of 12 with a wider gutter between blocks; ports run 0..47 where **even index = top row, odd = bottom row**. Anchor pitch within a block ≈ 0.0317 normalised; gutters at indices 12, 24, 36. Uplink corrected from a 2×2 grid to **4× SFP in one row** (`ge-0/1/0..3`).

Rear anchors: 2× Virtual Chassis ports (left), USB, console (RS232), mgmt `me0`, plus PSU with C14 inlet and fan.
⚠️ **The rear console-vs-mgmt left-to-right assignment is inferred from standard Juniper ordering, not read off the photo. Confirm on hardware.** Called out in the model note.

## AP7911B — rectification detail (reusable technique)
Only a 3/4 perspective shot exists. Rather than discard it:

1. Detected the 16 outlet bodies as connected components in a mid-grey luminance band.
2. Took 8 outlet-corner correspondences between ideal faceplate mm coordinates and image px.
3. Solved an 8-parameter homography by DLT least squares (Gaussian elimination on the normal equations). **Max reprojection error 1.65 px.**
   `H = [1.67963, -0.04782, 185.37940, -0.14589, 1.95810, 384.54917, -0.00067, -0.00014]`
4. Inverse-warped with bilinear sampling over faceplate space X ∈ [-75, 400] mm, Y ∈ [-52, 86] mm at 3400×988.
5. Auto-detected the chassis bbox by dark-pixel row/column fraction, cropped `(365,120)-(3320,887)`, then **stretched to the true 445 × 88.9 mm aspect (5.0056)** so measurements off the image are physically meaningful. Final 2955×590, aspect 5.0085.
6. Re-measured the outlet cage grid on the result: left edge **281 px**, pitch **233.3 px**, body **210×140 px** → normalised anchors written for both banks of 8.

`photo.aspect` stored as `2955 / 590`. **No rear photo exists and the user confirmed there is none** — do not add a rear panel for it.

## BH chassis + motherboard composite — the pattern to extend
The important reusable idea in this session.

**Problem:** the BH chassis is one physical chassis but its I/O plate is motherboard-dependent, so every board build is effectively a different faceplate.

**Solution:** one chassis plate layer with the I/O window **punched through to transparent** (`globalCompositeOperation = 'destination-out'`), and each variant composites that board's rear-I/O photo *behind* the window. Adding a board:
1. Crop the board's rear-edge photo to the I/O strip.
2. Composite: dark interior fill → clip to window rect → draw board photo centred → recess shading gradient top/bottom → draw plate on top.
3. New `CATALOG` entry with `chassisOf`, `motherboard`, `photo.{front,plate,io}`, and port groups whose `anchors` are measured **on the composite**.

The plate never changes. Naming convention: **`BH Chassis [MC13-LE3]`**.

Window geometry in the current plate, `MM = 7.925 px/mm`, plate 429 × 44.45 mm (3400×352 px):
`window = x 20mm, y 5.4mm, w 242mm, h 33.3mm, corner radius 1.6mm`.

**MC13-LE3 rear I/O as mapped:** 2× GbE LAN (stacked pair), 1× dedicated MGMT/BMC LAN, 1× COM (DB9), 1× VGA, 2× USB 3.2 — all with measured anchors.
⚠️ Unconfirmed: that the stacked pair is the 2× LAN and the separate port is the dedicated BMC.

---

# 6. Open items — highest value first

## 6.1 Remove the catalog zoom control ⚠️ user explicitly rejected it
A 1×/2×/3×/5× zoom row was added to `Hardware Catalog.dc.html`. **User: "zoom control to make faceplate readable is not what i want. i will have to supply high res images then."**

To revert, remove:
- `zoomVals()` from the logic class (returns `zoomWidth`, `zoomOverflow`, `zoomHint`, `zoomOptions`).
- The two `Object.assign(…, this.zoomVals())` wrappers in `renderVals()` — one in the loading-state early return, one in the main return. Restore both to plain object literals.
- The zoom button row in the header `<div>` (the `<sc-for list="{{ zoomOptions }}">` block).
- The two scroller wrappers `<div style="width:100%; overflow-x: {{ zoomOverflow }} …">` around the front and rear faceplate panels; restore the inner div's `width: {{ zoomWidth }}` to `width:100%`.

Then swap in the high-res images the user supplies. **Anchors are normalised, so higher-res images drop in without re-measuring** — only update `photo.aspect` if the crop's aspect changes.

Keep these catalog-viewer improvements (not objected to): `max-width` 1080→1360; the `dims` line showing PDU capacity / PSU count and flagging estimated depths with `~`; sidebar meta flagging `custom`/`generic`; header row spacing fix (the h2 was colliding with the note).

## 6.2 Rework the BH chassis plate ⚠️ user rejected the current draw
Verbatim: *"the boot hardware chassis is all wrong. it needs to look like its fit realistically, also missing power button and psu portion."*

Current drawn plate, left to right: thumbscrew · I/O window · thumbscrew · boot HARDWARE badge · vent slots · label `NY1-65-6414`.

**Missing the power button and the PSU section.** Proportions do not read as a real chassis. Also unexplained: large circular cutouts visible in the stacked photo (fan openings?) absent from the drawn plate.

**Before redrawing, get a straight-on chassis photo or a written left-to-right element order.** The stacked photo is ~15° off-axis with only ~85 px of vertical detail per plate and partial occlusion — rectifying it to a 9.65:1 strip is measurably blurry, which is why the plate was drawn. Do not spend another cycle trying to rectify it.

## 6.3 Version bump to v0.7.0
Not done. New models + photo skins + validation metadata + user-model storage justify a minor bump. Touch **all four**: `README.md` ("Current version: v0.6.7"), `CHANGELOG.md` (new top entry), the Hub's release-notes panel, and `github.md`'s `## Last sync` (move the current one into `## Sync history`).

## 6.4 The 3D editing suite — BUILT
See §7 for what shipped and what is still worth adding.

## 6.5 QoL + polish pass across all five tools
Explicitly asked, unstarted: *"QoL and polish pass everything we have made so far. make it perfect before we continue."* Nothing was agreed about scope — worth a short list back to the user rather than guessing.

## 6.6 Regenerate the standalone bundles
Both `* (standalone).html` files predate every change in this session.

---

# 7. The 3D editing suite — as built

`Cabinet 3D Editor.html`. Built as a copy of the viewer; `Cabinet 3D.html` is untouched and still the read-only walk-through.

## What shipped
- **Hardware key** (left sidebar): every catalog model grouped by category, with U height and port count. Press an item to arm it, then click a U — or drag straight from the key onto a U. Shift-click while placing keeps the model armed for repeat drops.
- **Ghost preview**: green where the model fits, red where it collides or runs past the end of the rack. Tooltip names cabinet, U and face before you commit.
- **Editing**: move between Us and front↔rear (drag, or arrows / shift-arrows for 5U), resize span (`[` `]`), rename, swap model, delete, multi-select (shift-click, `Ctrl/Cmd+A` for the whole cabinet), copy/paste between cabinets, undo/redo (60-snapshot cap).
- **Cabinets**: add, duplicate, rename, delete; `row` / `col` fields position them. Odd rows rotate π so fronts face a shared cold aisle; perforated floor strips are rebuilt per row.
- **Checks panel**: U collisions, depth vs usable rail depth (`RACK_D*1000 - 90` mm), load vs derated PDU capacity (`capacityA × volts × derate`), mixed airflow in one cabinet, and both PSU cords on one PDU (reads the connections store). Click a warning to fly to the device.
- **Cabinet totals**: occupied/free U, device count, draw, weight, PDU headroom. Estimated figures are prefixed `~`.
- **Model editor**: dimensions, mounting (rack or 0U), airflow, PSU count, PDU capacity, and any number of port groups. Writes through `saveUserModel` to `cabplanner.v1.models`, then rebuilds palette and scene. Groups created here are marked `assumed: true` on purpose.
- **0U support**: `mount:"zeroU"` models mount in the rear channel (left or right, switchable in the inspector), consume no U and are exempt from collision.
- **QoL**: fill a cabinet's free Us with blanking panels in one action; Front / Rear / Aisle / Fit camera moves relative to the selected cabinet; Isolate dims every cabinet but the selected one; Save file / Open file JSON round-trip.

## Performance decisions (this is what "scaling" meant)
- **Two invisible drop planes per cabinet**, not 94 slot meshes. Raycast the plane, derive U from local y: `floor((y - BASE_Y)/U) + 1`.
- **Per-cabinet LOD** above 6 cabinets: full build within `LOD_DIST` (4.6 m), box proxy with a fill bar beyond. Recomputed on a 160 ms debounce and only when the level string actually changes.
- Idle frame governor (skips every other frame after 900 ms of no interaction), 1.5× pixel-ratio cap, `shadowMap.autoUpdate = false` with explicit `needsUpdate`, and a **Shadows toggle** for wide rooms.
- `disposeTree()` disposes geometries and only materials tagged `userData.__own` — shared `M.*`, `portMatCache` and texture caches must survive a rebuild. **Any inline material you add in a device builder must be wrapped in `own(...)` or it leaks on every rebuild.**

## Data model
```js
RACKS = [{ id, name, row, col, cells: [
  { id, model, top, span, side:'full'|'cold'|'hot', name, kind, channel }
]}]
```
- `model` is the catalog id and is authoritative. Legacy layouts with only `kind` still resolve via `modelOfCell()` → `KIND_TO_MODEL`.
- `channel` only applies to 0U models.
- Persists to `cabplanner.v1.main`, the same key the 2D planner uses, so the two stay in sync. `row`/`col` are additive and older views ignore them.
- `normaliseIds()` runs on every rebuild and reassigns any duplicate cell id, because `DEVREG` / `CELLMETA` are keyed by cell id alone. **Do not remove it** — duplicating and pasting cabinets would otherwise collide silently.

## Verified working
Placement, collision rejection ("U33 is occupied"), move, span resize, undo/redo, delete, multi-select, PDU load math (30A × 208V × 0.8 = 4992 W checked against a 4810 W stack), the over-85% warning, and the model editor modal.

## Still worth adding
- Wiring from inside the editor (today the editor renders cables from the connections store but does not create them — that is still the viewer's job or the Connections tool's).
- Drag a whole cabinet on the floor plan rather than typing row/col.
- Snap-to-neighbour when dropping (currently exact-U only).
- A row/aisle overview camera preset.
- Weight-per-cabinet limit check (the field is collected, no rating exists to check against yet).

# 8. Conventions to keep

- **`catalog.js` is the only place hardware facts live.** No tool hard-codes a port list.
- The guarded IIFE stays — a second evaluation must be a no-op, not a redeclaration error.
- Plain script, not ES module — `file://` must keep working (v0.6.5 fix; don't regress).
- Anchors normalised 0–1 against the photo, so image swaps are free.
- `assumed: true` / `est: {}` / `note` prose are the three honesty mechanisms. Use them instead of quietly guessing.
- Brand: orange accent `#f7981d`, dark panel UI, Poppins headings, IBM Plex Mono for addresses and metadata.
- Cable colour code: **yellow IPMI, green public, orange private, red power.**
- Versioning: features bump minor, fixes/polish bump patch. **v1.0 is reserved** for confirmed BH chassis I/O plate + real Supermicro model + photo-textured 3D skins + team sign-off.

---

# 9. Unresolved questions for the user

1. **Straight-on BH chassis photo**, or the plate's real left-to-right element order — specifically where the power button and PSU sit, and what the large circular cutouts are.
2. **MC13-LE3:** confirm the stacked pair is 2× LAN and the separate port is the dedicated MGMT/BMC.
3. **EX4200 rear:** which RJ45 is console and which is mgmt.
4. **Supermicro exact SKU** — `supermicro-1u` still has `groups: []`.
5. **High-res faceplate images** — the user said they will supply these instead of a zoom control.
6. **What the "QoL and polish pass" covers** — never scoped; the editor absorbed some of it, the other four tools have not been swept.
7. Whether EX4200 is even the right distribution/mgmt model (inferred from a prior layout, never confirmed).
8. A per-cabinet weight rating, so the weight total can actually be checked against something.


---

# 10. v0.8.0 — theme + interop (read this before styling anything)

## The theme is one file
`theme.css` holds every colour, radius, shadow and font token, light and dark.
`theme.js` applies the stored preference **before first paint** (no flash) and
exposes `window.CabTheme` (`current/isDark/toggle/set/bind`). Every page loads
both. To restyle the toolkit, edit `theme.css` — do not add colours to a tool.

- Tools declare identity with `document.documentElement.dataset.tool = "planner"`
  (also `catalog`, `wiring`, `scene`, `editor`). That selects a `--tool` /
  `--tool-soft` / `--tool-ink` triple used for headers, active states and icons.
- **Chrome uses greys and `--tool`. Categorical colour is data** — device kind,
  cable class, cold/hot, port type. Those stay literal hex in the tools on
  purpose. `#0ea5e9` in Connections is the RJ45 port-type colour, not chrome.
- The 3D scenes read `--scene-bg`, `--scene-fog`, `--scene-floor` via
  `getComputedStyle` and re-read on the `cabthemechange` event, so flipping the
  theme repaints the room without a reload. Any new scene colour must go through
  `readSceneTheme()` or it will not follow the theme.
- `--grid` is transparent by default; it drives the old graph-paper background,
  which is off deliberately.
- Buttons: **one filled primary per view** (`--primary-bg`/`--primary-fg`), grey
  outlines elsewhere, `--danger-line` outline for destructive actions.

## Two interop bugs — the pattern to remember
Both were the same mistake: a tool assuming it had written the data.

1. **The 3D environment invented a cabinet.** With nothing saved it fell back to
   `DEFAULT_CELLS`, a hard-coded sample that existed in no store. It read as a
   real cabinet the other tools could not see, and vanished the moment a real one
   was added. Now gated behind `USING_SAMPLE` with an on-screen notice, and the
   sample-only decoration (section labels, filler racks) is gated with it.
2. **The 2D planner rendered nothing** on an editor-written layout. It did
   `rack.uLabels[u]` in two places; the editor never writes `uLabels`, so
   `renderVals` threw and every `{{ hole }}` came out empty while static markup
   still painted. **That failure signature — static text renders, all holes blank
   — means renderVals threw.** Guarded now, plus `kindOf()` bridging
   `model` ↔ `kind` and a skip for 0U cells.

New cells carry **both** `model` and `kind`. Anything reading saved layout data
must tolerate either, and must not assume optional fields exist. `DATAFLOW.md` is
the reference.

## Other v0.8.0 changes
- Hub: Cabinet Inventory table (derived, never stored) and Export all (layout +
  wiring + custom models in one JSON).
- Port Catalog: search over model names, port types and addresses; the rejected
  zoom control is gone.
- Connections: **stale-entry detection.** Deleting gear does not delete its
  cables, so `staleReport()` compares each device's `src` cell id against the
  live layout and offers a one-click clear. Also fixed: `cabplanner.v1.theme` was
  being listed as an importable layout because it shares the key prefix — the
  exclusion list is `['connections','theme','models']`.
- The catalog has **12** models, not 14 — the v0.7.0 notes said 14 and are corrected.
- **Standalone builds: all six tools, rebuilt at v0.8.0.** `Hub`, `Cabinet Layout`,
  `Hardware Catalog`, `Connections`, `Cabinet 3D`, `Cabinet 3D Editor` — each
  `(standalone).html`. Previously only two existed and both predated the reskin.
  The two plain `.html` tools bundle directly; the four DCs need a bundler input
  copy carrying a `__bundler_thumbnail` template, and those inputs are named
  `Hub-export` / `Layout-export` / `Catalog-export` / `Wiring-export`.dc.html
  (parentheses in a filename break the script tooling). Inputs are gitignored —
  they are build artefacts. **Regenerate every standalone after any change to a
  tool, `catalog.js` or `theme.css`, or they silently ship the previous look.**

## Shipped after the reskin
- **Editor wiring, both faces.** `Wire` mode (toolbar or `W`) arms a port and runs
  a cable to a compatible one, with ghost preview and auto-suggested class; it
  writes to the same `cabplanner.v1.connections` store the other tools read via
  `ensureDevice()`. **The real fix was `portFacing(dev, addr)`**: routing used to
  come from `facing(dev)` (the device's mounting side), so a front-mounted
  device's rear ports sent cables out the front. Direction now comes from the
  port's own local z, flipped by the device rotation. Any new cable geometry must
  use `portFacing`, not `facing`.
- **Cable BOM** in Connections. `cableLength()` walks the real path (faceplate
  exit → vertical manager → vertical ΔU → far end → service loop each end; rack
  pitch across cabinets, tray climb across rows) from the layout's U positions,
  and `orderFor()` maps it to what the site buys. Site facts captured from the
  user: **stock is 5/7/10 ft, yellow for IPMI and green for public; private runs
  are custom-made** so they are never rounded — they list per length as a cut
  list. Over 10 ft in a stocked class is flagged as a special order. Tunables live
  in `GEOM` and `STOCK_FT` / `CUSTOM_CLASSES` at the top of the logic class.
  Every figure is an estimate and labelled so.
- **Stale-entry detection** in Connections (`staleReport()` / `clearStale()`),
  because deleting gear never deleted its cables.

## Still open after v0.8.0
- **`FEATURE-GAPS.md` is the roadmap.** Written from a user's chair, 15 gaps in
  three tiers with a build order. Item 1 (cable BOM) is done. Next by that order:
  A/B power feeds with breaker load and a "drop feed A" simulation; the print pack
  (front/rear elevation, patch schedule, build sheet); asset fields (serial, asset
  tag, mgmt IP, VLAN); per-cabinet dimensions. Items 2, 4 and 5 add fields, so
  agree the shape before writing code.
- BH chassis plate redraw (needs a straight-on photo).
- Higher-res faceplate images.
- Supermicro 1U port map.
- `Cabinet 3D (standalone).html` and `Cabinet Layout (standalone).html` are stale
  and were not regenerated.
