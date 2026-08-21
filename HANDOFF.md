# HANDOFF — Cabinet Planner Toolkit ("cabinetminister")

**Written:** 2026-08-21 · **Repo:** `amgarcia2235/Cabinet-Minister` (branch `main`)
**Version in docs:** v0.6.7 — **the bump to v0.7.0 has NOT been done**
**Session state:** catalog extension + faceplate asset work landed. The 3D editing suite — the user's headline ask — is **not started**.

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
| `Cabinet 3D.html` | three.js scene — orbit/zoom to port level, hover to identify, click-to-wire, rear view | ~985 lines. **Plain `.html`, not a DC** — all-canvas/WebGL |
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

## 6.4 The 3D editing suite — the headline ask, not started
See §7.

## 6.5 QoL + polish pass across all five tools
Explicitly asked, unstarted: *"QoL and polish pass everything we have made so far. make it perfect before we continue."* Nothing was agreed about scope — worth a short list back to the user rather than guessing.

## 6.6 Regenerate the standalone bundles
Both `* (standalone).html` files predate every change in this session.

---

# 7. The 3D editing suite — confirmed scope and architecture

## Scope, confirmed by the user via form
**In:**
- Place gear into empty Us by dragging from a hardware key/palette
- Move gear between Us and front↔rear
- Delete gear
- Rename + edit device properties
- Resize a device's U span
- Add / remove / rename whole cabinets
- Arrange cabinets into rows & aisles
- Multi-select + copy/paste
- Undo / redo
- Validation warnings: **U collisions, depth won't fit the cabinet, PDU load over capacity, airflow AFO/AFI mismatch, both PSUs on the same PDU**
- **Full custom-model editor** → writes to `cabplanner.v1.models` via `saveUserModel`

**Out — explicitly:**
- No backend, no API, no multi-user, no roles/permissions. Storage stays **browser + JSON files**.
- **"Scaling to thousands of users" means PERFORMANCE ONLY** — many racks/rows staying smooth. That was the only option the user picked. Do not build sharing, presence, or a shared library.

Hardware key contents the user asked for beyond the catalog: **generic 1U/2U/4U servers** and **vertical/0U PDUs** — both now in the catalog. They did *not* ask for cable managers, shelves, UPS, KVM, or console drawers. Blanking panels weren't selected either, but `blank-1u` was added as the airflow-validation story needs it.

Standing note on fidelity: *"Pull full hardware models from manufacturer website or whatever. make them fully render accurately."*

## Current 3D architecture — code landmarks in `Cabinet 3D.html`
| Line | What |
|---|---|
| 150-151 | `U = 0.04445`, `EQ_W = 0.448`, `FRONT_Z = 0.47`, `BACK_Z = -0.47`, `RACK_W = 0.6`, `RACK_D = 1.07`, `POST = 0.028`, `BASE_Y = 0.06`, `N_U = 47` |
| 152-153 | `NET_COLOR` / `NET_LABEL` — ipmi yellow, public green, private orange, power red |
| 157 | `tex(w,h,draw)` — canvas→texture helper |
| 164 | `faceTex()` procedural faceplate (cached) |
| 234 | `yOfU(uBottom, span)` → `BASE_Y + (uBottom-1)*U + span*U/2` |
| 269 | `photoFaceTex(url,label,accent,aspect)` — photo skin on canvas so the chip draws over it; `PHOTO_CACHE` |
| 296 / 304 | `skin()` / `rearSkin()` |
| 325 | `rearDetail()` — dual PSU modules + fan bank |
| 355 | `addPortGroup()` — reads `region`/`anchors`, registers `userData.portPos` / `portType` |
| 398 | `buildFromCatalog(modelId, cell)` |
| 436 | `buildPatch(cell)` |
| 474 | `buildFrame()` — posts, rails, instanced cage nuts, U-number strip |
| 508 / 512 | `mountFront()` / `mountRear()` |
| 530 | `loadRacks()` — tries `.main` then `.blank`, sets `LOADED_KEY`, falls back to a sample build |
| 541 | `buildFromCell(cell)` |
| 549 | **`const DEVREG = {}, CELLMETA = {}`** — device registry keyed by `cell.id` |
| 550 | `populateInto(cells, contents, rackName, rackIdx)` |
| 567-576 | **The build loop — `loadRacks().forEach(...)` at module scope. This is what must become state-driven.** `RACK_PITCH = RACK_W + 0.08` |
| 691-696 | Connections store, `uid()`, `cellOfDev` |
| 772 | `rebuildCables()` |
| 788-830+ | Wiring interaction: `armed`, `selectedCable`, `suggestNet()`, `compatible()`, `renderWirePanel()` |

## Planned refactor
1. **State-driven rebuild.** Replace the module-scope `loadRacks().forEach(...)` with `rebuildScene()` over a mutable `RACKS` array. Each rebuild clears `DEVREG`/`CELLMETA`, disposes geometries and materials, then calls `rebuildCables()` and sets `renderer.shadowMap.needsUpdate = true`.
2. **⚠️ Cell ids must be unique ACROSS racks.** `DEVREG` and `CELLMETA` are keyed by `cell.id` alone. That works today only because ids happen not to collide; once cabinets can be added, duplicated, and pasted, they will. Namespace them (`r<rackIdx>-<cellId>`) or make ids globally unique at creation — and note `cellOfDev` parses `src.split('#')[2]`, so the connections store must stay consistent with whatever you choose.
3. **Rows and aisles.** Rack position from `rack.row` / `rack.col`:
   `pos = (col * RACK_PITCH, 0, row * (RACK_D + AISLE))`, odd rows rotated π so fronts face the cold aisle.
4. **Drop targets: two invisible planes per rack (front, rear) — NOT 94 slot meshes.** Raycast the plane, derive U from local y: `u = floor((y - BASE_Y)/U) + 1`. This is the difference between scaling and not.
5. **Occupancy test** for placement and moves: `sidesOverlap(a,b) = a==='full' || b==='full' || a===b`, then span-vs-span per U.
6. **Undo/redo** as JSON snapshots of `RACKS`, capped ~60. Cheap and correct; the model is small.
7. **Performance budget** — this is what "scaling" means here:
   - Per-rack LOD: full build only within N metres of the camera, box proxy beyond; recompute on camera settle and rebuild only racks whose level changed.
   - Keep the idle frame governor (~30fps idle, 60 while interacting) and the 1.5× pixel-ratio cap.
   - Auto-disable shadows above ~16 racks.
   - Keep shadow map rendering once rather than per frame (v0.6.4 win — do not regress).
8. **Validation** reads `specOf()` for depth/weight/watts/airflow/PSU count, and the PDU's `capacityA × volts × derate`. Surface warnings non-blockingly — visible, not modal.
9. **Preserve `Cabinet 3D.html` as the viewer; build the editor as a copy.** Do not turn the working viewer into a half-finished editor.

---

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
6. **What the "QoL and polish pass" covers** — worth confirming rather than guessing across five tools.
7. Whether EX4200 is even the right distribution/mgmt model (inferred from a prior layout, never confirmed).
