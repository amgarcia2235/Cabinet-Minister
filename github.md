repo: amgarcia2235/Cabinet-Minister
branch: main

## Last sync
date: 2026-08-21T00:00:00Z

### Updated in this project
- v0.7.0-rc.1 — six new catalog models (generic 1U/2U/4U servers, 0U vertical PDU, 1U blank, BH Chassis [MC13-LE3])
- EX4200-48T front/rear photo skins with 48 measured port anchors; AP7911B rectified from a 3/4 shot to a true front elevation
- Chassis/motherboard layering: reusable plate with a transparent I/O window, board photo composited behind it
- Validation metadata on every model (psuCount, airflow, PDU capacity/volts/derate, est block) plus specOf() and modelsByCategory()
- User-defined models merged from cabplanner.v1.models
- Offline Hub bundle added; Cabinet 3D / Cabinet Layout standalone bundles NOT yet regenerated

## Sync history
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
| Faceplate skins | assets/qfx5200-32c-front.jpg, assets/qfx5200-32c-rear.jpg, assets/qfx5100-48t-front.jpg, assets/qfx5100-48t-rear.jpg, assets/ex4200-48t-front.png, assets/ex4200-48t-rear.png, assets/ap7911b-front.png |
| BH chassis variants | assets/bh-chassis-plate.png, assets/bh-chassis-mc13-le3-front.png, assets/mobo-mc13-le3-io.png, catalog.js |
| Release notes | RELEASE-v0.7.0-rc.1.md, CHANGELOG.md, Hub.dc.html |
| Offline bundle | cabinetminister Hub (offline).html (built from Hub.dc.html) |
| Handoff | HANDOFF.md |
| Standalone bundles | Cabinet Layout (standalone).html, Cabinet 3D (standalone).html |
