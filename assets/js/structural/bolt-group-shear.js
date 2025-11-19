
// Bolt Group Shear — bearing-type quick check
(function(){
  
// Minimal helpers (scoped per file)
function byId(id){ return document.getElementById(id); }
function num(id){ const v = parseFloat(byId(id).value); return isNaN(v)? NaN : v; }
function fmt(x, d=3){ return Number(x).toLocaleString(undefined,{maximumFractionDigits:d}); }
function err(msg){ return `<div class="notice error">${msg}</div>`; }
function note(msg){ return `<p class="note">${msg}</p>`; }

  const FU = { "A325": 120, "A490": 150 };
  function area(d){ return Math.PI*(d**2)/4.0; }
  function init(){
    const btn = byId("bs-btn");
    if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const d = num("bs-d");
      const n = num("bs-n");
      const grade = byId("bs-grade").value;
      if([d,n].some(v=>!isFinite(v)||v<=0)){ byId("bs-result").innerHTML = err("Enter valid diameter and count."); return; }
      const Fu = FU[grade] || 120;
      const Ab = area(d);
      const Rn_per = 0.48*Fu*Ab;
      const phiRn_per = 0.75*Rn_per;
      const phiRn_total = phiRn_per * n;
      const V_u = num("bs-demand");
      const ok = (isFinite(V_u)&&V_u>0) ? (phiRn_total>=V_u) : null;
      byId("bs-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Shear Capacity</h3>
          <div class="kv">
            <div><span class="k">ϕR<sub>n</sub> per bolt</span><span class="v">${fmt(phiRn_per,2)} kips</span></div>
            <div><span class="k">Total ϕR<sub>n</sub></span><span class="v"><strong>${fmt(phiRn_total,2)}</strong> kips</span></div>
          </div>
          ${(isFinite(V_u)&&V_u>0) ? `<p><strong>Demand check:</strong> ${fmt(phiRn_total,2)} ≥ ${fmt(V_u,2)} kips → <b>${ok?"OK":"NG"}</b></p>` : note("Enter factored shear demand to check.")}
          ${note("Approximate bearing-type capacity; edge distances, hole types, threads in shear plane, and slip-critical checks not included.")}
        </div>
      `;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
