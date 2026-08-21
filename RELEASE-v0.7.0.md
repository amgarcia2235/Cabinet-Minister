# v0.7.0 — 3D editing suite, catalog expansion, measured faceplates

**Tag:** `v0.7.0` · **Target:** `main`

The 3D scene becomes an editor. Everything in the toolkit moves to v0.7.0 together — one catalog, one layout store, five tools that stay in step.

## 3D Cabinet Editor — new tool

`Cabinet 3D Editor.html` sits alongside the read-only 3D view. Full build-out in the scene itself:

**Hardware key.** Every catalog model, grouped by category, with U height and port count. Drag one into a U — or click it and click a U — and it lands. The ghost turns green where it fits and red where it doesn't, and the tooltip names the cabinet, the U and the face before you commit.

**Editing.** Move gear between Us and front↔rear, resize a device's U span, rename it, swap its model, delete it. Multi-select with shift-click, copy and paste between cabinets, and undo/redo across the lot. Keyboard throughout: arrows to move (shift for 5U), `[` `]` for span, `F` to flip side, `Ctrl/Cmd+A/C/V/Z`, Delete to remove.

**Cabinets and rows.** Add, duplicate, rename and delete whole cabinets, and place them on a row/position grid. Odd rows face the opposite way, so fronts meet across a cold aisle and the perforated floor tiles follow the aisles automatically.

**Live checks.** As you build, the editor flags U collisions, devices deeper than the usable rail depth, load past derated PDU capacity, mixed airflow in one cabinet, and a device with both PSU cords on the same PDU. Click a warning to fly to the offending device. A cabinet totals panel keeps a running count of occupied U, draw, weight and PDU headroom.

**Custom hardware.** A model editor for anything the catalog doesn't carry: dimensions, mounting, airflow, PSU count, PDU capacity, and as many port groups as the panel has. Saved models merge into the catalog, so they show up in the planner, port catalog and connections too.

**Built for big rooms.** Two invisible drop planes per cabinet instead of 94 slot meshes; per-cabinet level of detail so distant racks fall back to a proxy; an idle frame governor; and a shadows toggle for when a room gets wide.

## Hardware catalog

Six new models, bringing the catalog to 12:

- **Generic 1U / 2U / 4U servers** — nominal geometry for space planning, with drive bays and rear I/O laid out to a typical rackmount. Marked generic; rear I/O is `assumed` until a real SKU replaces it.
- **Vertical 0U PDU** — 24× C13 + 6× C19 on a 30A 208V feed, mounted in the rear channel and consuming no U.
- **1U blanking panel** — seals an empty U so cold air can't bypass the gear. The editor can fill a cabinet's free Us with them in one action.
- **BH Chassis [MC13-LE3]** — the first motherboard variant of the Boot Hardware chassis.

New port types `LC` and `BUTTON`, so fiber pairs and power buttons are addressable rather than drawn decoration.

## Faceplates measured off real panels

**EX4200-48T** gains front and rear photo skins. All 48 access ports are anchored to their real cages — four blocks of 12, even index on the top row — measured off the panel rather than laid out procedurally. The uplink module is corrected from a 2×2 grid to 4× SFP in a single row. Rear panel maps the dual Virtual Chassis ports, USB, console, mgmt `me0`, and the PSU with its C14 inlet.

**AP7911B** only exists as a 3/4 product shot, so the panel was rectified to a true front elevation: a homography fitted on the 16-outlet grid (max reprojection error 1.65 px), inverse-warped, then stretched to the unit's real 445 × 88.9 mm aspect so measurements taken off the image mean something. The outlet cage grid was then re-measured on the result and both banks of 8 anchored to it.

## Chassis and motherboard layering

The BH chassis is one physical chassis whose I/O plate changes with the board inside it. Rather than one entry per build, the faceplate is now two layers: a reusable chassis plate with the I/O window punched through to transparent, and the board's own rear-I/O photo composited behind it. Adding a board is one photo plus one catalog entry — the plate never changes.

`BH Chassis [MC13-LE3]` is the first: 2× GbE LAN, dedicated MGMT/BMC LAN, COM (DB9), VGA, 2× USB 3.2, all anchored on the composite.

## Data the planner can act on

Every model now carries the physical facts a layout check needs: PSU count, airflow direction, and for PDUs the capacity, voltage and derate factor. Where no datasheet value exists, the number lives in an `est` block and is returned flagged, so a reading is shown as an estimate instead of being passed off as a spec.

- `specOf(modelId)` returns depth, weight and draw each paired with an `est` boolean.
- `modelsByCategory()` groups every model id for palettes and pickers.
- `saveUserModel` / `removeUserModel` / `isUserModel` manage user-defined models, merged into the catalog at load from `cabplanner.v1.models`.

## Port Catalog

Wider layout. The spec line now states PDU capacity and PSU count, and prefixes estimated depths with `~` rather than presenting them as measured. The sidebar flags `custom` and `generic` models so a nominal placeholder isn't mistaken for a mapped SKU.

## Offline bundle

`cabinetminister Hub (offline).html` is a single self-contained file — fonts and runtime inlined, no network needed. It is the Hub view only; the sidebar links to the other tools are page navigations and stay inert in the single-file build. Use the repo files for the working toolkit.

## Known open

- **The BH chassis plate needs a redraw** — it is missing the power button and PSU section and doesn't yet read as a real chassis. Blocked on a straight-on chassis photo.
- **Higher-resolution faceplate images are pending.** Port anchors are normalised, so they drop in without re-measuring anything.
- **Supermicro 1U has no port map** — exact SKU unknown.
- **The Cabinet 3D and Cabinet Layout standalone bundles are not regenerated** and predate this release.

## Upgrade notes

No migration. The editor reads and writes the same `cabplanner.v1.main` layout the 2D planner uses, so the two stay in sync; cabinets gain optional `row` and `col` fields that older views ignore. One key is added: `cabplanner.v1.models` for user-defined models. `catalog.js` remains a plain script, so the toolkit still runs from a local folder with no server.
