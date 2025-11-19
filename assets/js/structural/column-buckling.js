
// Column Buckling (Euler)
(function(){
  
// Minimal helpers (scoped per file)
function byId(id){ return document.getElementById(id); }
function num(id){ const v = parseFloat(byId(id).value); return isNaN(v)? NaN : v; }
function fmt(x, d=3){ return Number(x).toLocaleString(undefined,{maximumFractionDigits:d}); }
function err(msg){ return `<div class="notice error">${msg}</div>`; }
function note(msg){ return `<p class="note">${msg}</p>`; }

  function init(){
    const btn = byId("cb-btn");
    if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const K = num("cb-K");
      const L_ft = num("cb-L");
      const E_ksi = num("cb-E");
      const I_in4 = num("cb-I");
      const A_in2 = num("cb-A");
      if([K,L_ft,E_ksi,I_in4].some(v=>!isFinite(v)||v<=0)){ byId("cb-result").innerHTML = err("Enter valid K, L, E, I."); return; }
      const L_in = L_ft*12;
      const Pcr_k = (Math.PI**2) * E_ksi * I_in4 / ((K*L_in)**2);
      const sigma = (isFinite(A_in2)&&A_in2>0) ? (Pcr_k / A_in2) : NaN;
      byId("cb-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Buckling</h3>
          <div class="kv">
            <div><span class="k">P<sub>cr</sub></span><span class="v"><strong>${fmt(Pcr_k,2)}</strong> kips</span></div>
            ${isFinite(sigma)? `<div><span class="k">σ<sub>cr</sub></span><span class="v">${fmt(sigma,3)} ksi</span></div>` : ""}
          </div>
          ${note("Elastic Euler buckling; ensure member is in Euler range and compare with AISC column curves as needed.")}
        </div>
      `;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
