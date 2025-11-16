
// Voltage Drop Calculator (V4.0)
// Uses NEC-style K method with circular mil areas
// Single-phase: Vd = 2 * K * I * L / CM
// Three-phase:  Vd = √3 * K * I * L / CM
// K constants (ohm-cmil/ft) approx @ 75°C: Cu=12.9, Al=21.2

(function(){
  const K = { copper: 12.9, aluminum: 21.2 };

  // Circular mil areas for common sizes
  const CM = {
    "14 AWG": 4110, "12 AWG": 6530, "10 AWG": 10380,
    "8 AWG": 16510, "6 AWG": 26240, "4 AWG": 41740,
    "3 AWG": 52620, "2 AWG": 66360, "1 AWG": 83690,
    "1/0 AWG": 105600, "2/0 AWG": 133100, "3/0 AWG": 167800, "4/0 AWG": 211600,
    "250 kcmil": 250000, "300 kcmil": 300000, "350 kcmil": 350000, "400 kcmil": 400000,
    "500 kcmil": 500000, "600 kcmil": 600000, "700 kcmil": 700000, "750 kcmil": 750000, "1000 kcmil": 1000000
  };

  const orderedSizes = Object.keys(CM);

  function fmt(n, digits=2){ return Number(n).toFixed(digits); }

  function computeDrop({phase, material, size, length_ft, volts, amps}){
    const k = K[material];
    const cm = CM[size];
    const L = length_ft; // one-way
    const I = amps;
    const factor = (phase === "single") ? (2) : Math.sqrt(3);
    const Vdrop = factor * k * I * L / cm;
    const Vload = volts - Vdrop;
    const pct = (Vdrop / volts) * 100;
    return { Vdrop, Vload, pct };
  }

  function suggestSize({phase, material, length_ft, volts, amps, max_pct}){
    for (let s of orderedSizes){
      const {pct} = computeDrop({phase, material, size: s, length_ft, volts, amps});
      if (pct <= max_pct) return s;
    }
    return null;
  }

  function byId(id){ return document.getElementById(id); }

  function parseNum(el){
    const v = parseFloat(el.value);
    return isFinite(v) ? v : 0;
  }

  function init(){
    // Populate size dropdown
    const sizeSel = byId("vd-size");
    sizeSel.innerHTML = "";
    orderedSizes.forEach(sz => {
      const opt = document.createElement("option");
      opt.value = sz; opt.textContent = sz;
      sizeSel.appendChild(opt);
    });
    sizeSel.value = "3 AWG";

    // Wire up buttons
    byId("vd-calc").addEventListener("click", e => {
      e.preventDefault();
      const phase = (byId("vd-phase").value);
      const material = (byId("vd-material").value);
      const size = (byId("vd-size").value);
      const length_ft = parseNum(byId("vd-length"));
      const volts = parseNum(byId("vd-volts"));
      const amps = parseNum(byId("vd-amps"));

      if (volts <= 0 || amps <= 0 || length_ft < 0){
        byId("vd-result").innerHTML = `<div class="notice error">Enter valid voltage, current, and length.</div>`;
        return;
      }

      const {Vdrop, Vload, pct} = computeDrop({phase, material, size, length_ft, volts, amps});
      byId("vd-result").innerHTML = `
        <div class="card soft">
          <div class="kv">
            <div><span class="k">Voltage drop</span>&nbsp;<span class="v">${fmt(Vdrop,3)} V</span></div>
            <div><span class="k">% drop</span>&nbsp;<span class="v">${fmt(pct,2)}%</span></div>
            <div><span class="k">Load voltage</span>&nbsp;<span class="v">${fmt(Vload,2)} V</span></div>
          </div>
          <p class="note">Based on ${phase === "single" ? "single‑phase" : "three‑phase"} ${material} and ${size}, one‑way length ${fmt(length_ft,2)} ft.</p>
        </div>
      `;
    });

    byId("vd-suggest").addEventListener("click", e => {
      e.preventDefault();
      const phase = (byId("vd-phase").value);
      const material = (byId("vd-material").value);
      const length_ft = parseNum(byId("vd-length"));
      const volts = parseNum(byId("vd-volts"));
      const amps = parseNum(byId("vd-amps"));
      const max_pct = parseNum(byId("vd-maxpct"));

      if (volts <= 0 || amps <= 0 || length_ft < 0 || max_pct <= 0){
        byId("vd-result").innerHTML = `<div class="notice error">Enter valid voltage, current, length, and max % drop.</div>`;
        return;
      }

      const sz = suggestSize({phase, material, length_ft, volts, amps, max_pct});
      if (!sz){
        byId("vd-result").innerHTML = `<div class="notice warn">No standard size meets ${fmt(max_pct)}% at these conditions. Consider shorter runs, lower current, or higher voltage.</div>`;
        return;
      }
      const {Vdrop, Vload, pct} = computeDrop({phase, material, size: sz, length_ft, volts, amps});

      byId("vd-size").value = sz; // update selection
      byId("vd-result").innerHTML = `
        <div class="card soft">
          <p class="lead">Suggested size: <strong>${sz}</strong></p>
          <div class="kv">
            <div><span class="k">Voltage drop</span>&nbsp;<span class="v">${fmt(Vdrop,3)} V</span></div>
            <div><span class="k">% drop</span>&nbsp;<span class="v">${fmt(pct,2)}%</span></div>
            <div><span class="k">Load voltage</span>&nbsp;<span class="v">${fmt(Vload,2)} V</span></div>
          </div>
          <p class="note">Meets ≤ ${fmt(max_pct,2)}% for ${phase === "single" ? "single‑phase" : "three‑phase"} ${material} at ${fmt(amps,2)} A and ${fmt(volts,0)} V, ${fmt(length_ft,2)} ft one‑way.</p>
        </div>
      `;
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
