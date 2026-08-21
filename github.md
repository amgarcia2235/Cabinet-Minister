repo: amgarcia2235/Cabinet-Minister
branch: main

## Last sync
date: 2026-08-21T00:00:00Z

### Updated in this project
- v0.6.6 — QFX5100-48T front/rear photo skins, all 54 front ports and the rear FRU panel anchored to the real panel
- v0.6.7 — QFX5100-48T set to AFO (orange AIR OUT FRUs), airflow added as a catalog field, all four faceplates resampled to 4096 px
- catalog.js made re-entrant (guarded IIFE) so it is safe to evaluate twice; Port Catalog no longer fetches an unresolved photo placeholder
- Standalone bundles rebuilt; assets/ now holds four switch faceplate JPEGs
- All of the above applied in project — awaiting upload to repo

## Sync history
- 2026-08-20T22:05:54Z — repo connected, all 12 toolkit files verified upstream (v0.6.4); v0.6.5 local-file fix applied in project

## Screen map
| Project screen | Repo files |
|---|---|
| Hub.dc.html | Hub.dc.html, support.js |
| Cabinet Layout.dc.html | Cabinet Layout.dc.html, support.js |
| Hardware Catalog.dc.html | Hardware Catalog.dc.html, catalog.js, support.js |
| Connections.dc.html | Connections.dc.html, catalog.js, support.js |
| Cabinet 3D.html | Cabinet 3D.html, catalog.js |
| Faceplate skins | assets/qfx5200-32c-front.jpg, assets/qfx5200-32c-rear.jpg, assets/qfx5100-48t-front.jpg, assets/qfx5100-48t-rear.jpg |
| Standalone bundles | Cabinet Layout (standalone).html, Cabinet 3D (standalone).html |
