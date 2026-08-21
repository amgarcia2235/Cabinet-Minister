// ============================================================================
// Hardware Catalog — single source of truth for models & ports
// ----------------------------------------------------------------------------
// VERIFIED 2026-08-20 against official documentation:
//   - Juniper QFX5200 Hardware Guide (juniper.net): 32x QSFP28 front (ports
//     0-31, any uplink/access, 100G default -> 50/40/25/10G); GM timing jack
//     + PPS/10M coax on the front; rear FRU management panel carries status
//     LEDs, C0 (em0, RJ-45 1000BASE-T *or* fiber SFP - copper has priority),
//     C1 (em1, SFP 1000BASE-X, -32C only), RJ-45 console (CON) and USB.
//     Front/rear photo skins + port anchors measured off real AFO photos.
//   - Juniper QFX5100 datasheet: 48x tri-speed 10GBASE-T RJ45 + 6x QSFP+;
//     console, USB, 2 mgmt ports (1 RJ45 + 1 SFP) on rear FRU end. Front/rear
//     photo skins + port anchors measured off the real front/rear panel shot.
//   - Juniper EX4200 Hardware Guide: 48x 10/100/1000 RJ45 front + LCD;
//     optional uplink module (2x XFP, 4x SFP, or 2x SFP+); console, mgmt,
//     USB and dual Virtual Chassis ports on REAR panel.
//   - APC AP7911B (se.com/apc.com): NetShelter Switched 2U, 30A 208V,
//     16x C13 in two banks, NEMA L6-30P input, 445 x 254 mm.
// depthMm: null = not stated in a source we verified — do not invent.
// BH chassis (CHA-1U-B2B-R1) is custom; Supermicro model unconfirmed —
// their assumed:true groups need confirmation on real hardware.
// ============================================================================

