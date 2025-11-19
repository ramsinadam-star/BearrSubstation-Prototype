
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("sr-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const C = num("sr-C");
      const i = num("sr-i");
      const A = num("sr-A");
      if([C,i,A].some(v=>!isFinite(v)||v<=0)){ byId("sr-result").innerHTML = err("Enter positive C, i, and A."); return; }
      const k = 1.008;
      const Q = C * i * A * k;
      byId("sr-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Peak Flow (Rational)</h3>
          <div class="kv">
            <div><span class="k">Q</span><span class="v"><strong>${fmt(Q,2)}</strong> cfs</span></div>
          </div>
          ${note("Assumes time of concentration consistent with intensity i. Use local criteria for C and storm frequency.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
