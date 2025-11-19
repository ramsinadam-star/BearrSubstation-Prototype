
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("se-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const H = num("se-H");
      const sigma0 = num("se-sigma0");
      const dS = num("se-dSigma");
      const Cc = num("se-Cc"); const e0 = num("se-e0");
      const mv = num("se-mv");
      if(!isFinite(H)||H<=0 || !isFinite(dS)||dS<=0){ byId("se-result").innerHTML = err("Enter positive layer thickness H and stress increase Δσ."); return; }
      let S_in = NaN, method="";
      if(isFinite(mv) && mv>0){
        S_in = mv * (H) * dS * 12.0;
        method = "mv method";
      } else if([Cc,e0,sigma0].every(x=>isFinite(x) && x>0)){
        const ratio = (sigma0 + dS)/sigma0;
        const S_ft = (Cc/(1+e0)) * (H) * (Math.log10(ratio));
        S_in = S_ft*12.0;
        method = "Cc/e0 method";
      } else {
        byId("se-result").innerHTML = err("Provide either (m_v) or (Cc, e0, σ0)."); return;
      }
      byId("se-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Estimated Settlement</h3>
          <div class="kv">
            <div><span class="k">S</span><span class="v"><strong>${fmt(S_in,2)}</strong> in</span></div>
            <div><span class="k">Method</span><span class="v">${method}</span></div>
          </div>
          ${note("Primary consolidation only; ignore secondary compression, layered soils, drainage path, and preconsolidation effects.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
