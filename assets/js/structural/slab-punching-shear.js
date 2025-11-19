
// Slab Punching Shear (ACI 318 simplified): ϕVc = ϕ * 4*sqrt(fc')*b0*d (lb) → kips
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("ps-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const fc = num("ps-fc");
      const c1 = num("ps-c1"); const c2 = num("ps-c2");
      const h = num("ps-h"); const d = num("ps-d");
      const Vu = num("ps-Vu");
      if([fc,c1,c2,h,d].some(v=>!isFinite(v)||v<=0)){ byId("ps-result").innerHTML = err("Enter valid fc', column sizes, h, d."); return; }
      const per = 2*(c1 + c2) + 4*d;
      const Vc_lb = 4*Math.sqrt(fc)*per*d;
      const phi = 0.75;
      const phiVc = phi * Vc_lb/1000.0;
      const ok = (isFinite(Vu)&&Vu>0) ? (phiVc>=Vu) : null;
      byId("ps-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Punching Shear</h3>
          <div class="kv">
            <div><span class="k">b<sub>0</sub></span><span class="v">${fmt(per,2)} in</span></div>
            <div><span class="k">ϕV<sub>c</sub></span><span class="v"><strong>${fmt(phiVc,2)}</strong> kips</span></div>
          </div>
          ${(isFinite(Vu)&&Vu>0) ? `<p><strong>Demand check:</strong> ${fmt(phiVc,2)} ≥ ${fmt(Vu,2)} → <b>${phiVc>=Vu?"OK":"NG"}</b></p>` : note("Enter Vu to check demand.")}
          ${note("Quick ACI 318-style check; ensure punching perimeter location, openings, edge/column strips, shear reinforcement, and load transfer are addressed.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