// __CABCATALOG_GUARD__ — this file is pulled in by four tools; a second
// evaluation must be a no-op instead of redeclaring the top-level consts.
(function () {
if (window.CabCatalog) return;

const PORT_TYPES = {
  RJ45:   { label: "RJ45",   color: "#0ea5e9", w: 0.75, h: 1.0 },
  SFP:    { label: "SFP",    color: "#a78bfa", w: 1.1,  h: 0.7 },
  "SFP+": { label: "SFP+",   color: "#a78bfa", w: 1.1,  h: 0.7 },
  SFP28:  { label: "SFP28",  color: "#a78bfa", w: 1.1,  h: 0.7 },
  "QSFP+":{ label: "QSFP+",  color: "#f59e0b", w: 1.4,  h: 0.95 },
  QSFP28: { label: "QSFP28", color: "#f59e0b", w: 1.4,  h: 0.95 },
  USB:    { label: "USB",    color: "#94a3b8", w: 0.7,  h: 0.55 },
  RS232:  { label: "Console",color: "#64748b", w: 0.75, h: 1.0 },
  VCP:    { label: "VCP",    color: "#8b95a7", w: 1.2,  h: 0.9 },
  C13:    { label: "C13",    color: "#34d399", w: 1.1,  h: 1.2 },
  C19:    { label: "C19",    color: "#f97316", w: 1.5,  h: 1.4 },
  C14:    { label: "C14 inlet", color: "#eab308", w: 1.1, h: 1.2 },
  VGA:    { label: "VGA",    color: "#64748b", w: 1.2, h: 0.9 },
  POWER:  { label: "PSU",    color: "#eab308", w: 1.4, h: 1.3 },
};

const CATALOG = {
  "qfx5200-32c": {
    name: "Juniper QFX5200-32C",
    short: "QFX5200-32C",
    category: "spine",
    accent: "#4d9fff",
    u: 1, widthIn: 19, depthMm: null,
    // Real front-panel photo, cropped to the faceplate face. Anchors below are
    // measured off this image, so faceplate aspect must follow the photo.
    photo: { front: "assets/qfx5200-32c-front.jpg", aspect: 2019 / 202,
             rear: "assets/qfx5200-32c-rear.jpg", rearAspect: 787 / 92 },
    airflow: "AFO",
    note: "Spine \u00b7 32\u00d7 QSFP28 (et-0/0/0\u201331) \u2014 any port uplink or access, 100G default, configurable 50/40/25/10G. Redundant PSUs + fans. Front panel also carries the GM timing jack with PPS OUT / 10M OUT coax; mgmt (C0/C1), console and USB sit on the rear FRU panel.",
    groups: [
      { id: "qsfp", label: "QSFP28 100G (0\u201331)", type: "QSFP28", count: 32, rows: 2, cols: 16,
        naming: { prefix: "et-0/0/", start: 0 }, region: [0.05, 0.10, 0.90, 0.80],
        // [x, y, w, h] normalised to photo.front, port order 0..31 (even = top row)
        anchors: [[0.1575,0.3168,0.0426,0.1832],[0.1575,0.5792,0.0426,0.2228],[0.2036,0.3168,0.0396,0.1832],[0.2036,0.5792,0.0396,0.2228],[0.2462,0.3168,0.0401,0.1832],[0.2462,0.5792,0.0401,0.2228],[0.2873,0.3168,0.0426,0.1832],[0.2873,0.5792,0.0426,0.2228],[0.3427,0.3168,0.0426,0.1832],[0.3427,0.5792,0.0426,0.2228],[0.3863,0.3168,0.0416,0.1832],[0.3863,0.5792,0.0416,0.2228],[0.4289,0.3168,0.0421,0.1832],[0.4289,0.5792,0.0421,0.2228],[0.4720,0.3168,0.0421,0.1832],[0.4720,0.5792,0.0421,0.2228],[0.5275,0.3168,0.0421,0.1832],[0.5275,0.5792,0.0421,0.2228],[0.5711,0.3168,0.0416,0.1832],[0.5711,0.5792,0.0416,0.2228],[0.6137,0.3168,0.0421,0.1832],[0.6137,0.5792,0.0421,0.2228],[0.6568,0.3168,0.0421,0.1832],[0.6568,0.5792,0.0421,0.2228],[0.7122,0.3168,0.0421,0.1832],[0.7122,0.5792,0.0421,0.2228],[0.7553,0.3168,0.0421,0.1832],[0.7553,0.5792,0.0421,0.2228],[0.7984,0.3168,0.0421,0.1832],[0.7984,0.5792,0.0421,0.2228],[0.8415,0.3168,0.0431,0.1832],[0.8415,0.5792,0.0431,0.2228]] },
      { id: "gm", label: "GM timing (RJ45)", type: "RJ45", count: 1, rows: 1, cols: 1,
        naming: { prefix: "gm-", start: 0 }, region: [0.05, 0.30, 0.03, 0.40],
        anchors: [[0.0456,0.2277,0.0357,0.2970]] },
      { id: "mgmt-c0", label: "C0 \u00b7 em0 mgmt (RJ45)", type: "RJ45", count: 1, rows: 1, cols: 1, rear: true,
        naming: { names: ["C0"] }, region: [0.06, 0.50, 0.04, 0.22],
        anchors: [[0.0839,0.5000,0.0330,0.2174]] },
      { id: "mgmt-c0-sfp", label: "C0 \u00b7 em0 mgmt (SFP fiber \u2014 copper C0 has priority)", type: "SFP", count: 1, rows: 1, cols: 1, rear: true,
        naming: { names: ["C0-fiber"] }, region: [0.04, 0.22, 0.03, 0.22],
        anchors: [[0.0419,0.2174,0.0305,0.2174]] },
      { id: "mgmt-c1-sfp", label: "C1 \u00b7 em1 mgmt (SFP, \u201132C only)", type: "SFP", count: 1, rows: 1, cols: 1, rear: true,
        naming: { names: ["C1"] }, region: [0.04, 0.48, 0.03, 0.24],
        anchors: [[0.0419,0.4783,0.0305,0.2391]] },
      { id: "con", label: "Console CON (RJ45 RS-232)", type: "RS232", count: 1, rows: 1, cols: 1, rear: true,
        naming: { names: ["CON"] }, region: [0.08, 0.24, 0.04, 0.20],
        anchors: [[0.0839,0.2391,0.0330,0.1957]] },
      { id: "usb", label: "USB (image updates)", type: "USB", count: 1, rows: 1, cols: 1, rear: true,
        naming: { names: ["USB"] }, region: [0.13, 0.46, 0.015, 0.24],
        anchors: [[0.1296,0.4565,0.0102,0.2391]] },
    ],
  },

  "qfx5100-48t": {
    name: "Juniper QFX5100-48T",
    short: "QFX5100-48T",
    category: "network",
    accent: "#22c55e",
    u: 1, widthIn: 19, depthMm: null,
    // Front + rear photo skins cropped to the faceplate face; every anchor below
    // is measured off these two images, so the aspects must follow the photos.
    photo: { front: "assets/qfx5100-48t-front.jpg", aspect: 763 / 82,
             rear: "assets/qfx5100-48t-rear.jpg", rearAspect: 769 / 83 },
    airflow: "AFO",
    note: "48\u00d7 tri-speed 10GBASE-T RJ45 (xe-0/0/0\u201347) in three blocks of 16 + 6\u00d7 QSFP+ 40G uplinks (4\u00d710G breakout capable). Rear FRU panel carries the C0/C1 mgmt pair (RJ-45 or SFP \u2014 copper has priority), console and USB, five fan modules and two AC PSUs. Airflow is AFO \u2014 front-to-back, intake at the port face, exhaust out the FRU end \u2014 so the FRUs carry the orange AIR OUT marking.",
    groups: [
      { id: "access", label: "10GBASE-T access (0\u201347)", type: "RJ45", count: 48, rows: 2, cols: 24,
        naming: { prefix: "xe-0/0/", start: 0 }, region: [0.06, 0.14, 0.60, 0.72],
        // [x, y, w, h] normalised to photo.front; port order 0..47, even = top row
        anchors: [[0.0288,0.2195,0.0315,0.2561],[0.0288,0.5000,0.0315,0.2683],[0.0603,0.2195,0.0315,0.2561],[0.0603,0.5000,0.0315,0.2683],[0.0931,0.2195,0.0301,0.2561],[0.0931,0.5000,0.0301,0.2683],[0.1245,0.2195,0.0301,0.2561],[0.1245,0.5000,0.0301,0.2683],[0.1560,0.2195,0.0315,0.2561],[0.1560,0.5000,0.0315,0.2683],[0.1874,0.2195,0.0315,0.2561],[0.1874,0.5000,0.0315,0.2683],[0.2189,0.2195,0.0315,0.2561],[0.2189,0.5000,0.0315,0.2683],[0.2503,0.2195,0.0315,0.2561],[0.2503,0.5000,0.0315,0.2683],[0.3014,0.2195,0.0315,0.2561],[0.3014,0.5000,0.0315,0.2683],[0.3342,0.2195,0.0315,0.2561],[0.3342,0.5000,0.0315,0.2683],[0.3657,0.2195,0.0315,0.2561],[0.3657,0.5000,0.0315,0.2683],[0.3971,0.2195,0.0315,0.2561],[0.3971,0.5000,0.0315,0.2683],[0.4286,0.2195,0.0315,0.2561],[0.4286,0.5000,0.0315,0.2683],[0.4613,0.2195,0.0315,0.2561],[0.4613,0.5000,0.0315,0.2683],[0.4928,0.2195,0.0315,0.2561],[0.4928,0.5000,0.0315,0.2683],[0.5242,0.2195,0.0315,0.2561],[0.5242,0.5000,0.0315,0.2683],[0.5754,0.2195,0.0315,0.2561],[0.5754,0.5000,0.0315,0.2683],[0.6068,0.2195,0.0315,0.2561],[0.6068,0.5000,0.0315,0.2683],[0.6396,0.2195,0.0315,0.2561],[0.6396,0.5000,0.0315,0.2683],[0.6710,0.2195,0.0315,0.2561],[0.6710,0.5000,0.0315,0.2683],[0.7025,0.2195,0.0315,0.2561],[0.7025,0.5000,0.0315,0.2683],[0.7339,0.2195,0.0315,0.2561],[0.7339,0.5000,0.0315,0.2683],[0.7667,0.2195,0.0315,0.2561],[0.7667,0.5000,0.0315,0.2683],[0.7982,0.2195,0.0315,0.2561],[0.7982,0.5000,0.0315,0.2683]] },
      { id: "uplink", label: "QSFP+ 40G uplinks (48\u201353)", type: "QSFP+", count: 6, rows: 2, cols: 3,
        naming: { prefix: "et-0/0/", start: 48 }, region: [0.70, 0.14, 0.20, 0.72],
        anchors: [[0.8493,0.1829,0.0419,0.2683],[0.8493,0.5244,0.0419,0.2683],[0.8925,0.1829,0.0419,0.2683],[0.8925,0.5244,0.0419,0.2683],[0.9371,0.1829,0.0419,0.2683],[0.9371,0.5244,0.0419,0.2683]] },
      { id: "mgmt0", label: "C0 \u00b7 em0 mgmt (RJ45)", type: "RJ45", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "em", start: 0 }, region: [0.06, 0.28, 0.05, 0.44],
        anchors: [[0.0780,0.4940,0.0390,0.2410]] },
      { id: "mgmt0-sfp", label: "C0 \u00b7 em0 mgmt (SFP fiber \u2014 copper C0 has priority)", type: "SFP", count: 1, rows: 1, cols: 1, rear: true,
        naming: { names: ["C0-fiber"] }, region: [0.04, 0.22, 0.03, 0.22],
        anchors: [[0.0351,0.1928,0.0390,0.2410]] },
      { id: "mgmt1", label: "C1 \u00b7 em1 mgmt (SFP)", type: "SFP", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "em", start: 1 }, region: [0.14, 0.30, 0.05, 0.40],
        anchors: [[0.0351,0.5422,0.0390,0.2410]] },
      { id: "con", label: "Console CON (RJ45 RS-232)", type: "RS232", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "con-", start: 0 }, region: [0.22, 0.30, 0.05, 0.40],
        anchors: [[0.0780,0.2410,0.0390,0.2410]] },
      { id: "usb", label: "USB (image updates)", type: "USB", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "usb", start: 0 }, region: [0.30, 0.32, 0.04, 0.36],
        anchors: [[0.1222,0.4337,0.0182,0.3373]] },
    ],
  },

  "ex4200-48t": {
    name: "Juniper EX4200-48T",
    short: "EX4200-48T",
    category: "dist",
    accent: "#eab308",
    u: 1, widthIn: 19, depthMm: null,
    note: "IPMI distributor \u00b7 48\u00d7 10/100/1000 RJ45 (ge-0/0/0\u201347) + front LCD. Uplink module fitted here as 4\u00d7 SFP (ge-0/1/0\u20133; factory options 2\u00d7 XFP or 2\u00d7 SFP+). Console, mgmt (me0), USB and dual Virtual Chassis ports on the rear panel.",
    groups: [
      { id: "access", label: "10/100/1000 RJ45 (0\u201347)", type: "RJ45", count: 48, rows: 2, cols: 24,
        naming: { prefix: "ge-0/0/", start: 0 }, region: [0.06, 0.14, 0.64, 0.72] },
      { id: "uplink", label: "SFP uplink module (0\u20133)", type: "SFP", count: 4, rows: 2, cols: 2,
        naming: { prefix: "ge-0/1/", start: 0 }, region: [0.76, 0.16, 0.12, 0.68] },
      { id: "mgmt", label: "Mgmt me0", type: "RJ45", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "me", start: 0 }, region: [0.06, 0.28, 0.05, 0.44] },
      { id: "con", label: "Console", type: "RS232", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "con-", start: 0 }, region: [0.14, 0.30, 0.05, 0.40] },
      { id: "usb", label: "USB", type: "USB", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "usb", start: 0 }, region: [0.22, 0.32, 0.04, 0.36] },
      { id: "vcp", label: "Virtual Chassis ports", type: "VCP", count: 2, rows: 1, cols: 2, rear: true,
        naming: { prefix: "vcp-", start: 0 }, region: [0.30, 0.26, 0.12, 0.48] },
    ],
  },

  "ap7911b": {
    name: "APC AP7911B Switched Rack PDU",
    short: "AP7911B (2U PDU)",
    category: "pdu",
    accent: "#e5484d",
    u: 2, widthIn: 19, depthMm: 254,
    note: "NetShelter Switched 2U \u00b7 208V 30A \u00b7 16\u00d7 C13 in two banks of 8, outlet-level switching + current-metering display \u00b7 NEMA L6-30P input cord \u00b7 445\u00d7254 mm.",
    groups: [
      { id: "bankA", label: "Bank 1 \u2014 C13 (1\u20138)", type: "C13", count: 8, rows: 2, cols: 4,
        naming: { prefix: "C13-", start: 1 }, region: [0.06, 0.14, 0.40, 0.72] },
      { id: "bankB", label: "Bank 2 \u2014 C13 (9\u201316)", type: "C13", count: 8, rows: 2, cols: 4,
        naming: { prefix: "C13-", start: 9 }, region: [0.50, 0.14, 0.40, 0.72] },
      { id: "mgmt", label: "Network mgmt (RJ45)", type: "RJ45", count: 1, rows: 1, cols: 1,
        naming: { prefix: "mgmt-", start: 0 }, region: [0.92, 0.20, 0.04, 0.24] },
      { id: "inlet", label: "L6-30P input cord", type: "POWER", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "inlet-", start: 0 }, region: [0.08, 0.28, 0.06, 0.44] },
    ],
    meter: true,
  },

  "cha-1u-b2b-r1": {
    name: "Boot Hardware Chassis (CHA-1U-B2B-R1)",
    short: "BH chassis (B2B)",
    category: "chassis",
    accent: "#7dd3fc",
    u: 1, widthIn: 16.9, depthMm: 375, custom: true,
    note: "Custom 1U back-to-back pair \u2014 two ATX nodes facing opposite aisles. PSU inlet + power button are UNIFORM across builds; the I/O plate (VGA/serial/USB/NIC/PCIe) depends on the installed motherboard \u2014 confirm per build.",
    nodes: ["cold", "hot"],
    groups: [
      { id: "psu", label: "PSU inlet (C14) \u00b7 fixed", type: "C14", count: 1, rows: 1, cols: 1,
        naming: { prefix: "psu-", start: 0 }, region: [0.05, 0.30, 0.06, 0.44] },
      { id: "pwr", label: "Power button \u00b7 fixed", type: "USB", count: 1, rows: 1, cols: 1,
        naming: { prefix: "pwr-", start: 0 }, region: [0.19, 0.34, 0.03, 0.30] },
      { id: "io-vga", label: "I/O: VGA/serial (mobo-dependent)", type: "VGA", count: 1, rows: 1, cols: 1, assumed: true,
        naming: { prefix: "vga-", start: 0 }, region: [0.34, 0.34, 0.06, 0.32] },
      { id: "io-usb", label: "I/O: USB (mobo-dependent)", type: "USB", count: 4, rows: 2, cols: 2, assumed: true,
        naming: { prefix: "usb", start: 0 }, region: [0.44, 0.28, 0.09, 0.44] },
      { id: "io-lan", label: "I/O: NIC (mobo-dependent)", type: "RJ45", count: 2, rows: 1, cols: 2, assumed: true,
        naming: { prefix: "eth", start: 0 }, region: [0.58, 0.32, 0.12, 0.36] },
      { id: "io-ipmi", label: "I/O: IPMI (mobo-dependent)", type: "RJ45", count: 1, rows: 1, cols: 1, assumed: true,
        naming: { prefix: "ipmi", start: 0 }, region: [0.72, 0.32, 0.05, 0.36] },
      { id: "pcie", label: "PCIe slot (mobo-dependent)", type: "SFP+", count: 1, rows: 1, cols: 1, assumed: true,
        naming: { prefix: "pcie-", start: 0 }, region: [0.86, 0.30, 0.09, 0.40] },
    ],
  },

  "supermicro-1u": {
    name: "Supermicro 1U (model TBC)",
    short: "Supermicro 1U",
    category: "supermicro",
    accent: "#f472b6",
    u: 1, widthIn: 19, depthMm: null, custom: true,
    note: "1U server \u00b7 exact model unconfirmed \u2014 front assumed drive bays / power button only, data & power on rear I/O. Send the model number and this entry gets the real port map.",
    groups: [],
  },
};

