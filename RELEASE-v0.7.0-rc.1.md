# v0.7.0-rc.1 — Catalog expansion, measured faceplates, validation data

**Tag:** `v0.7.0-rc.1` · **Target:** `main` · ☑️ **Set as a pre-release**

Pre-release. The catalog work is complete and safe to use; the 3D editing suite this version is building toward is not in this build, and two items below are known-open.

## Hardware catalog

Six new models, bringing the catalog to 14:

- **Generic 1U / 2U / 4U servers** — nominal geometry for space planning, with drive bays and rear I/O laid out to a typical rackmount. Marked generic; rear I/O is `assumed` until a real SKU replaces it.
- **Vertical 0U PDU** — 24× C13 + 6× C19 on a 30A 208V feed, mounted in the rear channel and consuming no U. First model to use `mount: "zeroU"`.
- **1U blanking panel** — seals an empty U so cold air can't bypass the gear.
- **BH Chassis [MC13-LE3]** — the first motherboard variant of the Boot Hardware chassis.

New port types `LC` and `BUTTON`, so fiber pairs and power buttons are addressable rather than drawn decoration.

## Faceplates measured off real panels

**EX4200-48T** gains front and rear photo skins. All 48 access ports are anchored to their real cages — four blocks of 12, even index on the top row — measured off the panel rather than laid out procedurally. The uplink module is corrected from a 2×2 grid to 4× SFP in a single row. Rear panel maps the dual Virtual Chassis ports, USB, console, mgmt `me0`, and the PSU with its C14 inlet.

**AP7911B** only exists as a 3/4 product shot, so the panel was rectified to a true front elevation: a homography fitted on the 16-outlet grid (max reprojection error 1.65 px), inverse-warped, then stretched to the unit's real 445 × 88.9 mm aspect so measurements taken off the image mean something. The outlet cage grid was then re-measured on the result and both banks of 8 anchored to it.

## Chassis and motherboard layering

The BH chassis is one physical chassis whose I/O plate changes with the board inside it. Rather than one entry per build, the faceplate is now two layers: a reusable chassis plate with the I/O window punched through to transparent, and the board's own rear-I/O photo composited behind it. Adding a board is one photo plus one catalog entry — the plate never changes.

`BH Chassis [MC13-LE3]` is the first: 2× GbE LAN, dedicated MGMT/BMC LAN, COM (DB9), VGA, 2× USB 3.2, all anchored on the composite.

## Data the planner can act on

Every model now carries the physical facts a layout check needs: PSU count, airflow direction, and for PDUs the capacity, voltage and derate factor. Where no datasheet value exists, the number lives in an `est` block and is returned flagged, so a reading can be shown as an estimate instead of being passed off as a spec.

- `specOf(modelId)` returns depth, weight and draw each paired with an `est` boolean.
- `modelsByCategory()` groups every model id for palettes and pickers.

## User-defined models

Models saved to browser storage are merged into the catalog at load, so a model created in one tool appears in all of them without a code change. `saveUserModel` / `removeUserModel` / `isUserModel` manage them; they're flagged `user` wherever they surface. Groundwork for the model editor.

## Port Catalog

Wider layout. The spec line now states PDU capacity and PSU count, and prefixes estimated depths with `~` rather than presenting them as measured. The sidebar flags `custom` and `generic` models so a nominal placeholder isn't mistaken for a mapped SKU.

## Known open in this pre-release

- **The 3D editing suite is not in this build.** Scope is agreed — drag-and-drop placement from a hardware key, move/delete/rename/resize, cabinet and row management, multi-select, undo/redo, live validation, and a custom model editor — but no editor code has landed.
- **The BH chassis plate needs a redraw.** It is missing the power button and PSU section and doesn't yet read as a real chassis. Blocked on a straight-on chassis photo.
- **A faceplate zoom control shipped in the Port Catalog and is being removed** in favour of higher-resolution source images. Port anchors are normalised, so higher-res images drop in without re-measuring anything.
- **Supermicro 1U still has no port map** — exact SKU unknown.
- **The Cabinet 3D and Cabinet Layout standalone bundles are not regenerated** and predate everything above. A fresh offline Hub bundle ships with this release (see below).

## Offline bundle

`cabinetminister Hub (offline).html` is a single self-contained file — fonts and runtime inlined, no network needed. It is the Hub view only; the sidebar links to the other four tools are page navigations and stay inert in the single-file build. Use the repo files for the working toolkit.

## Upgrade notes

No migration. Storage keys are unchanged and one is added: `cabplanner.v1.models` for user-defined models. `catalog.js` remains a plain script so the toolkit still runs from a local folder with no server.
