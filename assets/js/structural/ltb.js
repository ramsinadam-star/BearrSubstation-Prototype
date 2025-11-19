
// Lateral Torsional Buckling (elastic Mcr quick check)
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("ltb-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const E = num("ltb-E"); const G = num("ltb-G");
      const Iy = num("ltb-Iy"); const J = num("ltb-J"); const Cw = num("ltb-Cw");
      const Lb = num("ltb-Lb"); const Cb = num("ltb-Cb");
      if([E,G,Iy,J,Cw,Lb,Cb].some(v=>!isFinite(v)||v<=0)){ byId("ltb-result").innerHTML = err("Enter positive inputs."); return; }
      const term = Math.sqrt( (G*J)/(E*Iy) + (Math.PI**2*Cw)/((Lb**2)*Iy) );
      const Mcr = Cb * (Math.PI**2 * E * Iy / Lb) * term;
      byId("ltb-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Elastic LTB Moment</h3>
          <div class="kv">
            <div><span class="k">M<sub>cr</sub></span><span class="v"><strong>${fmt(Mcr,2)}</strong> (unit-consistent)</span></div>
          </div>
          ${note("Elastic Mcr quick check; for AISC design use F2 provisions with Lp/Lr, Sx/Zx, r_ts, and material Fy.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
