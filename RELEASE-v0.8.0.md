# v0.8.0 — Reskin, cable BOM, cross-tool data fixes

**Tag:** `v0.8.0` · **Target:** `main`

Every tool moves to one theme file, with a light default and a dark toggle.
Wiring gains a cable BOM with lengths you can order against, and works on both
faces of the cabinet. Along the way two real interoperability bugs turned up
between the 2D planner and the 3D tools — both fixed.

## Look and feel

The toolkit is reskinned as something a network engineer would build for
himself: neutral greys, structural rules instead of floating cards, small radii,
small type, monospace for anything you would type into a switch. Colour is
reserved for things that mean something — device kind, cable class, airflow
direction, and pass/warn/fail state. Chrome is grey so the coloured things are
the only coloured things on screen.

**Light is now the default**, with a dark toggle in every tool. The choice is
remembered across tools and sessions, and a machine set to dark system-wide gets
dark on first open without a flash of light.

**One file drives it.** `theme.css` holds every colour, radius, shadow and font
token; `theme.js` handles the boot (applied before first paint, so no flash) and
the toggle. Changing the palette is one file, not six. The 3D scenes read their
background, fog and floor colours from the same tokens, so flipping the theme
repaints the room without a reload.

**Each tool has its own muted accent** — planner blue, catalog teal, wiring plum,
3D environment slate, editor amber — carried on its header, its active states and
its icon in the Hub, so you can tell where you are at a glance. The accents are
deliberately duller than the categorical chips so chrome never reads as data.

## Fixed: cabinets built in one tool were invisible in another

Two separate faults, same cause — each tool assumed it had written the data.

**The 3D environment invented a cabinet.** With nothing saved it fell back to a
hard-coded sample build that existed only in that file. It looked like a real
cabinet but was in no store, so the planner and editor never saw it — and the
moment you added a real cabinet the sample vanished, which read as "the first
cabinet didn't register." The sample is now clearly labelled as a sample, and it
only ever appears when nothing is saved.

**The 2D planner rendered nothing at all** when opened on a layout the 3D editor
had written. It read two fields the editor does not write and threw, blanking the
whole elevation. It now resolves either format, tolerates missing fields, and
skips 0U gear rather than trying to give it a row.

Both directions now round-trip: build in 3D, refine in 2D, or the reverse.
Gear added in the planner carries a catalog model id the 3D tools read, and
cabinets keep their row and position through either tool.

**The 3D environment also honours row and position now.** A room laid out in the
editor shows in the same arrangement instead of a single straight line, odd rows
facing about to share a cold aisle, with a name plate over each cabinet.

## Hub

- **Cabinet Inventory** — a real table: per cabinet, its row, occupied and free U,
  device count and power draw, with estimates marked. Derived from the layout on
  load, so it cannot drift from the tools.
- **Export all** — layout, wiring and custom models in one JSON file. The portable
  copy to hand to someone else.

## Port Catalog

- **Search** across model names, port types and specific addresses. Searching
  `QSFP28` lists the models that have them and how many; searching `et-0/0/12` or
  `C13-7` finds the model carrying that address and says which group matched.
- The faceplate zoom control added in 0.7.0 is **removed**. Higher-resolution
  source images are the fix; port anchors are normalised, so better images drop
  in without re-measuring anything.

## Cable BOM — lengths you can order against

Wiring a port pair drew a cable but told you nothing about what to buy. The
Connections tool now estimates every run and turns it into a purchase list.

A patch cable does not fly point to point, so the estimate follows the real path:
out of the faceplate, across to the vertical manager, the vertical distance
between the two Us, back in at the far end, and a service loop at each end.
Cabinet-to-cabinet runs add the rack pitch; crossing rows adds the climb to the
overhead tray and back down.

It is matched to what this site actually stocks — **5, 7 and 10 ft, yellow for
IPMI and green for public** — so a run rounds up to the next stocked length.
**Private-network runs are custom-made**, so they are not rounded at all: the
estimate is the length to make, listed per length as a cut list. Anything over
10 ft in a stocked class is flagged as a special order rather than quietly
rounded up.

The BOM groups by order length and class, and the CSV patch schedule now carries
the estimated length, the order length and the cable colour per run, with the BOM
appended underneath. Every figure is labelled an estimate.

## Wiring in the 3D Editor — both faces of the cabinet

The editor could render cables but not create them. It now has a **Wire** mode
(toolbar or `W`): click a port to arm it, click a compatible port to run the
cable, with a live ghost preview and the auto-suggested cable class.

**Rear-face ports work properly.** Routing had been taken from the device's
mounting side, so a front-mounted device's rear ports sent their cables out the
front of the cabinet. Direction now comes from the port's own position on the
chassis, so front and rear are both usable — which is the point of a dual-sided
cabinet. The tooltip says which face a port is on and what it is already wired to.

## Documentation

**`DATAFLOW.md`** is new: what a cabinet and a piece of gear actually are, which
of the three stores holds what, how the wiring store joins back to the layout,
where the Hub's numbers come from, and the `model` vs `kind` gotcha that caused
both bugs above. Read it before changing anything that touches saved data.

## Also

- Buttons: one filled primary per view, grey outlines for the rest, and a red
  outline on genuinely destructive actions. The planner's Reset now says what it
  does.
- The decorative graph-paper background is gone from every tool — noise behind a
  dense elevation.
- `PCFSoftShadowMap` deprecation warning in both 3D tools cleared.

## Known open

- **The BH chassis plate needs a redraw** — missing its power button and PSU
  section, and it does not yet read as a real chassis. Blocked on a straight-on
  chassis photo.
- **Higher-resolution faceplate images are pending.**
- **Supermicro 1U still has no port map** — exact SKU unknown.
- **Cable lengths are estimates**, not measured runs. The path model is stated in
  the BOM footer; adjust `GEOM` in Connections if your managers or slack differ.
- **No server.** Both stores are browser-local; JSON files are the unit of
  collaboration. `DATAFLOW.md` §8 covers what replacing that would involve.

## Standalone builds

All six tools now ship as self-contained single files — `Hub`, `Cabinet Layout`,
`Hardware Catalog`, `Connections`, `Cabinet 3D` and `Cabinet 3D Editor`, each
`(standalone).html`. Previously only two existed and both predated the reskin.
Fonts, runtime, catalog and theme are inlined, so each opens offline with no
network. Links between tools are page navigations and stay inert inside a single
file; use the repo files for the linked toolkit.

## Upgrade notes

No migration. The same three storage keys, plus `cabplanner.v1.theme` for the
light/dark preference. Cells written from 0.8.0 on carry both `model` and `kind`;
older cells with only one of them still resolve. Two new files ship with the
toolkit — `theme.css` and `theme.js` — and every page loads both, so keep them
next to the tools.
