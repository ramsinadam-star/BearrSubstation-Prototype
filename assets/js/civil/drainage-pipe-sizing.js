
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function capacity_for_D(Dft, S, n){
    const A = Math.PI*(Dft**2)/4.0;
    const R = Dft/4.0;
    return (1.486/n) * A * Math.pow(R, 2/3) * Math.sqrt(S);
  }
  function solve_D(Q, S, n){
    // simple Newton or bisection on D (ft)
    let lo=0.1, hi=15.0; // 1.2 in to 15 ft
    for(let i=0;i<60;i++){ 
      const mid=(lo+hi)/2;
      const q=capacity_for_D(mid,S,n);
      if(q<Q) lo=mid; else hi=mid;
    }
    return (lo+hi)/2;
  }
  function init(){
    const btn = byId("dp-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const Q = num("dp-Q"); const S = num("dp-S"); const n = num("dp-n");
      if([Q,S,n].some(v=>!isFinite(v)||v<=0)){ byId("dp-result").innerHTML = err("Enter positive Q, slope, and n."); return; }
      const Dft = solve_D(Q,S,n);
      const Din = Dft*12.0;
      byId("dp-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Required Pipe Size (Full Flow)</h3>
          <div class="kv">
            <div><span class="k">Diameter</span><span class="v"><strong>${fmt(Din,1)}</strong> in</span></div>
          </div>
          ${note("Full-flow Manning sizing; check standard diameters and hydraulic grade line per project criteria.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
