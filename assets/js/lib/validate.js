// assets/js/lib/validate.js (V5.0) - input validation helpers
(function(global){
  function reqPos(v){ return (isFinite(v) && v>=0) ? null : "Enter a non-negative number"; }
  function collect(errors){ return errors.filter(Boolean); }
  global.VALID = { reqPos, collect };
})(window);