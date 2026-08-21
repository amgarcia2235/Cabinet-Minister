# Feature gaps — written from the chair of someone building cabinets

I used the toolkit as an engineer documenting and building his own cabinets, not
as the person who wrote it. This is what I reached for and did not find, in the
order the absence actually hurt.

---

## Tier 1 — I cannot finish a real build without these

### 1. Cable length, slack and a cable BOM  ✅ SHIPPED v0.8.0
I can wire `et-0/0/12` to `ge-0/0/4` and see a pretty tube. Then I have to go buy
cables and I have no idea what length. **The tool already knows both port
positions in 3D** — it draws the curve — so it can measure the run, add slack and
service loop, round up to a stock length, and hand me a purchase list:

```
3 ft  ·  Cat6A  ·  yellow  ·  ×14
7 ft  ·  Cat6A  ·  green   ·  ×22
1 m   ·  C13-C14          ·  ×18
```

This is the single highest-value thing missing. It turns a diagram into a
shopping list. Add per-cable: computed length, rounded stock length, colour from
the net class, and a total.

### 2. A/B power feeds, not just PDUs
Right now a PDU is a PDU. Real cabinets have **two feeds from separate breakers**,
and the whole point of dual PSUs is that one feed can die. The toolkit warns if
both cords land on the same PDU, which is good, but it has no idea:

- which **feed** (A or B) a PDU is on,
- what **breaker** that feed is, and its capacity,
- what happens **if feed A drops** — which devices lose power entirely.

Needed: a `feed: "A"|"B"` field on PDUs, a per-feed load total against breaker
rating, and a **"drop feed A" simulation** that lists what goes dark. That is the
question a customer asks and I currently cannot answer.

### 3. A printable build sheet
This is what I physically carry to the cage or hand to a remote tech. There is no
print output at all. Three sheets:

- **Rack elevation, front and rear**, to scale, every U numbered, every device
  labelled — the thing taped to the cabinet door.
- **Patch schedule** — from port → to port, cable class, length, label text.
  (Connections exports CSV; that is data, not a work order.)
- **Build sheet / BOM** — device list with model, U position, serial, asset tag.

### 4. Serial, asset tag and management IP on a device
A device has a name and a model. It does not have the three things every asset
system and every ticket needs: **serial number, asset tag, management IP** (plus
hostname and VLAN). Without them the cabinet doc cannot be the source of truth,
so someone keeps a spreadsheet alongside it — and then the spreadsheet wins.

---

## Tier 2 — I hit these on the second cabinet

### 5. Cabinets are all identical
Every cabinet is 47U, 600 mm wide, 1070 mm deep. Real sites have 42U and 45U,
800 mm wide cabinets, and different rail depths. The depth check compares against
a hard-coded number, so it is only right for one cabinet type. Make U height,
width, depth and usable rail depth **per-cabinet fields**.

### 6. Cable management is not in the catalog
There is no vertical cable manager, no horizontal wire manager, no shelf, no
patch panel blank. Horizontal managers **consume U** — if they are not in the
model, my elevation is wrong by however many I actually install. And there is no
notion of a pathway having a **fill limit**, which is how cable management
actually fails.

### 7. Templates
My cabinets are 80% the same: two ToR switches, a patch panel, two PDUs, then
compute. I build that by hand every time. Let me save a cabinet as a **template**
and stamp it, then only edit the differences. Related: apply a pattern across a
whole row at once.

### 8. Planned vs installed
Everything in the tool exists as if it is racked. In reality a cabinet is a plan
first, then a partial build, then done. A per-device **state — planned /
ordered / racked / cabled / live** — is what makes this usable during a build
instead of only after one.

### 9. Search across everything
"Which cabinet is `spine9` in?" "Who is patched into `C13-7`?" The Port Catalog
has search now; the layout does not. One search box that answers device name,
port address, serial, IP, and jumps me there.

---

## Tier 3 — real, but I can work around them

### 10. Weight has no limit to check against
Weight per cabinet is summed and shown, but there is no cabinet weight rating and
no warning about **heavy gear mounted high**. Both are real safety issues and the
data is already there.

### 11. No thermal figure
Draw in watts is tracked. BTU/hr and a per-cabinet heat load is one multiplication
away, and it is what the facilities conversation runs on.

### 12. Blanking coverage
Blanking panels exist in the catalog but nothing reports **how much open U is
unsealed**. That is the cheapest airflow win in a data centre and it should be a
one-line check: "Cabinet 3: 14U open, 9U unblanked."

### 13. Import the spreadsheet that is already here
`CR8 Cabinet Layout.xlsx` is sitting in this project. Existing cabinets live in
spreadsheets everywhere. A column-mapping importer would onboard a real site in
minutes instead of an afternoon of clicking.

### 14. No site / room / row hierarchy
There are cabinets and a row number. There is no room, no site, no naming
convention. Fine for one room, wrong the moment there are two.

### 15. Change history
Undo is session-only. There is no record of what changed, when, or by whom — and
in a shared cage that is the first question after something breaks.

---

## What I would build, in order

1. ~~**Cable BOM with computed lengths**~~ — **done in v0.8.0**, matched to 5/7/10 ft stock with custom private runs.
2. **A/B feeds + breaker load + "drop a feed" simulation** — answers the question that matters.
3. **Print pack: elevation, patch schedule, build sheet** — makes the tool deliverable.
4. **Asset fields (serial, asset tag, mgmt IP, VLAN)** — makes it the source of truth.
5. **Per-cabinet dimensions** — makes the depth and U checks honest.
6. **Templates + planned/installed state** — makes the second cabinet fast.
7. Blanking coverage, weight limit, BTU — three cheap checks on data already held.
8. Global search, spreadsheet import, site hierarchy.

Items 1, 3 and 7 need no new data model — only computation over what is already
stored. Items 2, 4 and 5 add fields, so they are the ones worth agreeing on
before writing code.
