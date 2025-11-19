
(function(){
  function byId(id){return document.getElementById(id);}function num(id){const v=parseFloat(byId(id).value);return isNaN(v)?NaN:v;}function fmt(x,d=3){return Number(x).toLocaleString(undefined,{maximumFractionDigits:d});}function err(m){return `<div class="notice error">${m}</div>`;}function note(m){return `<p class="note">${m}</p>`;}
  function Ka_from_phi(phi){
    const rad = phi*Math.PI/180.0;
    const K = Math.tan(Math.PI/4 - rad/2);
    return K*K;
  }
  function init(){
    const btn = byId("rw-btn"); if(!btn) return;
    btn.addEventListener("click", function(e){
      e.preventDefault();
      const H = num("rw-H"); const gamma = num("rw-gamma"); const phi = num("rw-phi");
      const W = num("rw-W"); const B = num("rw-B"); const mu = num("rw-mu");
      if([H,gamma,phi,W,B,mu].some(v=>!isFinite(v)||v<=0)){ byId("rw-result").innerHTML = err("Enter positive H, γ, φ, W, B, and μ."); return; }
      const Ka = Ka_from_phi(phi);
      const Pa_plf = 0.5*Ka*gamma*(H**2)/1000.0;
      const FSs = (mu*W)/Pa_plf;
      const Mres = W*(B/2.0);
      const Mot  = Pa_plf*(H/3.0);
      const FSo = Mres/Mot;
      byId("rw-result").innerHTML = `
        <div class="card soft">
          <h3 class="card-title">Retaining Wall Check</h3>
          <div class="kv">
            <div><span class="k">K<sub>a</sub></span><span class="v">${fmt(Ka,3)}</span></div>
            <div><span class="k">P<sub>a</sub></span><span class="v">${fmt(Pa_plf,3)} k/ft</span></div>
            <div><span class="k">FS<sub>sliding</sub></span><span class="v"><strong>${fmt(FSs,2)}</strong></span></div>
            <div><span class="k">FS<sub>OT</sub></span><span class="v"><strong>${fmt(FSo,2)}</strong></span></div>
          </div>
          ${note("Quick check assumes level backfill, no surcharge; add key/passive, bearing, drainage & global stability in design.")}
        </div>`;
    });
  }
  document.addEventListener("DOMContentLoaded", init);
})();
