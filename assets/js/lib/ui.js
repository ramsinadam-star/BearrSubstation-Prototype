// assets/js/lib/ui.js (V5.0) - shared UI helpers
(function(global){
  function qs(sel, el){ return (el||document).querySelector(sel); }
  function qsa(sel, el){ return Array.from((el||document).querySelectorAll(sel)); }
  function kvRow(k, v){ return `<div><span class="k">${k}</span>&nbsp;<span class="v">${v}</span></div>`; }
  function renderResult(targetEl, rows, note){
    targetEl.innerHTML = `
      <div class="card soft">
        <div class="kv">${rows.map(([k,v]) => kvRow(k,v)).join("")}</div>
        ${note ? `<p class="note">${note}</p>` : ""}
      </div>
    `;
  }
  function toNum(id){ const el=document.getElementById(id); const v= parseFloat(el && el.value); return isFinite(v)?v:0; }
  function fmt(n, d){ return Number(n).toFixed(d==null?2:d); }
  global.UI = { qs, qsa, kvRow, renderResult, toNum, fmt };
})(window);