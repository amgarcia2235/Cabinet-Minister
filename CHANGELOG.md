# Changelog

All notable changes to cabinetminister. Features bump the minor (0.x); fixes, reskins and data corrections bump the patch (0.x.y). v1.0 is reserved for a team-signed-off release: confirmed BH chassis I/O plate, real Supermicro model in the catalog, photo-textured 3D skins.

## v0.8.0 — Reskin, cable BOM, cross-tool data fixes
- Reskinned every tool as a working engineer's system: neutral greys, structural rules instead of floating cards, small radii and type, monospace for anything you would type into a switch. Colour is reserved for device kind, cable class, airflow and pass/warn/fail state.
- Light is now the default with a dark toggle in every tool; the choice persists across tools and sessions, and a dark-set machine gets dark before first paint.
- One theme file drives all six pages (`theme.css` tokens + `theme.js` boot/toggle). The 3D scenes read background, fog and floor from the same tokens, so flipping the theme repaints the room without a reload.
- Each tool carries its own muted accent (planner blue, catalog teal, wiring plum, 3D environment slate, editor amber) on its header, active states and Hub icon.
- Fixed: the 3D environment invented a hard-coded sample cabinet that existed in no store, so the planner and editor never saw it - and adding a real cabinet made it vanish, reading as "cabinet 1 did not register". The sample is now labelled as one and only appears when nothing is saved.
- Fixed: the 2D planner rendered nothing when opened on a layout the 3D editor wrote. It read two fields the editor does not write and threw, blanking the elevation. It now resolves either cell format, tolerates missing fields and skips 0U gear.
- Layouts round-trip both ways: gear added in the planner carries a catalog model id the 3D tools read, and cabinets keep row/position through either tool.
- The 3D environment honours row and position, so a room laid out in the editor shows in the same arrangement, odd rows facing about across a cold aisle, with a name plate per cabinet.
- Hub: Cabinet Inventory table (row, occupied/free U, devices, draw with estimates marked) and Export all, which writes layout, wiring and custom models to one JSON file.
- Port Catalog: search across model names, port types and specific addresses - `QSFP28` lists the models that have them and how many, `et-0/0/12` finds the model carrying it. The 0.7.0 faceplate zoom control is removed in favour of higher-resolution source images.
- Cable BOM in Connections: every run is estimated along its real path (out of the faceplate, across to the vertical manager, the vertical distance between the two Us, and a service loop each end; rack pitch for cabinet-to-cabinet, tray climb across rows), then turned into a purchase list. Matched to stocked 5/7/10 ft yellow and green; private runs are custom-made so they are listed per length as a cut list rather than rounded; anything over 10 ft in a stocked class is flagged as a special order. The CSV patch schedule now carries estimated length, order length and cable colour, with the BOM appended.
- Wiring in the 3D Editor: a Wire mode (toolbar or W) arms a port and runs a cable to a compatible one, with a ghost preview and auto-suggested class. Rear-face ports now route out of the back - direction was being taken from the device's mounting side, so a front-mounted device's rear ports sent cables out the front.
- Connections: stale-entry detection. Deleting gear does not delete its cables, so devices whose cell no longer exists in the layout are listed with a one-click clear that leaves the layout untouched. Also fixed cabplanner.v1.theme appearing as an importable layout.
- New `DATAFLOW.md`: what a cabinet and a cell actually are, which of the three stores holds what, how wiring joins back to the layout, where the Hub's numbers come from, and the model-vs-kind gotcha behind both bugs above.
- Buttons: one filled primary per view, grey outlines elsewhere, red outline on destructive actions. Decorative graph-paper backgrounds removed. PCFSoftShadowMap deprecation warning cleared in both 3D tools.
- Open: BH chassis plate still needs a redraw (missing power button and PSU section, blocked on a straight-on photo); higher-res faceplate images pending; Supermicro 1U unmapped; no server, so JSON files remain the unit of collaboration.

