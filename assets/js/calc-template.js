
// calc-template.js — Starter logic for new calculators
(function(){
  document.getElementById('calc-run')?.addEventListener('click', function(){
    const form = document.getElementById('calc-form');
    const v1 = parseFloat(document.getElementById('input-1').value);
    const s1 = document.getElementById('select-1').value;
    const out = document.getElementById('result');
    if (isNaN(v1)) {
      out.innerHTML = '<p class="error">Please fill out required inputs.</p>';
      return;
    }
    out.innerHTML = '<div class="card"><h3 class="card-title">Result</h3><p><strong>Value:</strong> ' + v1 + ' (' + s1 + ')</p></div>';
  });
  // Clear uses global handler in main.js (instant reload)
})();
