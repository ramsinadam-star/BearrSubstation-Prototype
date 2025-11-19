
// Seismic Base Shear: V = C_s * W ; C_s = min(SDS/(R/Ie), 0.044*S1*Ie/R) but ≥ 0.01
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("eq-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const SDS = num("eq-SDS"); const S1 = num("eq-S1");
      const R = num("eq-R"); const Ie = num("eq-Ie"); const W = num("eq-W");
      if([SDS,S1,R,Ie,W].some(v=>!isFinite(v)||v<=0)){ byId("eq-result").innerHTML = err("Enter positive inputs."); return; }
      const Cs1 = SDS/(R/Ie);
      const Cs2 = 0.044*S1*Ie/R;
      let Cs = Math.min(Cs1, Cs2);
      Cs = Math.max(Cs, 0.01);
      const V = Cs * W;
      byId("eq-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Base Shear</h3>
          <div class="kv">
            <div><span class="k">C<sub>s</sub></span><span class="v">${fmt(Cs,4)}</span></div>
            <div><span class="k">V</span><span class="v"><strong>${fmt(V,2)}</strong> kips</span></div>
          </div>
          ${note("ASCE 7 quick check; ensure applicability of equations and limits (e.g., T & seismic design category).")} 
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
