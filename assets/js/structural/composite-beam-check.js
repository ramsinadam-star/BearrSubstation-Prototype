
// Composite Beam (simplified stud check)
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("cbm-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const be = num("cbm-be");
      const ts = num("cbm-ts");
      const fc = num("cbm-fc");
      const studs = num("cbm-n");
      const As = num("cbm-As");
      const Fu = num("cbm-Fu");
      if([be,ts,fc,studs,As,Fu].some(v=>!isFinite(v)||v<=0)){ byId("cbm-result").innerHTML = err("Enter positive inputs."); return; }
      const Qreq = 0.85*fc*be*ts/1000.0;
      const Qn = 0.5*As*Fu;
      const phi = 0.75;
      const phiQn_total = phi * Qn * studs;
      const ok = phiQn_total >= Qreq;
      byId("cbm-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Composite Shear (Studs)</h3>
          <div class="kv">
            <div><span class="k">Q<sub>req</sub> (full composite)</span><span class="v">${fmt(Qreq,2)} kips</span></div>
            <div><span class="k">ϕQ<sub>n,total</sub></span><span class="v"><strong>${fmt(phiQn_total,2)}</strong> kips</span></div>
          </div>
          <p><strong>Studs check:</strong> ${fmt(phiQn_total,2)} ≥ ${fmt(Qreq,2)} → <b>${ok?"OK":"NG"}</b></p>
          ${note("Very simplified check; actual design per AISC 360 requires detailed composite flexure and stud capacity per deck profile & concrete strength.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
