
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("fd-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const P = num("fd-P"); // kips
      const qa = num("fd-qa"); // ksf allowable
      const B = num("fd-B"); // ft
      const L = num("fd-L"); // ft
      if([P,qa].some(v=>!isFinite(v)||v<=0)){ byId("fd-result").innerHTML = err("Enter positive P and q_allow."); return; }
      let area_req = P/qa; // ft^2
      let area_prov = NaN, q = NaN, summary="";
      if(isFinite(B)&&B>0 && isFinite(L)&&L>0){
        area_prov = B*L;
        q = P/area_prov;
        summary = `<div><span class="k">Provided q</span><span class="v">${fmt(q,3)} ksf</span></div>`;
      }
      byId("fd-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Footing Bearing</h3>
          <div class="kv">
            <div><span class="k">Required area</span><span class="v"><strong>${fmt(area_req,2)}</strong> ft²</span></div>
            ${summary}
          </div>
          ${note("No eccentricity or uplift considered. Check sliding, overturning, and structural reinforcement separately.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
