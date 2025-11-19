
// pipe-bus-sizing.js — Redesigned calculator
// - Base: electrical screen (J·A) -> Sch 40 & Sch 80 picks
// - Advanced: IEEE 605-style mechanical -> minimum Sch 40 & Sch 80 sizes
// - Cyan summary card, Sch 40 above Sch 80, stacked

(function(){
  const byId = (id)=> document.getElementById(id);
  const fmt = (n, d=2)=> Number(n).toFixed(d);

  // NPS OD (inches)
  const OD = {"2":2.375,"2.5":2.875,"3":3.5,"3.5":4.0,"4":4.5,"5":5.563,"6":6.625,"8":8.625,"10":10.75,"12":12.75};
  // Wall thickness
  const SCH40 = {"2":0.154,"2.5":0.203,"3":0.216,"3.5":0.226,"4":0.237,"5":0.258,"6":0.280,"8":0.322,"10":0.365,"12":0.375};
  const SCH80 = {"2":0.218,"2.5":0.276,"3":0.300,"3.5":0.318,"4":0.337,"5":0.375,"6":0.432,"8":0.500,"10":0.593,"12":0.688};

  // Material presets: electrical screen J (A/in^2) and nominal bending stress allow (ksi) for mechanical screen
  const MATERIALS = {
    al_6063_t6: { name: "Aluminum 6063‑T6", J: 800,  sigmaAllow: 12 },
    al_6061_t6: { name: "Aluminum 6061‑T6", J: 850,  sigmaAllow: 14 },
    cu_etp:     { name: "Copper ETP",       J: 1250, sigmaAllow: 20 },
  };

  // Section properties
  function area_ring(od, t){ const id = od - 2*t; return Math.PI/4 * (od*od - id*id); }
  function I_p(od, t){ const id = od - 2*t; return Math.PI/64 * (Math.pow(od,4)-Math.pow(id,4)); }
  function S_p(od, t){ return I_p(od,t) / (od/2); }

  // Force per unit length (IEEE 605 form): lb/ft from A^2/m
  const LBFT_PER_A2_PER_M = 0.06852176556;

  // ---------- ELECTRICAL (J·A) ----------
  function pickElectrical(schedule, reqA, matKey){
    const tmap = (schedule===40?SCH40:SCH80);
    const J = MATERIALS[matKey].J;
    const ordered = Object.keys(OD).sort((a,b)=> OD[a]-OD[b]);
    for (const nps of ordered){
      const t = tmap[nps]; if (!t) continue;
      const ampacity = J * area_ring(OD[nps], t);
      if (ampacity >= reqA) return { nps, schedule, od:OD[nps], t, ampacity };
    }
    const last = ordered[ordered.length-1]; const t = tmap[last];
    return { nps:last, schedule, od:OD[last], t, ampacity: J*area_ring(OD[last], t), note:"largest available" };
  }

  // ---------- MECHANICAL (IEEE 605) ----------
  function mech_sigma_ksi(nps, schedule, I_fault_kA, k_peak, phase_in, span_ft){
    const od = OD[nps]; const t = (schedule===40?SCH40:SCH80)[nps];
    const S = S_p(od, t);
    const Irms = I_fault_kA * 1000;
    const Ipk  = k_peak * Irms;
    const Dm   = phase_in * 0.0254;
    const w = LBFT_PER_A2_PER_M * (Ipk*Ipk) / Dm;
    const M_inlb = (w * span_ft * span_ft / 8) * 12.0;
    return M_inlb / S / 1000.0; // ksi
  }
  function pickMechanical(schedule, sigmaAllow, I_fault_kA, k_peak, phase_in, span_ft){
    const tmap = (schedule===40?SCH40:SCH80);
    const ordered = Object.keys(OD).sort((a,b)=> OD[a]-OD[b]);
    for (const nps of ordered){
      const t = tmap[nps]; if (!t) continue;
      const sigma = mech_sigma_ksi(nps, schedule, I_fault_kA, k_peak, phase_in, span_ft);
      if (sigma <= sigmaAllow) return { nps, schedule, od:OD[nps], t, sigma };
    }
    const last = ordered[ordered.length-1]; const t = tmap[last];
    return { nps:last, schedule, od:OD[last], t, sigma: mech_sigma_ksi(last, schedule, I_fault_kA, k_peak, phase_in, span_ft), note:"largest available" };
  }

  // ---------- RENDER ----------
  function cardElectrical(reqA, mat, e40, e80){
    return `
      <div class="card soft" style="border-color: var(--accent); box-shadow: 0 10px 30px rgba(24,195,214,.10)">
        <p class="lead" style="color: var(--accent)">Pipe Bus Sizing (Electrical)</p>
        <div class="kv">
          <div><span class="k">Material</span>&nbsp;<span class="v" style="color: var(--accent)">${mat.name}</span></div>
          <div><span class="k">Target current</span>&nbsp;<span class="v" style="color: var(--accent)">${fmt(reqA,0)} A</span></div>
          <div style="grid-column:1/-1"><span class="k">Sch 40</span>&nbsp;<span class="v" style="color: var(--accent)">${e40.nps}" — OD ${fmt(e40.od,3)} in, wall ${fmt(e40.t,3)} in — est. ${fmt(e40.ampacity,0)} A</span></div>
          <div style="grid-column:1/-1; margin-top:.25rem;"><span class="k">Sch 80</span>&nbsp;<span class="v" style="color: var(--accent)">${e80.nps}" — OD ${fmt(e80.od,3)} in, wall ${fmt(e80.t,3)} in — est. ${fmt(e80.ampacity,0)} A</span></div>
        </div>
        <p class="note">Rule-of-thumb screen using J(material) × metal area. Confirm thermal rating per project standards.</p>
      </div>`;
  }

  function cardMechanical(mat, m40, m80, mech){
    return `
      <div class="card soft" style="border-color: var(--accent); box-shadow: 0 10px 30px rgba(24,195,214,.10)">
        <p class="lead" style="color: var(--accent)">Mechanical Sizing (IEEE 605)</p>
        <div class="kv">
          <div><span class="k">Material</span>&nbsp;<span class="v" style="color: var(--accent)">${mat.name}</span></div>
          <div><span class="k">Inputs</span>&nbsp;<span class="v" style="color: var(--accent)">I = ${fmt(mech.I_fault_kA,1)} kA RMS, k = ${fmt(mech.k_peak,2)}, D = ${fmt(mech.phase_in,0)} in, L = ${fmt(mech.span_ft,1)} ft, σallow = ${fmt(mech.sigmaAllow,2)} ksi</span></div>
          <div style="grid-column:1/-1"><span class="k">Sch 40 (min)</span>&nbsp;<span class="v" style="color: var(--accent)">${m40.nps}" — OD ${fmt(m40.od,3)} in, wall ${fmt(m40.t,3)} in</span></div>
          <div style="grid-column:1/-1; margin-top:.25rem;"><span class="k">Sch 80 (min)</span>&nbsp;<span class="v" style="color: var(--accent)">${m80.nps}" — OD ${fmt(m80.od,3)} in, wall ${fmt(m80.t,3)} in</span></div>
        </div>
        <p class="note">Minimum NPS per schedule satisfying σ ≤ σallow from IEEE 605 electrodynamic forces and beam bending.</p>
      </div>`;
  }

  // ---------- CONTROLLER ----------
  function computeElectrical(){
    const matKey = byId("bus-material")?.value || "al_6063_t6";
    const mat = MATERIALS[matKey];
    const reqA = parseFloat(byId("bus-current")?.value) || 0;
    const target = byId("bus-result-elec");

    if (reqA <= 0){
      target.innerHTML = '<div class="notice error">Enter a required current &gt; 0.</div>';
      return;
    }
    const e40 = pickElectrical(40, reqA, matKey);
    const e80 = pickElectrical(80, reqA, matKey);
    target.innerHTML = cardElectrical(reqA, mat, e40, e80);
  }

  function computeMechanical(){
    const matKey = byId("bus-material")?.value || "al_6063_t6";
    const mat = MATERIALS[matKey];

    const I_fault_kA = parseFloat(byId("bus-fault")?.value) || 0;
    const k_peak     = parseFloat(byId("bus-k")?.value)     || 0;
    const phase_in   = parseFloat(byId("bus-phase")?.value) || 0;
    const span_ft    = parseFloat(byId("bus-span")?.value)  || 0;
    const sigma_in   = parseFloat(byId("bus-sigma")?.value);
    const sigmaAllow = (isFinite(sigma_in) && sigma_in>0) ? sigma_in : mat.sigmaAllow;

    const target = byId("bus-result-elec");

    if (!(I_fault_kA>0 && k_peak>0 && phase_in>0 && span_ft>0)){
      target.innerHTML = '<div class="notice error">Enter fault kA, k, spacing, and span to calculate mechanical minimums.</div>';
      return;
    }
    const m40 = pickMechanical(40, sigmaAllow, I_fault_kA, k_peak, phase_in, span_ft);
    const m80 = pickMechanical(80, sigmaAllow, I_fault_kA, k_peak, phase_in, span_ft);
    target.innerHTML = cardMechanical(mat, m40, m80, {I_fault_kA,k_peak,phase_in,span_ft,sigmaAllow});
  }

  function init(){
    // Prevent form submit behavior
    const form = document.getElementById("bus-form");
    if (form){ form.addEventListener("submit", (e)=> { e.preventDefault(); return false; }); }

    // Buttons
    const btn = byId("bus-calc");
    const adv = byId("bus-adv-calc");
    if (btn) btn.addEventListener("click", (e)=> { e.preventDefault(); computeElectrical(); });
    if (adv) adv.addEventListener("click", (e)=> { e.preventDefault(); computeMechanical(); });

    const clr = byId("bus-clear");
    if (clr) clr.addEventListener("click", (e)=>{
      e.preventDefault();
      // Clear base inputs
      const matSel = byId("bus-material"); if (matSel) matSel.value = "al_6063_t6";
      const req = byId("bus-current"); if (req) req.value = "";
      // Clear advanced inputs
      const f = id=>{ const el = byId(id); if (el) el.value = ""; };
      f("bus-fault"); f("bus-k"); f("bus-phase"); f("bus-span"); f("bus-sigma");
      // Clear results
      const er = byId("bus-result-elec"); if (er) er.innerHTML = "";
      const mr = byId("bus-result-mech"); if (mr) mr.innerHTML = "";
    });

    // Prefill allowable stress placeholder
    const matSel = byId("bus-material");
    const sigmaEl = byId("bus-sigma");
    if (matSel && sigmaEl){
      const updateSigma = ()=> {
        const m = MATERIALS[matSel.value] || MATERIALS.al_6063_t6;
        if (!sigmaEl.value) sigmaEl.placeholder = m.sigmaAllow + " (ksi)";
      };
      matSel.addEventListener("change", updateSigma);
      updateSigma();
    }

    // Initial draw
    computeElectrical();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
