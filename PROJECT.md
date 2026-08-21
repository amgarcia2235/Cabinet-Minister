# Cabinet Planner Toolkit — Project Structure

A data-model-first system for documenting network cabinets, mapping every
port, and eventually recording port-to-port and PDU-to-PSU connections.

The 2D planner (`Cabinet Layout.dc.html`) starts with one empty cabinet — **Add cabinet** makes an empty one, **Reset** clears to blank.

## Why data-first
Port maps are built from **manufacturer documentation**, not photo analysis —
each model's ports are encoded as structured, addressable data. Every view
(2D elevation, 3D scene, port-map) reads the same catalog, so a spec fix
updates everything.

## Files
| File | Role |
|---|---|
| `Hub.dc.html` | **Landing page** — links to every tool + data-flow map. Open this first. |
| `catalog.js` | **Source of truth.** Every hardware model: size + addressable port groups. |
| `Hardware Catalog.dc.html` | Port-map viewer — faceplate per model, every port labeled & clickable. |
| `Connections.dc.html` | Port→port (data) & outlet→PSU (power) mapping, used/free state, PDU load. |
| `Cabinet Layout.dc.html` | 2D rack elevation planner (dual-sided U, add/drag/rename, save/load). |
| `Cabinet 3D.html` | three.js data-center scene (procedural hardware, orbit/zoom) — read-only viewer. |
| `Cabinet 3D Editor.html` | Full 3D build-out: drag hardware into Us, move/resize/delete, cabinets & rows, live checks, custom model editor. |
| `theme.css` | Every colour / radius / font token, light + dark. One file, six pages. |
| `theme.js` | Theme boot before first paint + light/dark toggle. |
| `DATAFLOW.md` | The three stores, the cell shape, and the model-vs-kind bridge. |
| `*(standalone).html` | Offline single-file exports of the above. |

## Confirmed hardware specs (sourced)
- **QFX5200-32C** (spine): 1U · 32× QSFP28 100G (ports 0–31) + mgmt/console.
- **QFX5100-48T** (network): 48× 10GBASE-T RJ45 + 6× QSFP+.
- **EX4200-48T** (distribution/IPMI): 48× RJ45 + 4× SFP uplink.
- **AP7911B** (PDU): switched 2U · 208V 30A · 16× C13 (two banks of 8) + L6-30P input + RJ45 mgmt.
- **CHA-1U-B2B-R1** (BH chassis): custom 1U back-to-back pair, two ATX nodes
  facing opposite aisles. PSU inlet (C14) + power button are **uniform**; the
  I/O plate (VGA/serial, USB, NIC, IPMI, PCIe) is **motherboard-dependent** — confirm per build.
- **Supermicro 1U**: 1× IPMI + NICs + dual PSU (assumed; confirm SKU).

## Placeholders (nominal geometry, not a SKU)
Generic 1U/2U/4U servers, a vertical 0U PDU (24× C13 + 6× C19, 30A 208V) and a 1U blanking panel.
Marked `generic`; their ports are `assumed` and their numbers live in `est` blocks. Replace with a real
model before trusting a port map.

## BH chassis motherboard variants
The chassis faceplate is one reusable layer with the I/O window punched through to transparent; each
board composites its own rear-I/O photo behind that window. Naming: `BH Chassis [MC13-LE3]`. Adding a
board is one photo plus one catalog entry — the plate never changes.

## Roadmap
- [x] **Phase 1 — Catalog** (`catalog.js`) with real, addressable ports.
- [~] **Phase 3 — Port-map viewer** (`Hardware Catalog.dc.html`): faceplate to scale, clickable ports, inventory.
- [x] **Phase 2 — Layout binding**: cells carry a catalog `model` id (legacy `kind` still resolves through `KIND_TO_MODEL`).
- [x] **Phase 6 — 3D editing**: place, move, resize, delete, cabinets & rows, multi-select, undo/redo, live validation, user-defined models in `cabplanner.v1.models`.
- [x] **Phase 4 — Connections** (`Connections.dc.html`): `portRef → portRef` (data) + `outlet → PSU` (power), with used/free state, compatibility validation, per-PDU load, and save/load.
- [x] **Phase 5 — Live views**: 3D scene renders from the saved planner layout (falls back to a sample build). 2D planner and catalog already share `catalog.js`.

## Cell format
Cells carry both `model` (catalog id, authoritative) and `kind` (legacy category).
Every tool resolves either one — the 3D tools prefer `model`, the 2D planner prefers
`kind` and falls back to the catalog category of `model`. Anything new that reads
saved data must assume the other tool wrote it. See `DATAFLOW.md`.

## Open confirmations
- BH chassis per-node face (IPMI/NIC/PSU count) — currently assumed.
- Supermicro exact SKU.
- Whether EX4200 is the right distributor/mgmt model (inferred from prior layout).
- BH chassis plate: real left-to-right element order, where the power button and PSU sit, and what the circular cutouts are (needs a straight-on photo).
- MC13-LE3: confirm the stacked pair is 2× LAN and the separate port is the dedicated MGMT/BMC.
- EX4200 rear: which RJ45 is console and which is mgmt.
