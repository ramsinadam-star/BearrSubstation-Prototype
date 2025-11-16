// assets/js/lib/math.js (V5.0) - shared math helpers
(function(global){
  const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));
  const pct = (num, den)=> den!==0 ? (num/den)*100 : 0;
  const round = (n, d=2)=> Number(n.toFixed(d));
  global.MATHX = { clamp, pct, round };
})(window);