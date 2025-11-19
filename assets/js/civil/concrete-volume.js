
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("cv-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const L = num("cv-L"); // ft
      const W = num("cv-W"); // ft
      const t_in = num("cv-t"); // in
      if([L,W,t_in].some(v=>!isFinite(v)||v<=0)){ byId("cv-result").innerHTML = err("Enter positive dimensions."); return; }
      const t_ft = t_in/12.0;
      const vol_ft3 = L*W*t_ft;
      const vol_yd3 = vol_ft3/27.0;
      byId("cv-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Concrete Volume</h3>
          <div class="kv">
            <div><span class="k">Volume</span><span class="v"><strong>${fmt(vol_yd3,3)}</strong> yd³</span></div>
            <div><span class="k">Volume</span><span class="v">${fmt(vol_ft3,2)} ft³</span></div>
          </div>
          ${note("Adds no waste factor; consider 5–10% for ordering.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
