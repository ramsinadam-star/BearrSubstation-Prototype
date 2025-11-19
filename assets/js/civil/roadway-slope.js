
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function init(){
    const btn = byId("rslope-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const e1 = num("rs-e1");
      const e2 = num("rs-e2");
      const L  = num("rs-L");
      let out = "";
      if(isFinite(e1) && isFinite(e2) && isFinite(L) && L>0){
        const rise = e2 - e1;
        const grade = (rise/L)*100.0;
        out = `<div class="kv">
                 <div><span class="k">Rise</span><span class="v">${fmt(rise,2)} ft</span></div>
                 <div><span class="k">Grade</span><span class="v"><strong>${fmt(grade,2)}</strong> %</span></div>
               </div>`;
      } else if (isFinite(e1) && isFinite(L) && isFinite(num("rs-grade"))) {
        const grade = num("rs-grade");
        const rise = (grade/100.0) * L;
        const e2calc = e1 + rise;
        out = `<div class="kv">
                 <div><span class="k">Rise</span><span class="v">${fmt(rise,2)} ft</span></div>
                 <div><span class="k">End Elev</span><span class="v"><strong>${fmt(e2calc,2)}</strong> ft</span></div>
               </div>`;
      } else {
        byId("rslope-result").innerHTML = err("Provide (start, end, distance) OR (start, distance, grade%)."); return;
      }
      byId("rslope-result").innerHTML = `<div class="card soft"><h3 class="card-title">Roadway Slope</h3>${out}</div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