## v0.7.0 — 3D editing suite, catalog expansion, measured faceplates
- New tool: Cabinet 3D Editor. Drag hardware from a key into any empty U (ghost turns green where it fits, red where it does not), move gear between Us and front/rear, resize U span, rename, swap model, delete, multi-select, copy/paste between cabinets, and undo/redo across all of it. Keyboard throughout - arrows move, [ and ] change span, F flips side, Ctrl/Cmd+A/C/V/Z, Delete removes.
- Cabinets are editable objects: add, duplicate, rename, delete, and place on a row/position grid. Odd rows face the opposite way so fronts meet across a cold aisle, and the perforated floor tiles follow the aisles.
- Live checks while you build: U collisions, devices deeper than the usable rail depth, load past derated PDU capacity, mixed airflow in one cabinet, and a device with both PSU cords on the same PDU. Click a warning to fly to the device. A totals panel tracks occupied U, draw, weight and PDU headroom.
- Custom model editor: dimensions, mounting, airflow, PSU count, PDU capacity and any number of port groups. Saved models merge into the catalog, so they appear in the planner, port catalog and connections too.
- Built for big rooms: two invisible drop planes per cabinet instead of 94 slot meshes, per-cabinet level of detail so distant racks fall back to a proxy, an idle frame governor, and a shadows toggle.
- Six new models: generic 1U/2U/4U servers, a vertical 0U PDU (24x C13 + 6x C19, 30A 208V, first `mount:"zeroU"` model), a 1U blanking panel, and BH Chassis [MC13-LE3]. The editor can fill a cabinet's free Us with blanks in one action.
- EX4200-48T front and rear photo skins, with all 48 access ports anchored to their real cages (four blocks of 12, even index on the top row) and the uplink module corrected to 4x SFP in one row.
- AP7911B rectified from a 3/4 product shot to a true front elevation - homography fitted on the 16-outlet grid (1.65 px max reprojection error), then stretched to the real 445 x 88.9 mm aspect so measurements off the image are meaningful. Both banks of 8 anchored to the re-measured cage grid.
- Chassis and motherboard split into two layers: a reusable chassis plate with the I/O window punched through to transparent, and the board's own rear-I/O photo composited behind it. Adding a board is one photo plus one catalog entry.
- Validation metadata on every model - PSU count, airflow direction, and PDU capacity/voltage/derate. Values with no datasheet source live in an `est` block and are returned flagged, so an estimate is shown as one.
- New helpers `specOf()` (physical facts, each paired with an est boolean) and `modelsByCategory()` (grouped ids for palettes and pickers), plus `saveUserModel` / `removeUserModel` / `isUserModel` over `cabplanner.v1.models`.
- New port types LC and BUTTON. Port Catalog widened, spec line states PDU capacity and PSU count and prefixes estimated depths with `~`, sidebar flags custom and generic models.
- Offline Hub bundle added (`cabinetminister Hub (offline).html`) - single self-contained file, fonts and runtime inlined; Hub view only, inter-tool links are inert in the single-file build.
- Open: the BH chassis plate needs a redraw (missing power button and PSU section, blocked on a straight-on photo); higher-res faceplate images pending; Supermicro 1U still unmapped; the Cabinet 3D and Cabinet Layout standalone bundles are not regenerated.

## v0.6.7 — Airflow & image quality (patch)
- QFX5100-48T corrected to AFO (front-to-back): rear FRUs recoloured from AFI blue to the same AIR OUT orange as the QFX5200, and the fan and PSU labels now read AIR OUT (AFO).
- Airflow direction is a catalog field and shows on the Port Catalog spec line, so a unit's direction is stated rather than inferred from the picture.
- All four switch faceplate images resampled to 4096 px wide with edge sharpening — panels stay crisp when zoomed in the Port Catalog and as 3D textures.
- catalog.js made re-entrant, so a second evaluation is a no-op instead of a redeclaration error; the console stays clean across all four tools.
- Port Catalog panel photos no longer fetch an unresolved template placeholder while the page streams.

