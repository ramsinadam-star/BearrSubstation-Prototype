
// Conduit Fill Calculator (V4.5)
// Inputs: Schedule (PVC 40/80) + Trade Size; Rows describe "cables":
//   - Qty (number of identical cables)
//   - Insulation type (e.g., THHN/THWN-2, XHHW-2)
//   - Conductors per cable (1..19)
//   - Conductor size (AWG/kcmil)
// For a cable, we estimate overall OD from per-conductor OD and conductor count.
// NOTE: Multi-conductor cable OD is an approximation. Use manufacturer data for critical work.
//
// NEC Table 1 limits: 53% / 31% / 40%

(function(){
  const PI = Math.PI;

  // Internal diameters (inches) for PVC per common tables (trade size 1"–8")
  const CONDUIT_ID = {
    pvc40: { "1": 1.049, "1-1/4": 1.380, "1-1/2": 1.610, "2": 2.067, "2-1/2": 2.469, "3": 3.068, "3-1/2": 3.548, "4": 3.998, "5": 5.016, "6": 6.031, "8": 7.942 },
    pvc80: { "1": 0.936, "1-1/4": 1.255, "1-1/2": 1.476, "2": 1.913, "2-1/2": 2.290, "3": 2.864, "3-1/2": 3.326, "4": 3.826, "5": 4.805, "6": 5.761, "8": 7.565 }
  };

  // Approximate single-conductor ODs (inches) by insulation family at 75–90C class.
  // Values are typical; for precise work, confirm with manufacturer datasheets.
  const OD_SINGLE = {
    "THHN/THWN-2": {
      "14 AWG": 0.111, "12 AWG": 0.130, "10 AWG": 0.164, "8 AWG": 0.215, "6 AWG": 0.270,
      "4 AWG": 0.330, "3 AWG": 0.355, "2 AWG": 0.385, "1 AWG": 0.435,
      "1/0 AWG": 0.490, "2/0 AWG": 0.535, "3/0 AWG": 0.590, "4/0 AWG": 0.655,
      "250 kcmil": 0.760, "300 kcmil": 0.820, "350 kcmil": 0.870, "400 kcmil": 0.920,
      "500 kcmil": 1.020, "600 kcmil": 1.110, "750 kcmil": 1.230, "1000 kcmil": 1.410
    },
    "XHHW-2": {
      "14 AWG": 0.130, "12 AWG": 0.150, "10 AWG": 0.190, "8 AWG": 0.245, "6 AWG": 0.305,
      "4 AWG": 0.365, "3 AWG": 0.395, "2 AWG": 0.430, "1 AWG": 0.480,
      "1/0 AWG": 0.535, "2/0 AWG": 0.585, "3/0 AWG": 0.645, "4/0 AWG": 0.715,
      "250 kcmil": 0.835, "300 kcmil": 0.900, "350 kcmil": 0.960, "400 kcmil": 1.015,
      "500 kcmil": 1.120, "600 kcmil": 1.220, "750 kcmil": 1.350, "1000 kcmil": 1.540
    }
  };

  const SIZE_ORDER = ["14 AWG","12 AWG","10 AWG","8 AWG","6 AWG","4 AWG","3 AWG","2 AWG","1 AWG","1/0 AWG","2/0 AWG","3/0 AWG","4/0 AWG","250 kcmil","300 kcmil","350 kcmil","400 kcmil","500 kcmil","600 kcmil","750 kcmil","1000 kcmil"];

  // Packing efficiency & jacket factor for rough multi-conductor cable OD estimation
  const PACKING_EFF = 0.60;     // fraction of circular cross-section occupied by round conductors
  const JACKET_FACTOR = 1.10;   // multiply diameter by 1.10 to account for jacket/binder

  function byId(id){ return document.getElementById(id); }
  function num(v, d=0){ const n = parseFloat(v); return isFinite(n) ? n : d; }
  function fmt(n, d=3){ return Number(n).toFixed(d); }
  function areaFromDiameter(d_in){ return PI * Math.pow(d_in/2, 2); }

  function necMaxPct(nConductors){
    if (nConductors <= 0) return 0;
    if (nConductors === 1) return 53;
    if (nConductors === 2) return 31;
    return 40;
  }

  function populateTradeSizes(scheduleKey){
    const sizes = Object.keys(CONDUIT_ID[scheduleKey]);
    const sel = byId("cf-size");
    sel.innerHTML = "";
    sizes.forEach(sz => {
      const opt = document.createElement("option");
      opt.value = sz; opt.textContent = sz;
      sel.appendChild(opt);
    });
    sel.value = sizes[0];
  }

  function populateInsulation(){
    const sel = byId("cf-insul");
    sel.innerHTML = "";
    Object.keys(OD_SINGLE).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name; opt.textContent = name;
      sel.appendChild(opt);
    });
  }

  function populateWireSize(){
    const sel = byId("cf-wire-size");
    sel.innerHTML = "";
    SIZE_ORDER.forEach(sz => {
      const opt = document.createElement("option");
      opt.value = sz; opt.textContent = sz;
      sel.appendChild(opt);
    });
    sel.value = "12 AWG";
  }

  function cableOD(insul, wireSize, conductorsPerCable){
    const od_single = OD_SINGLE[insul][wireSize] || 0;
    if (conductorsPerCable <= 1) return od_single;

    const area_each = areaFromDiameter(od_single);
    const area_total_cond = conductorsPerCable * area_each;
    const area_cable = area_total_cond / PACKING_EFF;
    let od_equiv = 2 * Math.sqrt(area_cable / PI);
    od_equiv *= JACKET_FACTOR;
    return od_equiv;
  }

  function readConduitArea(){
    const sch = byId("cf-schedule").value;  // pvc40 or pvc80
    const size = byId("cf-size").value;
    const id_in = CONDUIT_ID[sch][size];
    return areaFromDiameter(id_in);
  }

  function readRows(){
    const rows = Array.from(document.querySelectorAll("#cf-rows .cf-row"));
    let items = [];
    rows.forEach(r => {
      const qty = Math.max(0, num(r.querySelector(".cf-qty").value, 0));
      const ncond = Math.max(1, num(r.querySelector(".cf-ncond").value, 1));
      const insul = r.querySelector(".cf-insul").value;
      const wsize = r.querySelector(".cf-size").value;
      const manod = num((r.querySelector(".cf-manod")||{value:""}).value, 0);

      const od_calc = cableOD(insul, wsize, ncond);
      const od = manod > 0 ? manod : od_calc;
      const area_each_cable = areaFromDiameter(od);
      const a_total = qty * area_each_cable;

      if (qty > 0 && od > 0){
        items.push({qty, ncond, insul, wsize, od, area_each_cable, a_total, manod});
      }
    });
    return items;
  }

  function recompute(){
    const conduitArea = readConduitArea();
    const rows = readRows();
    const totalCables = rows.reduce((s,r) => s + r.qty, 0);
    const usedArea = rows.reduce((s,r) => s + r.a_total, 0);
    const usedPct = conduitArea > 0 ? (usedArea / conduitArea) * 100 : 0;
    // For NEC Table 1 threshold, we consider "conductors" as number of items installed.
    const maxPct = necMaxPct(totalCables);
    const maxArea = conduitArea * (maxPct/100);
    const status = (conduitArea > 0 && totalCables > 0) ? (usedArea <= maxArea ? "ok" : "exceeds") : "idle";

    const detailRows = rows.map(r => `
      <tr>
        <td>${r.qty}</td>
        <td>${r.insul}</td>
        <td>${r.ncond} × ${r.wsize}</td>
        <td>${fmt(r.od,3)} in${(r.manod&&r.manod>0)?" (manual)":" (est)"} </td>
        <td>${fmt(r.area_each_cable,3)} in²</td>
        <td>${fmt(r.a_total,3)} in²</td>
      </tr>
    `).join("");

    document.getElementById("cf-summary").innerHTML = `
      <div class="card soft">
        <div class="kv">
          <div><span class="k">Conduit area</span>&nbsp;<span class="v">${fmt(conduitArea,3)} in²</span></div>
          <div><span class="k">Cables (qty)</span>&nbsp;<span class="v">${totalCables}</span></div>
          <div><span class="k">Total cable area</span>&nbsp;<span class="v">${fmt(usedArea,3)} in²</span></div>
          <div><span class="k">% fill</span>&nbsp;<span class="v">${fmt(usedPct,2)}%</span></div>
          <div><span class="k">NEC allowable</span>&nbsp;<span class="v">${fmt(maxPct,0)}%  (${fmt(maxArea,3)} in²)</span></div>
        </div>
        ${status==="ok" ? `<p class="note success">✅ Within allowable fill.</p>` :
          status==="exceeds" ? `<p class="note error">❌ Exceeds allowable fill.</p>` :
          `<p class="note">Select schedule & trade size, then add cables.</p>`}
        ${rows.length ? `
          <div class="table-wrap">
          <table class="mini dense">
            <thead><tr><th>Qty</th><th>Insulation</th><th>Conductors</th><th>Approx. OD</th><th>Area each</th><th>Area total</th></tr></thead>
            <tbody>${detailRows}</tbody>
          </table>
          </div>` : ``}
      </div>
    `;
  }

  function addRow(prefill){
    const container = document.getElementById("cf-rows");
    const row = document.createElement("div");
    row.className = "cf-row grid five";
    row.innerHTML = `
      <div>
        <label>Qty (cables)</label>
        <input type="number" class="cf-qty" min="0" step="1" value="${prefill?.qty ?? 1}"/>
      </div>
      <div>
        <label>Insulation</label>
        <select class="cf-insul"></select>
      </div>
      <div>
        <label>Conductors per cable</label>
        <input type="number" class="cf-ncond" min="1" step="1" value="${prefill?.ncond ?? 1}"/>
      </div>
      <div>
        <label>Conductor size</label>
        <select class="cf-size"></select>
      </div>
      <div>
        <label>Manufacturer OD (in)</label>
        <input type="number" class="cf-manod" min="0" step="0.001" placeholder="optional"/>
      </div>
      <button type="button" class="btn link danger cf-remove" aria-label="Remove row">Remove</button>
    `;
    container.appendChild(row);

    // Populate selects
    const insSel = row.querySelector(".cf-insul");
    const sizeSel = row.querySelector(".cf-size");
    // Fill insulation
    insSel.innerHTML = Object.keys(OD_SINGLE).map(n => `<option value="${n}">${n}</option>`).join("");
    // Fill sizes
    sizeSel.innerHTML = SIZE_ORDER.map(s => `<option value="${s}">${s}</option>`).join("");

    // Events
    row.querySelectorAll("input,select").forEach(el => el);
    row.querySelector(".cf-remove").addEventListener("click", () => { row.remove(); recompute(); });
  }

  function init(){
    // Wire Calculate button (inside init so recompute is in scope)
    const calcBtn = document.getElementById("cf-calc");
    if (calcBtn) { calcBtn.addEventListener("click", () => recompute()); }

    // Populate conduit dropdowns
    (function populateTradeSizesInit(){
      const sizes = Object.keys(CONDUIT_ID["pvc40"]);
      const sel = document.getElementById("cf-size");
      sel.innerHTML = "";
      sizes.forEach(sz => {
        const opt = document.createElement("option");
        opt.value = sz; opt.textContent = sz;
        sel.appendChild(opt);
      });
      sel.value = sizes[0];
    })();

    document.getElementById("cf-schedule").value = "pvc40";
    document.getElementById("cf-schedule").addEventListener("change", () => {
      const sch = document.getElementById("cf-schedule").value;
      const sel = document.getElementById("cf-size");
      sel.innerHTML = "";
      Object.keys(CONDUIT_ID[sch]).forEach(sz => {
        const opt = document.createElement("option");
        opt.value = sz; opt.textContent = sz;
        sel.appendChild(opt);
      });
      // recompute(); // button-only mode
    });
    document.getElementById("cf-size")

    // Cable rows
    document.getElementById("cf-add").addEventListener("click", () => addRow());
    addRow(); // one seed row

    // recompute(); // button-only mode
  }

  document.addEventListener("DOMContentLoaded", init);
})();
