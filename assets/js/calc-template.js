// assets/js/calc-template.js (V5.0) - generic calculator controller
(function(){
  const { qs, renderResult, toNum, fmt } = window.UI;

  function compute(a, b){
    const sum = a + b;
    const diff = a - b;
    return [
      ["Input A", fmt(a,2)],
      ["Input B", fmt(b,2)],
      ["Sum", fmt(sum,2)],
      ["Difference", fmt(diff,2)]
    ];
  }

  function initCalc(ids){
    const btn = qs("#calc-btn");
    const out = qs("#result");
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      const a = toNum(ids.a);
      const b = toNum(ids.b);
      const rows = compute(a,b);
      renderResult(out, rows, "Template result");
    });
  }

  // Expose factory
  window.CALC_TEMPLATE = { initCalc };
})();