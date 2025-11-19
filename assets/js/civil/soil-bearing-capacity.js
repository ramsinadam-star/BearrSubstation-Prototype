
// Soil Bearing Capacity — quick check
// Supports either: (1) given allowable qa and load P → required area; or
// (2) given ultimate capacity q_u and factor of safety FS → qa = q_u/FS.
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("sbc-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const P = num("sbc-P"); // kips
      let qa = num("sbc-qa"); // ksf allowable
      const qu = num("sbc-qu"); // ksf ultimate
      const FS = num("sbc-FS"); // factor of safety
      const B = num("sbc-B"); const L = num("sbc-L"); // provided
      if(!isFinite(P) || P<=0){ byId("sbc-result").innerHTML = err("Enter factored/service load P (kips)."); return; }
      // derive qa if missing but qu and FS provided
      if((!isFinite(qa) || qa<=0) && isFinite(qu) && qu>0 && isFinite(FS) && FS>0){ qa = qu/FS; }
      if(!isFinite(qa) || qa<=0){ byId("sbc-result").innerHTML = err("Provide allowable qa (ksf) or ultimate q_u (ksf) with FS."); return; }
      const Areq = P/qa; // ft²
      let provided = "";
      if(isFinite(B)&&B>0 && isFinite(L)&&L>0){
        const Aprov = B*L;
        const qprov = P/Aprov;
        provided = `<div><span class="k">Provided area</span><span class="v">${fmt(Aprov,2)} ft²</span></div>
                    <div><span class="k">Bearing (provided)</span><span class="v">${fmt(qprov,3)} ksf</span></div>
                    <p><strong>Check:</strong> ${fmt(qprov,3)} ≤ ${fmt(qa,3)} ksf → <b>${qprov<=qa?"OK":"NG"}</b></p>`;
      }
      byId("sbc-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Soil Bearing Capacity</h3>
          <div class="kv">
            <div><span class="k">Allowable q<sub>a</sub></span><span class="v"><strong>${fmt(qa,3)}</strong> ksf</span></div>
            <div><span class="k">Required area</span><span class="v"><strong>${fmt(Areq,2)}</strong> ft²</span></div>
          </div>
          ${provided}
          ${note("Quick bearing check only; consider eccentricity (P–M), groundwater, settlement, and geotechnical recommendations.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
