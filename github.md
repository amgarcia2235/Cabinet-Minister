repo: amgarcia2235/Cabinet-Minister
branch: main

## Last sync
date: 2026-08-21T00:00:00Z

### Updated in this project
- v0.8.0 — cable BOM with orderable lengths (5/7/10 ft stock, custom private runs); wiring in the 3D editor on both cabinet faces
- Full reskin to a shared theme (theme.css + theme.js), light default with dark toggle in every tool, per-tool accents
- Fixed two cross-tool data bugs: the 3D environment's phantom sample cabinet, and the 2D planner rendering nothing on an editor-written layout
- 3D environment honours cabinet row/position; layouts now round-trip between 2D and 3D
- Hub gains a Cabinet Inventory table and Export all; Port Catalog gains search and loses the rejected zoom control
- New DATAFLOW.md documenting the three stores and the model-vs-kind bridge

## Sync history
- 2026-08-21T00:00:00Z — v0.7.0: 3D Cabinet Editor, six new catalog models, EX4200/AP7911B faceplates, validation metadata
- 2026-08-21T00:00:00Z — v0.6.6/v0.6.7 QFX5100-48T skins, AFO correction, faceplates resampled to 4096 px, catalog.js made re-entrant
- 2026-08-20T22:05:54Z — repo connected, all 12 toolkit files verified upstream (v0.6.4); v0.6.5 local-file fix applied in project

## Screen map
| Project screen | Repo files |
|---|---|
| Hub.dc.html | Hub.dc.html, support.js |
| Cabinet Layout.dc.html | Cabinet Layout.dc.html, support.js |
| Hardware Catalog.dc.html | Hardware Catalog.dc.html, catalog.js, support.js |
| Connections.dc.html | Connections.dc.html, catalog.js, support.js |
| Cabinet 3D.html | Cabinet 3D.html, catalog.js |
| Cabinet 3D Editor.html | Cabinet 3D Editor.html, catalog.js |
| Faceplate skins | assets/qfx5200-32c-front.jpg, assets/qfx5200-32c-rear.jpg, assets/qfx5100-48t-front.jpg, assets/qfx5100-48t-rear.jpg, assets/ex4200-48t-front.png, assets/ex4200-48t-rear.png, assets/ap7911b-front.png |
| BH chassis variants | assets/bh-chassis-plate.png, assets/bh-chassis-mc13-le3-front.png, assets/mobo-mc13-le3-io.png, catalog.js |
| Theme | theme.css, theme.js |
| Release notes | RELEASE-v0.8.0.md, RELEASE-v0.7.0.md, CHANGELOG.md, Hub.dc.html |
| Data flow doc | DATAFLOW.md |
| Offline bundle | cabinetminister Hub (offline).html (built from Hub.dc.html) |
| Handoff | HANDOFF.md |
| Standalone bundles | Cabinet Layout (standalone).html, Cabinet 3D (standalone).html |
