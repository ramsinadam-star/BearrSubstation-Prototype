
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("cf-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const D_in = num("cf-D"); const S = num("cf-S"); const n = num("cf-n");
      if([D_in,S,n].some(v=>!isFinite(v)||v<=0)){ byId("cf-result").innerHTML = err("Enter positive diameter, slope, and n."); return; }
      const D = D_in/12.0; // ft
      const A = Math.PI*(D**2)/4.0; // ft²
      const R = D/4.0; // ft (hydraulic radius for full circular)
      const Q = (1.486/n) * A * Math.pow(R, 2/3) * Math.sqrt(S); // cfs
      byId("cf-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Culvert Capacity (Full Flow)</h3>
          <div class="kv">
            <div><span class="k">Q</span><span class="v"><strong>${fmt(Q,2)}</strong> cfs</span></div>
          </div>
          ${note("Manning full-flow assumption; inlet/outlet control, headwater, and entrance losses not included.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
