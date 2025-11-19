
// Wind Load (ASCE-style quick check): qz = 0.00256 Kz Kzt Kd V^2 (psf), p = qz*G*Cp - qi*GCpi
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function Kz_from_exposure(exp, z){
    z = Math.max(15, Math.min(900, z||33));
    const a = {B:7, C:9.5, D:11.5}[exp]||9.5;
    const alpha = {B:0.20, C:0.15, D:0.10}[exp]||0.15;
    return Math.pow(z/a, alpha);
  }
  function init(){
    const btn = byId("wl-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const V = num("wl-V");
      const exp = byId("wl-exp").value;
      const z = num("wl-z");
      const Kzt = num("wl-Kzt");
      const Kd = num("wl-Kd");
      const G = num("wl-G");
      const Cp = num("wl-Cp");
      const GCpi = num("wl-GCpi");
      if([V,Kzt,Kd,G,Cp,GCpi].some(v=>!isFinite(v))){ byId("wl-result").innerHTML = err("Check inputs."); return; }
      const Kz = Kz_from_exposure(exp, z);
      const qz = 0.00256 * Kz * Kzt * Kd * (V**2);
      const qi = qz;
      const p = qz*G*Cp - qi*GCpi;
      byId("wl-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Wind Pressure</h3>
          <div class="kv">
            <div><span class="k">q<sub>z</sub></span><span class="v">${fmt(qz,3)} psf</span></div>
            <div><span class="k">p (net)</span><span class="v"><strong>${fmt(p,3)}</strong> psf</span></div>
          </div>
          ${note("ASCE 7-style quick check with coarse Kz; verify building/category-specific factors per ASCE 7.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
