# cabinetminister

Data-center cabinet planning toolkit — plan a rack, inspect ports, wire connections, walk it in 3D. Plain HTML/JS, no build step, no server.

**Current version: v0.6.7** (release notes live on the Hub page)

## The tools

| File | What it does |
|---|---|
| `Hub.dc.html` | Landing page — live stats, tool launcher, release notes |
| `Cabinet Layout.dc.html` | 2D planner: dual-sided 47U rack elevation (cold/hot per U) |
| `Hardware Catalog.dc.html` | Port catalog: every model's front + rear faceplate, clickable port addresses |
| `Connections.dc.html` | Port→port and PDU-outlet→PSU wiring, CSV patch schedule |
| `Cabinet 3D.html` | 3D data-center scene: hover ports, run cables, inspect gear |
| `catalog.js` | **Single source of truth** for hardware models & ports — edit here, every tool follows |
| `support.js` | Runtime for the `.dc.html` pages — don't edit |
| `* (standalone).html` | Self-contained copies for sharing — regenerate after edits, don't edit directly |

## Quick start (newbies)

1. **Open `Hub.dc.html`** in a browser (or the GitHub Pages URL once hosted). Everything links from there.
2. **Plan the cabinet** — open the 2D Planner. Click any empty slot to add gear (menu appears), drag a device to move it, drag its bottom edge to span more Us, click its name to rename. Cold (front) and hot (rear) sides fill independently. It auto-saves in your browser.
3. **Look up a port** — open Port Catalog, pick a model, click a port to get its address (e.g. `et-0/0/12`, `C13-7`). Copy it with one click.
4. **Wire it** — either in **Connections** (pick device A and B, click a free port on each) or straight in **3D**: click a port, pick the cable class (IPMI / public / private / power — it guesses for you), click the destination port. Yellow = IPMI, green = public, orange = private, red = power.
5. **Walk the rack** — in 3D: drag to orbit, scroll to zoom (all the way in to port level), hover anything to identify it, double-click a device to fly to it, `Rear (hot)` button to see fans/PSUs/rear panels.
6. **Save / share** — every tool has **Save file / Open file** (JSON). Auto-save only lives in your own browser, so use Save file to hand a layout to a teammate.

## How data flows

```
catalog.js  ──feeds──▶  Planner  ──▶  3D view
                            └──────▶  Connections ──▶ cables in 3D
```

Tools share data through browser storage (`cabplanner.v1.*` keys) and JSON files. Storage is per-browser/per-origin — the JSON files are the portable format.

## Editing the hardware catalog

Each model in `catalog.js` declares size + port groups; groups generate addressable ports laid out on the faceplate (`region` = [x, y, w, h] fractions). `rear: true` puts a group on the rear FRU panel. `assumed: true` flags unverified ports (BH chassis I/O, Supermicro) — confirm on real hardware before trusting.

Specs verified against official docs (Juniper QFX5200/EX4200 hardware guides, QFX5100 datasheet, APC AP7911B). Depths marked `null` = "TBC" — no official source found, don't guess.

## Versioning

Features bump the minor (0.x); fixes and polish bump the patch (0.x.y). v1.0 waits for: confirmed BH chassis I/O plate, real Supermicro model, photo-textured 3D skins, team sign-off.

## Hosting

Any static host works. GitHub Pages: Settings → Pages → deploy from branch → open `Hub.dc.html`. Internet needed for Google Fonts + the three.js CDN (the standalone bundles work fully offline).