## v0.6.6 — QFX5100-48T skin (patch)
- Front and rear photo skins added for the QFX5100-48T, cropped to the faceplate face from a real product shot; the Port Catalog, planner and 3D scene all pick them up automatically.
- All 54 front ports anchored to their real cages — 48× 10GBASE-T in three blocks of 16 (even = top row) and the 6 QSFP+ uplinks — measured off the photo rather than laid out procedurally.
- Rear FRU panel mapped: C0 RJ-45 (em0) and CON stacked centre, C0-fiber and C1 SFP cages left, USB right. The C0 fiber alternative is now a listed port, matching the QFX5200 entry.
- Corrected the model note: five fan modules and two AC PSUs (AFI, air in through the FRU end).

## v0.6.5 — Local-file fix (patch)
- Toolkit now runs straight from disk (double-click, no server): catalog.js converted from an ES module to a plain script, so the Port Catalog, Connections and 3D scene load outside a web host — GitHub downloads included.

## v0.6.4 — Performance (patch)
- 3D CPU use cut sharply: shadow map renders once instead of every frame, ~30fps idle governor (full 60fps while interacting), hover raycasts throttled, pixel ratio capped at 1.5x, LED churn reduced.
- Section labels draw on top of the rack — no more clipping.
- Named servers lead with their hostname on the faceplate, model as the sub-line.

## v0.6.3 — Rear fans & PSUs (patch)
- Switch rear panels render their FRU modules: dual PSUs with inlet, grille and status LED, plus a spinning fan-tray bank.
- QFX5200 shows its documented five fan trays and two power supplies; other models show a generic redundant bank until doc-level counts are confirmed.

## v0.6.2 — Verified hardware (patch)
- Every catalog.js spec re-checked against official docs — Juniper QFX5200/EX4200 hardware guides, the QFX5100 datasheet, APC's AP7911B specs.
- Mgmt, console and USB moved to the rear FRU panels on all three Juniper models; the EX4200 gains its dual Virtual Chassis ports, the PDU its L6-30P input cord.
- Port Catalog draws front and rear panels, the 3D places rear ports on the hot-aisle face, and unsourced depths read "TBC" instead of a guess.

## v0.6.1 — Panel look (patch)
- Hub rebuilt in the ReliableSite dedicated-panel style — dark top bar with two-tone wordmark, icon sidebar with section labels, header-strip cards, Poppins type.
- Orange brand accent across all four tools, icons added to My Tools, toolkit renamed cabinetminister.

## v0.6 — 3D wiring
- 3D faceplates generated from catalog.js, so every addressable port exists at its real position.
- Hover a port for address, type, group and wired status; click to arm it (cable class auto-suggested), click a compatible destination to run the cable — data/power mismatches rejected.
- Cables follow the site color code (yellow IPMI, green public, orange private, red power), route power down the left channel and data down the right, and save to the same wiring store Connections reads. Click a cable to zoom or delete.

## v0.5 — General planner
- CR8-specific naming stripped so the toolkit serves any cabinet build-out.
- Planner starts from a single empty 47U cabinet plus the reusable template.
- ReliableSite color profile introduced across the tools.

## v0.4 — 3D environment + hub
- three.js data-center hall: 47U rack row, hot/cold aisles, perforated tiles, overhead cable tray, orbit with deep zoom, section labels.
- Hub landing page with live stats from saved layouts.

## v0.3 — Connections
- Port-to-port and PDU-outlet-to-PSU mapping on real catalog addresses.
- Per-device port usage, per-PDU load, cable labels, CSV patch-schedule export, JSON save/open.

## v0.2 — Hardware catalog
- catalog.js becomes the single source of truth — each model declares its size and port groups, generating addressable ports (et-0/0/12, C13-7, ...) rendered as clickable faceplates.

## v0.1 — 2D planner
- Dual-sided 47U rack elevation — cold and hot slots fill independently — with click-to-add, drag, span, rename, auto-save and JSON save/open.