// Expand a model's groups into a flat, ordered list of addressable ports.
function portsOf(modelId) {
  const m = CATALOG[modelId];
  if (!m) return [];
  const out = [];
  for (const g of m.groups) {
    for (let i = 0; i < g.count; i++) {
      const addr = g.naming.names ? g.naming.names[i]
                                  : g.naming.prefix + ((g.naming.start ?? 0) + i);
      out.push({
        groupId: g.id, groupLabel: g.label, type: g.type,
        index: i, addr,
        assumed: !!g.assumed, rear: !!g.rear,
      });
    }
  }
  return out;
}

// Kind used by the planner layout -> catalog model id (default suggestions).
const KIND_TO_MODEL = {
  spine: "qfx5200-32c",
  network: "qfx5100-48t",
  dist: "ex4200-48t",
  mgmt: "ex4200-48t",
  console: "ex4200-48t",
  pdu: "ap7911b",
  chassis: "cha-1u-b2b-r1",
  supermicro: "supermicro-1u",
};

// Front-panel photo skin for a model, or null if it is still drawn procedurally.
function skinOf(modelId) {
  const m = CATALOG[modelId];
  return (m && m.photo && m.photo.front) ? m.photo : null;
}

// Plain-script global so every page works from file:// (no module CORS)
window.CabCatalog = { PORT_TYPES, CATALOG, portsOf, skinOf, KIND_TO_MODEL };
})();
