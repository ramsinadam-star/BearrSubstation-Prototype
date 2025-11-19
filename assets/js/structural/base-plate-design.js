
// Base Plate Thickness (AISC DG1 quick check)
(function(){
  
// Minimal helpers (scoped per file)
function byId(id){ return document.getElementById(id); }
function num(id){ const v = parseFloat(byId(id).value); return isNaN(v)? NaN : v; }
function fmt(x, d=3){ return Number(x).toLocaleString(undefined,{maximumFractionDigits:d}); }
function err(msg){ return `<div class="notice error">${msg}</div>`; }
function note(msg){ return `<p class="note">${msg}</p>`; }

  function init(){
    const btn = byId("bp-btn");
    if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const P = num("bp-P");
      const b = num("bp-b");
      const N = num("bp-N");
      const m = num("bp-m");
      const Fy = num("bp-Fy");
      if([P,b,N,m,Fy].some(v=>!isFinite(v)||v<=0)){ byId("bp-result").innerHTML = err("Enter valid positive inputs."); return; }
      const q = P/(b*N);
      const t_req = m * Math.sqrt( (2*q)/(0.9*Fy) );
      byId("bp-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Plate Thickness</h3>
          <div class="kv">
            <div><span class="k">Bearing pressure q</span><span class="v">${fmt(q,4)} ksi</span></div>
            <div><span class="k">Required t</span><span class="v"><strong>${fmt(t_req,3)}</strong> in</span></div>
          </div>
          ${note("Based on cantilever plate theory per AISC Design Guide 1 approximation. Check anchor tension/bending and concrete bearing separately.")}
        </div>
      `;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
