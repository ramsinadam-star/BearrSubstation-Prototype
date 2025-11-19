
// Simplified NEC-based wire sizing (reference NEC 310.16 ampacity and common adjustments)
// This is an engineering aid; verify against current NEC and project specs.

const AMPACITY_TABLE = {
  // AWG/kcmil : { material: {60: A, 75: A, 90: A}}
  "14": {copper:{60:15,75:20,90:25}, aluminum:{60:10,75:15,90:20}},
  "12": {copper:{60:20,75:25,90:30}, aluminum:{60:15,75:20,90:25}},
  "10": {copper:{60:30,75:35,90:40}, aluminum:{60:25,75:30,90:35}},
  "8":  {copper:{60:40,75:50,90:55}, aluminum:{60:35,75:40,90:45}},
  "6":  {copper:{60:55,75:65,90:75}, aluminum:{60:40,75:50,90:55}},
  "4":  {copper:{60:70,75:85,90:95}, aluminum:{60:55,75:65,90:75}},
  "3":  {copper:{60:85,75:100,90:110}, aluminum:{60:65,75:75,90:85}},
  "2":  {copper:{60:95,75:115,90:130}, aluminum:{60:75,75:90,90:100}},
  "1":  {copper:{60:110,75:130,90:145}, aluminum:{60:85,75:100,90:115}},
  "1/0":{copper:{60:125,75:150,90:170}, aluminum:{60:100,75:120,90:135}},
  "2/0":{copper:{60:145,75:175,90:195}, aluminum:{60:115,75:135,90:150}},
  "3/0":{copper:{60:165,75:200,90:225}, aluminum:{60:130,75:155,90:175}},
  "4/0":{copper:{60:195,75:230,90:260}, aluminum:{60:150,75:180,90:205}},
  "250":{copper:{60:215,75:255,90:290}, aluminum:{60:170,75:205,90:230}},
  "300":{copper:{60:240,75:285,90:320}, aluminum:{60:190,75:230,90:255}},
  "350":{copper:{60:260,75:310,90:350}, aluminum:{60:210,75:250,90:280}},
  "400":{copper:{60:280,75:335,90:380}, aluminum:{60:225,75:270,90:305}},
  "500":{copper:{60:320,75:380,90:430}, aluminum:{60:260,75:310,90:350}},
  "600":{copper:{60:355,75:420,90:475}, aluminum:{60:285,75:340,90:385}},
  "700":{copper:{60:385,75:460,90:520}, aluminum:{60:315,75:375,90:425}},
  "750":{copper:{60:400,75:475,90:535}, aluminum:{60:320,75:385,90:445}},
  "800":{copper:{60:410,75:490,90:555}, aluminum:{60:330,75:400,90:455}},
  "900":{copper:{60:435,75:520,90:585}, aluminum:{60:355,75:420,90:480}},
  "1000":{copper:{60:455,75:545,90:615}, aluminum:{60:375,75:445,90:500}}
};

function ambientCorrection(ratingC, ambientC){
  // Approximate factors for 30C base. (NEC Table 310.15(B)(1))
  const tbl = {
    60:  {30:1.00, 35:0.94, 40:0.87, 45:0.79, 50:0.71},
    75:  {30:1.00, 35:0.94, 40:0.88, 45:0.82, 50:0.75, 55:0.67, 60:0.58},
    90:  {30:1.00, 35:0.96, 40:0.91, 45:0.87, 50:0.82, 55:0.76, 60:0.71}
  };
  const keys = Object.keys(tbl[ratingC]).map(Number).sort((a,b)=>a-b);
  let factor = 1.0;
  for (let i=0;i<keys.length;i++){
    if (ambientC <= keys[i]) { factor = tbl[ratingC][keys[i]]; break; }
    factor = tbl[ratingC][keys[i]];
  }
  return factor;
}

function adjustmentForCCC(ccc){
  if (ccc <= 3) return 1.00;
  if (ccc <= 6) return 0.80;
  if (ccc <= 9) return 0.70;
  if (ccc <= 20) return 0.50;
  if (ccc <= 30) return 0.45;
  return 0.40;
}

function calcWireSizing(){
  const I = parseFloat(document.getElementById('ws_current').value);
  const material = document.getElementById('ws_material').value;
  const rating = parseInt(document.getElementById('ws_rating').value,10);
  const ambient = parseFloat(document.getElementById('ws_ambient').value);
  const ccc = parseInt(document.getElementById('ws_ccc').value,10);

  const corr = ambientCorrection(rating, ambient);
  const adj = adjustmentForCCC(ccc);
  const required = I / (corr * adj);

  let chosen = null;
  for (const size of Object.keys(AMPACITY_TABLE)){
    const ampacity = AMPACITY_TABLE[size][material][rating];
    if (ampacity >= required) { chosen = {size, ampacity}; break; }
  }

  const res = document.getElementById('ws_result');
  if (!chosen){
    res.innerHTML = `<b>No single conductor size found</b> in table for required derated ampacity of ${required.toFixed(1)} A.`;
    return;
  }
  res.innerHTML = `
    <div><b>Required derated ampacity:</b> ${required.toFixed(1)} A</div>
    <div><b>Ambient factor:</b> ${corr.toFixed(2)}; <b>Bundling factor:</b> ${adj.toFixed(2)}</div>
    <div><b>Selected:</b> ${chosen.size} AWG/kcmil (${material}, ${rating}°C) — ampacity ${chosen.ampacity} A</div>
    <div class="tiny subtle">Tip: If terminations are rated 75°C, base ampacity must be taken from 75°C column per NEC. Always check conditions of use.</div>
  `;
}

document.getElementById('ws_calc')?.addEventListener('click', calcWireSizing);
