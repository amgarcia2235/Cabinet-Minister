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
| `Hub.dc.html` | **Landing page** — links to all five tools + data-flow map. Open this first. |
| `catalog.js` | **Source of truth.** Every hardware model: size + addressable port groups. |
| `Hardware Catalog.dc.html` | Port-map viewer — faceplate per model, every port labeled & clickable. |
| `Connections.dc.html` | Port→port (data) & outlet→PSU (power) mapping, used/free state, PDU load. |
| `Cabinet Layout.dc.html` | 2D rack elevation planner (dual-sided U, add/drag/rename, save/load). |
| `Cabinet 3D.html` | three.js data-center scene (procedural hardware, orbit/zoom). |
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

## Roadmap
- [x] **Phase 1 — Catalog** (`catalog.js`) with real, addressable ports.
- [~] **Phase 3 — Port-map viewer** (`Hardware Catalog.dc.html`): faceplate to scale, clickable ports, inventory.
- [ ] **Phase 2 — Layout binding**: planner slots reference catalog model ids.
- [x] **Phase 4 — Connections** (`Connections.dc.html`): `portRef → portRef` (data) + `outlet → PSU` (power), with used/free state, compatibility validation, per-PDU load, and save/load.
- [x] **Phase 5 — Live views**: 3D scene renders from the saved planner layout (falls back to a sample build). 2D planner and catalog already share `catalog.js`.

## Open confirmations
- BH chassis per-node face (IPMI/NIC/PSU count) — currently assumed.
- Supermicro exact SKU.
- Whether EX4200 is the right distributor/mgmt model (inferred from prior layout).
