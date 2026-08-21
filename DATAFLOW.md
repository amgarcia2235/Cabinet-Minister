# Data flow — how a cabinet gets created and who sees it

Plain answer to "what happens when I make a cabinet, and why does another tool
show it (or not)."

---

## 1. There is one layout, not five

Every tool reads and writes the **same** layout object. Nothing is copied.

```
        ┌──────────────────────────────────────────┐
        │   localStorage["cabplanner.v1.main"]     │   ← the layout
        └──────────────────────────────────────────┘
              ▲            ▲              ▲
     writes   │            │              │   reads
      ┌───────┴──┐   ┌─────┴──────┐   ┌───┴──────────┐
      │ 2D       │   │ 3D Editor  │   │ 3D Environment│
      │ Planner  │   │            │   │ (read-only)   │
      └──────────┘   └────────────┘   └───────────────┘
                            │
                            │  Hub reads it too, for
                            ▼  Live Status + Cabinet Inventory
                       ┌─────────┐
                       │   Hub   │
                       └─────────┘
```

If two tools disagree about what is in a cabinet, it is a **bug**, not a sync
delay. There is nothing to sync.

## 2. What a cabinet actually is

```js
{
  id:    "cmt3gh5u95zh7",   // unique, generated on creation
  name:  "Cabinet 1",
  row:   0,                 // which row on the floor
  col:   0,                 // position along that row
  cells: [ /* the gear */ ],
  uLabels: { 42: "spare" }  // optional per-U notes (2D planner only)
}
```

`row` / `col` drive placement in both 3D tools: `x = col × rack pitch`,
`z = row × (rack depth + aisle)`, and **odd rows are rotated 180°** so fronts
face each other across a cold aisle. The 2D planner ignores row/col — it draws
one elevation per cabinet, stacked down the page — but it preserves them, so
arranging a room in 3D survives a trip through the planner.

## 3. What a piece of gear actually is

```js
{
  id:    "cmt3gie66e47y",             // unique across EVERY cabinet
  model: "cha-1u-b2b-mc13le3",        // catalog id — the authoritative field
  kind:  "chassis",                   // legacy category, still honoured
  top:   16,                          // highest U it occupies
  span:  1,                           // how many U (0 = 0U vertical gear)
  side:  "hot",                       // "full" | "cold" (front) | "hot" (rear)
  name:  "",                          // blank = auto-named from cabinet + U
  channel: "left"                     // 0U gear only: which rear channel
}
```

**The cell stores a reference, not a copy.** `model` points into `catalog.js`.
That is why correcting a spec — a depth, a port map, an airflow direction —
updates the 2D elevation, the 3D faceplate, the port catalog and the checks all
at once, with no migration.

### `model` vs `kind` — the one real gotcha
The 2D planner was built on `kind` (a coarse category: `spine`, `pdu`,
`chassis`). The 3D editor was built on `model` (a precise catalog id). Both
fields are now written on every new cell, and both tools resolve either one:

- 3D tools: `cell.model` first, else `KIND_TO_MODEL[cell.kind]`.
- 2D planner: `cell.kind` first, else the catalog category of `cell.model`,
  mapped back to a planner kind.

A cabinet built in the editor and opened in the planner used to render as
nothing at all, because the planner assumed fields only it wrote. Anything new
reading this data must assume **the other tool wrote it**.

## 4. Wiring lives in a second store

Cables are not part of the layout.

```
localStorage["cabplanner.v1.connections"]
{
  devices: [ { id, model, name, src } ],
  links:   [ { id, kind, net, a:{devId,port}, b:{devId,port} } ]
}
```

A device record appears the first time you wire something, and `src` is the join
back to the layout:

```
src = "cabplanner.v1.main#<rackIndex>#<cellId>"
                          └─ store ─┘ └ rack ┘ └ gear ┘
```

Two consequences worth knowing:

- **Cell ids must be unique across every cabinet**, because the 3D tools index
  gear by cell id alone. Duplicating or pasting a cabinet regenerates ids for
  exactly this reason, and the editor re-checks on every rebuild.
- Deleting gear does **not** delete its cables. They stop drawing (their
  endpoint is gone) but the link records remain, so undoing the delete brings
  the wiring back.

## 5. Custom hardware lives in a third store

```
localStorage["cabplanner.v1.models"]   →  { "<modelId>": { …model… } }
```

Models you build in the 3D editor's model editor are merged into `CATALOG` at
load, flagged `user: true`. From that moment they behave like a built-in: they
appear in the planner's add menu, the port catalog, the hardware key, and the
checks. Adding hardware needs no code change.

## 6. Where the numbers on the Hub come from

Nothing on the Hub is stored. It derives everything on load:

| Hub figure | Source |
|---|---|
| Cabinets | `layout.length` |
| U occupied | distinct occupied U per cabinet, summed (0U gear excluded) |
| Devices wired / Connections | `connections.devices.length` / `.links.length` |
| Cabinet Inventory: used, free, devices | the layout |
| Cabinet Inventory: draw | `specOf(model).watts` summed; `~` when estimated |

## 7. Estimates are marked as estimates

`specOf(modelId)` returns physical facts as `{ value, est }`. A value that came
from an `est` block in the catalog rather than a datasheet is flagged, and the
UI prints `~` in front of it. Depth, weight and draw all work this way. Nothing
promotes an estimate into a spec, so a load calculation is always honest about
how much of it is guesswork.

## 8. Persistence and sharing

Both stores are **browser-local** (`localStorage`, per origin). They survive a
reload and a browser restart; they do not travel.

| To move work | Use |
|---|---|
| One layout | Planner or 3D Editor → **Save file** / **Open file** (JSON) |
| Everything at once | Hub → **Export all** (layout + wiring + custom models in one file) |

**This is the real limitation of the toolkit today.** There is no server, so two
people cannot work on the same cabinet at once, and there is no history beyond
the in-session undo stack. The JSON files are the unit of collaboration. If that
becomes the bottleneck, the storage layer is the thing to replace — every tool
already goes through the same three keys, so a backend would slot in behind them
without touching the tools.

## 9. Quick reference

| Key | Holds | Written by |
|---|---|---|
| `cabplanner.v1.main` | the layout (cabinets + gear) | 2D planner, 3D editor |
| `cabplanner.v1.blank` | blank starter template | 2D planner |
| `cabplanner.v1.connections` | devices + cables | Connections, 3D viewer |
| `cabplanner.v1.models` | user-defined hardware | 3D editor model editor |
| `cabplanner.v1.theme` | light / dark preference | any tool's theme toggle |
