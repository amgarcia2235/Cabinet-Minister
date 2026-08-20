// ============================================================================
// Hardware Catalog — single source of truth for models & ports
// ----------------------------------------------------------------------------
// VERIFIED 2026-08-20 against official documentation:
//   - Juniper QFX5200 Hardware Guide (juniper.net): 32x QSFP28 front (ports
//     0-31, any uplink/access, 100G default -> 50/40/25/10G); mgmt panel
//     (C0/C1), console + USB on the REAR FRU end next to the fans.
//   - Juniper QFX5100 datasheet: 48x tri-speed 10GBASE-T RJ45 + 6x QSFP+;
//     console, USB, 2 mgmt ports (1 RJ45 + 1 SFP) on rear FRU end.
//   - Juniper EX4200 Hardware Guide: 48x 10/100/1000 RJ45 front + LCD;
//     optional uplink module (2x XFP, 4x SFP, or 2x SFP+); console, mgmt,
//     USB and dual Virtual Chassis ports on REAR panel.
//   - APC AP7911B (se.com/apc.com): NetShelter Switched 2U, 30A 208V,
//     16x C13 in two banks, NEMA L6-30P input, 445 x 254 mm.
// depthMm: null = not stated in a source we verified — do not invent.
// BH chassis (CHA-1U-B2B-R1) is custom; Supermicro model unconfirmed —
// their assumed:true groups need confirmation on real hardware.
// ============================================================================

export const PORT_TYPES = {
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

export const CATALOG = {
  "qfx5200-32c": {
    name: "Juniper QFX5200-32C",
    short: "QFX5200-32C",
    category: "spine",
    accent: "#4d9fff",
    u: 1, widthIn: 19, depthMm: null,
    note: "Spine \u00b7 32\u00d7 QSFP28 (et-0/0/0\u201331) \u2014 any port uplink or access, 100G default, configurable 50/40/25/10G. Redundant PSUs + fans. Mgmt (C0/C1), console and USB sit on the rear FRU panel.",
    groups: [
      { id: "qsfp", label: "QSFP28 100G (0\u201331)", type: "QSFP28", count: 32, rows: 2, cols: 16,
        naming: { prefix: "et-0/0/", start: 0 }, region: [0.05, 0.10, 0.90, 0.80] },
      { id: "mgmt", label: "Mgmt C0\u2013C1", type: "RJ45", count: 2, rows: 1, cols: 2, rear: true,
        naming: { prefix: "C", start: 0 }, region: [0.06, 0.28, 0.10, 0.44] },
      { id: "con", label: "Console (RS-232)", type: "RS232", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "con-", start: 0 }, region: [0.19, 0.30, 0.05, 0.40] },
      { id: "usb", label: "USB", type: "USB", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "usb", start: 0 }, region: [0.27, 0.32, 0.04, 0.36] },
    ],
  },

  "qfx5100-48t": {
    name: "Juniper QFX5100-48T",
    short: "QFX5100-48T",
    category: "network",
    accent: "#22c55e",
    u: 1, widthIn: 19, depthMm: null,
    note: "48\u00d7 tri-speed 10GBASE-T RJ45 (xe-0/0/0\u201347) + 6\u00d7 QSFP+ 40G uplinks (4\u00d710G breakout capable). Console, USB and 2 mgmt ports (1\u00d7 RJ45 em0, 1\u00d7 SFP em1) on the rear FRU panel.",
    groups: [
      { id: "access", label: "10GBASE-T access (0\u201347)", type: "RJ45", count: 48, rows: 2, cols: 24,
        naming: { prefix: "xe-0/0/", start: 0 }, region: [0.06, 0.14, 0.60, 0.72] },
      { id: "uplink", label: "QSFP+ uplinks (48\u201353)", type: "QSFP+", count: 6, rows: 2, cols: 3,
        naming: { prefix: "et-0/0/", start: 48 }, region: [0.70, 0.14, 0.20, 0.72] },
      { id: "mgmt0", label: "Mgmt em0 (RJ45)", type: "RJ45", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "em", start: 0 }, region: [0.06, 0.28, 0.05, 0.44] },
      { id: "mgmt1", label: "Mgmt em1 (SFP)", type: "SFP", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "em", start: 1 }, region: [0.14, 0.30, 0.05, 0.40] },
      { id: "con", label: "Console", type: "RS232", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "con-", start: 0 }, region: [0.22, 0.30, 0.05, 0.40] },
      { id: "usb", label: "USB", type: "USB", count: 1, rows: 1, cols: 1, rear: true,
        naming: { prefix: "usb", start: 0 }, region: [0.30, 0.32, 0.04, 0.36] },
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
export function portsOf(modelId) {
  const m = CATALOG[modelId];
  if (!m) return [];
  const out = [];
  for (const g of m.groups) {
    for (let i = 0; i < g.count; i++) {
      const num = (g.naming.start ?? 0) + i;
      out.push({
        groupId: g.id, groupLabel: g.label, type: g.type,
        index: i, addr: g.naming.prefix + num,
        assumed: !!g.assumed, rear: !!g.rear,
      });
    }
  }
  return out;
}

// Kind used by the planner layout -> catalog model id (default suggestions).
export const KIND_TO_MODEL = {
  spine: "qfx5200-32c",
  network: "qfx5100-48t",
  dist: "ex4200-48t",
  mgmt: "ex4200-48t",
  console: "ex4200-48t",
  pdu: "ap7911b",
  chassis: "cha-1u-b2b-r1",
  supermicro: "supermicro-1u",
};
