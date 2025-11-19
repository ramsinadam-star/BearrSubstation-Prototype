
// Anchor Bolt Tension (ACI 318-19 simplified) — For substation equipment baseplates.
(function(){
  
// Minimal helpers (scoped per file)
function byId(id){ return document.getElementById(id); }
function num(id){ const v = parseFloat(byId(id).value); return isNaN(v)? NaN : v; }
function fmt(x, d=3){ return Number(x).toLocaleString(undefined,{maximumFractionDigits:d}); }
function err(msg){ return `<div class="notice error">${msg}</div>`; }
function note(msg){ return `<p class="note">${msg}</p>`; }

  function steelStrength(d_in, Fu_ksi=125, n=1){
    const As = Math.PI * (d_in**2) / 4.0;
    const Nn = 0.75 * As * Fu_ksi * n;
    return {Nn, phiN: 0.75*Nn};
  }
  function breakoutStrength(fc_psi, hef_in, psi_ed=1.0, n=1){
    const k = 24.0;
    const Nn = k * Math.sqrt(fc_psi) * (hef_in**1.5) * psi_ed * n / 1000.0;
    return {Nn, phiN: 0.75*Nn};
  }
  function pulloutStrength(fc_psi, hef_in, head_factor=1.0, n=1){
    const Nn = 8.0 * Math.sqrt(fc_psi) * (hef_in**1.5) * head_factor * n / 1000.0;
    return {Nn, phiN: 0.70*Nn};
  }
  function init(){
    const btn = byId("calc-btn");
    if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const d = num("ab-diam");
      const hef = num("ab-hef");
      const fc = num("ab-fc");
      const n = num("ab-count");
      const Fu = num("ab-fu");
      if([d,hef,fc,n,Fu].some(v=>!isFinite(v)||v<=0)){ byId("result").innerHTML = err("Enter valid positive inputs."); return; }
      const steel = steelStrength(d, Fu, n);
      const breakout = breakoutStrength(fc, hef, 1.0, n);
      const pullout = pulloutStrength(fc, hef, 1.0, n);
      const controls = [
        {name:"Steel (tension)", ...steel},
        {name:"Concrete breakout (tension)", ...breakout},
        {name:"Pullout (tension)", ...pullout},
      ];
      controls.sort((a,b)=>a.phiN-b.phiN);
      const governing = controls[0];
      const req = num("ab-demand");
      const ok = (isFinite(req) && req>0) ? (governing.phiN >= req) : null;
      byId("result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Design Summary</h3>
          <div class="kv">
            ${controls.map(c=>`<div><span class="k">${c.name}</span><span class="v">ϕN<sub>n</sub>=${fmt(c.phiN,2)} kips (N<sub>n</sub>=${fmt(c.Nn,2)})</span></div>`).join("")}
          </div>
          <p class="lead">Governing: <strong>${governing.name}</strong> → ϕN<sub>n</sub>= <strong>${fmt(governing.phiN,2)}</strong> kips.</p>
          ${(isFinite(req)&&req>0) ? `<p><strong>Demand check:</strong> ${fmt(governing.phiN,2)} ≥ ${fmt(req,2)} kips → <b>${ok?"OK":"NG"}</b></p>` : note("Enter factored tension demand to check capacity.")}
          ${note("Quick-check per ACI 318 anchorage concepts; edge effects, spacing, cracked concrete, and supplementary factors are not included.")}
        </div>
      `;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
