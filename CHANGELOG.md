# Changelog

All notable changes to cabinetminister. Features bump the minor (0.x); fixes, reskins and data corrections bump the patch (0.x.y). v1.0 is reserved for a team-signed-off release: confirmed BH chassis I/O plate, real Supermicro model in the catalog, photo-textured 3D skins.

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
