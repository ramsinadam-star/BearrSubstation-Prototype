
// Beam Deflection — simply supported (UDL or midspan point load)
(function(){
  
// Minimal helpers (scoped per file)
function byId(id){ return document.getElementById(id); }
function num(id){ const v = parseFloat(byId(id).value); return isNaN(v)? NaN : v; }
function fmt(x, d=3){ return Number(x).toLocaleString(undefined,{maximumFractionDigits:d}); }
function err(msg){ return `<div class="notice error">${msg}</div>`; }
function note(msg){ return `<p class="note">${msg}</p>`; }

  function init(){
    const btn = byId("bd-btn");
    if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const L_ft = num("bd-L");
      const E_ksi = num("bd-E");
      const I_in4 = num("bd-I");
      const caseType = byId("bd-case").value;
      if([L_ft,E_ksi,I_in4].some(v=>!isFinite(v)||v<=0)){ byId("bd-result").innerHTML = err("Enter valid L, E, I."); return; }
      const L_in = L_ft*12;
      let delta_in = NaN;
      if (caseType === "udl"){
        const w_kipft = num("bd-w");
        if(!isFinite(w_kipft) || w_kipft<=0) { byId("bd-result").innerHTML = err("Enter valid uniform load w."); return; }
        const w_kipin = w_kipft/12.0;
        delta_in = 5 * w_kipin * (L_in**4) / (384 * E_ksi * I_in4);
      } else {
        const P_kip = num("bd-P");
        if(!isFinite(P_kip) || P_kip<=0) { byId("bd-result").innerHTML = err("Enter valid point load P."); return; }
        delta_in = P_kip * (L_in**3) / (48 * E_ksi * I_in4);
      }
      const ratio = L_in / delta_in;
      byId("bd-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Deflection</h3>
          <div class="kv">
            <div><span class="k">δ<sub>max</sub></span><span class="v"><strong>${fmt(delta_in,3)}</strong> in</span></div>
            <div><span class="k">Service ratio</span><span class="v">L/δ = ${fmt(ratio,0)}</span></div>
          </div>
          ${note("Compare against serviceability limits (e.g., L/240, L/360).")}
        </div>
      `;
    });
    byId("bd-case")?.addEventListener("change", () => {
      const isUDL = byId("bd-case").value==="udl";
      byId("row-w").style.display = isUDL? "block":"none";
      byId("row-P").style.display = isUDL? "none":"block";
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
