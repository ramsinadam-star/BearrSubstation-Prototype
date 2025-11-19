
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  const barArea = {"#3":0.11,"#4":0.20,"#5":0.31,"#6":0.44,"#7":0.60,"#8":0.79};
  function init(){
    const btn = byId("rs-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const size = byId("rs-size").value;
      const As_req = num("rs-Asreq"); // in^2/ft
      if(!isFinite(As_req)||As_req<=0){ byId("rs-result").innerHTML = err("Enter required steel area (in²/ft)."); return; }
      const Ab = barArea[size] || 0.20;
      const s_in = 12.0*Ab/As_req; // inches
      byId("rs-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Bar Spacing</h3>
          <div class="kv">
            <div><span class="k">Spacing</span><span class="v"><strong>${fmt(s_in,1)}</strong> in (center-to-center)</span></div>
          </div>
          ${note("Check against ACI minimum/maximum spacing, cover, and crack control requirements.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
