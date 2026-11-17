const $ = (id) => document.getElementById(id);
const distance = $('distance'), angle = $('angle'), count = $('count');
const fmt = (value, digits=2) => new Intl.NumberFormat('es-CL',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value);

function renderDiagram(n, d, theta, spacing) {
  const svg = $('diagram');
  const W=760,H=470, center=380, listenY=405, speakerY=115;
  const maxSpan=620, span=Math.min(maxSpan, Math.max(0,(n-1)*spacing*48));
  const left=center-span/2, right=center+span/2;
  const pts=[];
  for(let i=0;i<n;i++) pts.push(n===1?center:left+(span*i/(n-1)));
  const half=Math.min(88,theta/2);
  let shapes='';
  // Fan-like coverage sectors are schematic only; all speakers point to the common listening line.
  pts.forEach((x,i)=>{
    const dx=x-center, dy=listenY-speakerY;
    const angleToListener=Math.atan2(dx,dy);
    const a1=angleToListener-half*Math.PI/180, a2=angleToListener+half*Math.PI/180;
    const len=310;
    const x1=x+Math.sin(a1)*len, y1=speakerY+Math.cos(a1)*len;
    const x2=x+Math.sin(a2)*len, y2=speakerY+Math.cos(a2)*len;
    shapes+=`<path d="M ${x} ${speakerY} L ${x1} ${y1} Q ${x} ${speakerY+len*.86} ${x2} ${y2} Z" fill="#3b8ed0" fill-opacity=".10" stroke="#438fce" stroke-opacity=".28" stroke-width="1.2"/>`;
    shapes+=`<g transform="translate(${x-13},${speakerY-13})"><rect width="26" height="27" rx="5" fill="#263c54" stroke="#70baff" stroke-width="1.5"/><circle cx="13" cy="13.5" r="7" fill="#0b1724" stroke="#80c4ff" stroke-width="1.5"/><circle cx="13" cy="13.5" r="2.5" fill="#579dd5"/></g>`;
    shapes+=`<text x="${x}" y="${speakerY-24}" text-anchor="middle" fill="#b9dfff" font-size="11">${i+1}</text>`;
  });
  const lineY=listenY-25;
  const dimension = n>1 ? `<line x1="${left}" y1="${lineY}" x2="${right}" y2="${lineY}" stroke="#8eb9df" stroke-width="1.5"/><line x1="${left}" y1="${lineY-7}" x2="${left}" y2="${lineY+7}" stroke="#8eb9df"/><line x1="${right}" y1="${lineY-7}" x2="${right}" y2="${lineY+7}" stroke="#8eb9df"/><text x="380" y="${lineY-10}" text-anchor="middle" fill="#c9def3" font-size="12">Separación total: ${fmt((n-1)*spacing)} m</text>` : `<text x="380" y="${lineY-10}" text-anchor="middle" fill="#c9def3" font-size="12">Un altavoz · sin separación entre extremos</text>`;
  svg.innerHTML=`<defs><radialGradient id="listenGlow"><stop stop-color="#55d69a" stop-opacity=".35"/><stop offset="1" stop-color="#55d69a" stop-opacity="0"/></radialGradient></defs>${shapes}${dimension}<line x1="380" y1="${speakerY+28}" x2="380" y2="${listenY-20}" stroke="#6e8ca9" stroke-dasharray="5 6" opacity=".7"/><circle cx="380" cy="${listenY}" r="42" fill="url(#listenGlow)"/><circle cx="380" cy="${listenY}" r="9" fill="#55d69a" stroke="#d5ffeb" stroke-width="2"/><text x="380" y="450" text-anchor="middle" fill="#9fdcc2" font-size="12">Punto de primera escucha · ${fmt(d)} m (referencia)</text>`;
}

function calculate(){
  const D=Number(distance.value), A=Number(angle.value), N=Number(count.value);
  const valid=distance.value.trim()!==''&&angle.value.trim()!==''&&count.value.trim()!==''&&Number.isFinite(D)&&Number.isFinite(A)&&Number.isInteger(N)&&D>0&&D<=1000&&A>0&&A<=180&&N>=1&&N<=64;
  $('validation').textContent=valid?'':'Ingresa una distancia > 0, un ángulo entre 0,1° y 180° y una cantidad entera entre 1 y 64.';
  if(!valid){['spacing','spacingCm','total','totalCm'].forEach(id=>$(id).textContent='—');$('speakerBadge').textContent='Revisar datos';$('diagram').innerHTML='';return null;}
  const S=2*D*Math.sin(A*Math.PI/360), T=(N-1)*S;
  $('spacing').textContent=fmt(S);$('spacingCm').textContent=`${fmt(S*100)} cm`;
  $('total').textContent=fmt(T);$('totalCm').textContent=`${fmt(T*100)} cm · ${N-1} ${N-1===1?'intervalo':'intervalos'}`;
  $('speakerBadge').textContent=`${N} ${N===1?'altavoz':'altavoces'}`;
  renderDiagram(N,D,A,S);
  return {distanceFirstListening_m:D,coverageAngle_deg:A,speakerCount:N,spacingBetweenAdjacentSpeakers_m:S,totalSpan_m:T,formula:'S = 2 × D × sin(θ / 2); total = (N - 1) × S'};
}
[distance,angle,count].forEach(el=>el.addEventListener('input',calculate));
$('minus').addEventListener('click',()=>{count.value=Math.max(1,Number(count.value||1)-1);calculate()});
$('plus').addEventListener('click',()=>{count.value=Math.min(64,Number(count.value||1)+1);calculate()});
document.querySelectorAll('[data-angle]').forEach(btn=>btn.addEventListener('click',()=>{angle.value=btn.dataset.angle;document.querySelectorAll('[data-angle]').forEach(b=>b.classList.toggle('selected',b===btn));calculate()}));
$('reset').addEventListener('click',()=>{distance.value='3';angle.value='90';count.value='2';document.querySelectorAll('[data-angle]').forEach(b=>b.classList.toggle('selected',b.dataset.angle==='90'));calculate()});
$('export').addEventListener('click',()=>{const data=calculate();if(!data)return;const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='speaker-system-configuracion.json';a.click();URL.revokeObjectURL(url)});
calculate();
