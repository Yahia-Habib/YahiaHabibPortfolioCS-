
const cursor=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.transform=`translate(${mx-6}px,${my-6}px)`;});
function animateRing(){rx+=(mx-rx-18)*.15;ry+=(my-ry-18)*.15;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(animateRing);}
animateRing();
document.querySelectorAll('a,button,.project-card,.blog-card,.yt-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='50px';ring.style.height='50px';});
  el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px';});
});

// Reveal
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible');}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(r=>ro.observe(r));

// Skill bars
const barObs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.querySelectorAll('.skill-bar-fill').forEach(b=>b.style.width=b.dataset.width+'%');}),{threshold:.3});
document.querySelectorAll('.skill-card').forEach(c=>barObs.observe(c));

// Counters
const countObs=new IntersectionObserver(e=>e.forEach(x=>{
  if(x.isIntersecting){
    const t=parseInt(x.target.dataset.count);let c=0;
    const s=Math.ceil(t/40);
    const i=setInterval(()=>{c=Math.min(c+s,t);x.target.textContent=c+(t>=10?'+':'');if(c>=t)clearInterval(i);},40);
    countObs.unobserve(x.target);
  }
}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

// Alert feed
const alerts=[
  {sev:'Critical',msg:' SOC342 - CVE‑2025‑53770 — SharePoint ToolShell Auth Bypass and RCE'},
  {sev:'high',msg:'Suspicious PowerShell execution from Outlook.exe on SRV-DC01'},
  {sev:'medium',msg:'Suspicious Powershell Script Executed - on payload_1.ps1'},
  {sev:'low',msg:'Failed login attempts: 23 in 5 minutes from 192.168.10.44'},
  {sev:'high',msg:'New Scheduled Task created: svchost_upd.exe — possible persistence'},
  {sev:'critical',msg:'Ransomware file extension pattern detected on FILE-SRV-01'},
  {sev:'medium',msg:'DNS query to DGA domain: xf7k2m.xyz from 10.0.1.88'},
  {sev:'high',msg:'Lateral movement via SMB detected: ADMIN$ share access from WS-009'},
];
const feed=document.getElementById('alertFeed');let ai=0;
function addAlert(){
  const a=alerts[ai++%alerts.length];
  const now=new Date();
  const t=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0')+':'+now.getSeconds().toString().padStart(2,'0');
  const el=document.createElement('div');el.className='feed-item';
  el.innerHTML=`<span class="feed-sev sev-${a.sev}">${a.sev.toUpperCase()}</span><span class="feed-text">${a.msg}</span><span class="feed-time">${t}</span>`;
  feed.insertBefore(el,feed.firstChild);
  if(feed.children.length>8)feed.removeChild(feed.lastChild);
}
addAlert();setInterval(addAlert,3500);

// Radar
function drawRadar(){
  const c=document.getElementById('radar'),ctx=c.getContext('2d');
  const cx=c.width/2,cy=c.height/2,r=110;
  const labels=['SIEM','Forensics','Threat Hunt','Network','Malware','CTI'];
  const vals=[.92,.80,.88,.82,.75,.85];const n=labels.length;
  ctx.clearRect(0,0,c.width,c.height);
  for(let i=1;i<=4;i++){
    ctx.beginPath();
    for(let j=0;j<n;j++){const a=(Math.PI*2*j)/n-Math.PI/2;const x=cx+(r*i/4)*Math.cos(a);const y=cy+(r*i/4)*Math.sin(a);j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.closePath();ctx.strokeStyle='rgba(0,71,255,.15)';ctx.lineWidth=1;ctx.stroke();
  }
  for(let j=0;j<n;j++){const a=(Math.PI*2*j)/n-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));ctx.strokeStyle='rgba(0,71,255,.2)';ctx.stroke();}
  ctx.beginPath();
  for(let j=0;j<n;j++){const a=(Math.PI*2*j)/n-Math.PI/2;const x=cx+r*vals[j]*Math.cos(a);const y=cy+r*vals[j]*Math.sin(a);j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
  ctx.closePath();ctx.fillStyle='rgba(0,71,255,.15)';ctx.fill();ctx.strokeStyle='#00b4ff';ctx.lineWidth=2;ctx.stroke();
  for(let j=0;j<n;j++){const a=(Math.PI*2*j)/n-Math.PI/2;const x=cx+r*vals[j]*Math.cos(a);const y=cy+r*vals[j]*Math.sin(a);ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='#00ffe0';ctx.fill();}
  ctx.font='600 11px Rajdhani,sans-serif';ctx.textAlign='center';
  for(let j=0;j<n;j++){const a=(Math.PI*2*j)/n-Math.PI/2;ctx.fillStyle='#4a7fa5';ctx.fillText(labels[j],cx+(r+22)*Math.cos(a),cy+(r+22)*Math.sin(a)+4);}
}
new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)drawRadar();}),{threshold:.3}).observe(document.getElementById('radar'));

// Contact form
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();const m=document.getElementById('formMsg');m.style.display='block';e.target.reset();setTimeout(()=>m.style.display='none',5000);
});
// CV Download tracking
const CV_FILE = 'yahia habib.pdf';
let cvDownloadCount = parseInt(localStorage.getItem('cv_dl_count') || '0');
document.getElementById('cv-dl-count').textContent = cvDownloadCount;

function handleCVDownload() {
  const name    = document.getElementById('cv-name').value.trim();
  const email   = document.getElementById('cv-email').value.trim();
  const company = document.getElementById('cv-company').value.trim();
  const btn     = document.getElementById('cv-dl-btn');

  if (!name && !email) {
    document.getElementById('cv-name').style.borderColor = '#ff003c';
    document.getElementById('cv-email').style.borderColor = '#ff003c';
    setTimeout(() => {
      document.getElementById('cv-name').style.borderColor = '';
      document.getElementById('cv-email').style.borderColor = '';
    }, 1800);
    btn.textContent = '⚠ Please fill in at least one field';
    setTimeout(() => { btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Download CV — PDF'; }, 2000);
    return;
  }

  const entry = {
    name: name || '(not provided)',
    email: email || '(not provided)',
    company: company || '(not provided)',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent.substring(0, 80)
  };

  const logs = JSON.parse(localStorage.getItem('cv_download_log') || '[]');
  logs.push(entry);
  localStorage.setItem('cv_download_log', JSON.stringify(logs));

  cvDownloadCount++;
  localStorage.setItem('cv_dl_count', cvDownloadCount);
  document.getElementById('cv-dl-count').textContent = cvDownloadCount;

  console.table(entry);
  console.log('%c[CV Download Log]', 'color:#00b4ff;font-weight:bold', entry);

  
  btn.disabled = true;
  btn.innerHTML = '⏳ Preparing download...';

  setTimeout(() => {
    const link = document.createElement('a');
    link.href = CV_FILE; 
    link.download = 'yahia habib.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    document.getElementById('cv-dl-success').style.display = 'block';
    btn.innerHTML = '✓ Downloaded!';
    btn.style.background = '#00803a';

    setTimeout(() => {
      btn.disabled = false;
      btn.style.background = '';
      btn.innerHTML = '<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> Download CV — PDF';
      document.getElementById('cv-dl-success').style.display = 'none';
    }, 5000);
  }, 600);
}

['cv-name','cv-email','cv-company'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') handleCVDownload();
  });
});
function closeModal(id){document.getElementById(id).classList.remove('open');}