/* Version 2 fixed script:
   - tab navigation (modern top bar)
   - mobile 3-dots toggle
   - floating cat follows scroll
   - idle star shower (10s)
   - tap sequence: lose-control (3s) -> angry shout (6s) -> smile + 10s star shower
*/

const nyan = document.getElementById('nyan');
const tabs = document.querySelectorAll('.top-nav .tab');
const menuBtn = document.getElementById('menuBtn');
const topNav = document.getElementById('topNav');

let follow = true, busy = false, idleTimer = null;

// NAV / Tabs functionality
tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    const target = document.querySelector(tab.dataset.target || tab.getAttribute('data-target') || tab.getAttribute('data-target'));
    if(!target) return;
    // scroll to section smoothly and highlight active tab
    target.scrollIntoView({behavior:'smooth', block:'start'});
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// mobile menu toggle (3 dots)
menuBtn.addEventListener('click', () => {
  if(topNav.style.display === 'flex') {
    topNav.style.display = 'none';
  } else {
    topNav.style.display = 'flex';
    topNav.style.flexDirection = 'column';
    topNav.style.position = 'absolute';
    topNav.style.right = '18px';
    topNav.style.top = '62px';
    topNav.style.background = 'rgba(10,6,18,0.95)';
    topNav.style.padding = '10px';
    topNav.style.borderRadius = '10px';
    topNav.style.gap = '8px';
    topNav.style.zIndex = '200';
  }
});

// ensure nav hides on resize larger screens
window.addEventListener('resize', () => {
  if(window.innerWidth > 920) {
    topNav.style.display = 'flex';
    topNav.style.position = 'static';
    topNav.style.flexDirection = 'row';
    topNav.style.background = 'transparent';
    topNav.style.padding = '';
  } else {
    topNav.style.display = 'none';
  }
});
if(window.innerWidth > 920) topNav.style.display = 'flex'; else topNav.style.display = 'none';

// update nyan position to follow scroll
function updateNyan(){
  if(!follow || busy) return;
  const scrollY = window.scrollY || window.pageYOffset;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const p = docH > 0 ? scrollY / docH : 0;
  const bottom = 140 - p * 60;   // base bottom
  const right = 28 + p * 60;     // base right
  nyan.style.bottom = Math.max(40, bottom) + 'px';
  nyan.style.right = right + 'px';
}
function animateLoop(){ updateNyan(); requestAnimationFrame(animateLoop); }
animateLoop();

// idle detection -> star shower after 5s without scroll or interaction
function resetIdleTimer(){
  if(idleTimer) clearTimeout(idleTimer);
  if(busy) return;
  idleTimer = setTimeout(()=>{
    busy = true;
    // small explode effect
    nyan.style.transform = 'scale(1.4) rotate(18deg)';
    setTimeout(()=> {
      nyan.style.transform = '';
      createStars(10000); // 10s star shower
      // end after duration
      setTimeout(()=> { busy = false; }, 10600);
    }, 600);
  }, 5000);
}
window.addEventListener('scroll', () => { resetIdleTimer(); }, {passive:true});
resetIdleTimer();

// utility
function randomBetween(a,b){ return a + Math.random() * (b - a); }

// global star shower generation
function createStars(duration){
  const count = Math.min(120, Math.floor(window.innerWidth / 7));
  const created = [];
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = randomBetween(6,18);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = randomBetween(0, window.innerWidth) + 'px';
    s.style.top = (-randomBetween(0, window.innerHeight * 0.2)) + 'px';
    const colors = ['#ffd966','#ff78b6','#ffb886','#c0a0ff','#ff6a00'];
    s.style.background = colors[Math.floor(Math.random()*colors.length)];
    s.style.opacity = '1';
    s.style.position = 'fixed';
    s.style.borderRadius = '50%';
    s.style.zIndex = 130;
    s.style.pointerEvents = 'none';
    s.style.animation = `fall ${randomBetween(1.6,3.2)}s linear forwards`;
    document.body.appendChild(s);
    created.push(s);
  }
  setTimeout(()=> created.forEach(x=>x.remove()), duration + 1200);
}

// TAP sequence: Stage1 lose-control (3s) -> Stage2 angry shout (6s) -> Stage3 smile + 10s star shower
nyan.addEventListener('click', async () => {
  if(busy) return;
  busy = true;
  follow = false;

  // STAGE 1: lose control (3s) -> wiggle + dizzy stars
  nyan.classList.add('wiggle');
  const rect = nyan.getBoundingClientRect();
  const dizzy = [];
  for(let i=0;i<4;i++){
    const d = document.createElement('div');
    d.className = 'star';
    d.style.width = '10px';
    d.style.height = '10px';
    d.style.left = (rect.left + rect.width/2) + 'px';
    d.style.top = (rect.top - 10) + 'px';
    d.style.background = ['#ffd966','#ff78b6','#c0a0ff'][i%3];
    d.style.zIndex = 160;
    document.body.appendChild(d);
    dizzy.push(d);
  }
  let ang = 0;
  const spin = setInterval(()=>{
    ang += 20;
    dizzy.forEach((el,i)=>{
      const rad = (ang + i*90) * Math.PI/180;
      el.style.left = (rect.left + rect.width/2 + 22 * Math.cos(rad)) + 'px';
      el.style.top  = (rect.top - 14 + 14 * Math.sin(rad)) + 'px';
    });
  }, 60);

  await new Promise(r => setTimeout(r, 3000));
  clearInterval(spin);
  dizzy.forEach(x=>x.remove());
  nyan.classList.remove('wiggle');

  // STAGE 2: angry shouting (6s)
  nyan.classList.add('angry','shake');
  // angry bubble
  const bubble = document.createElement('div');
  bubble.className = 'angry-bubble';
  bubble.textContent = 'ARGH!!!';
  bubble.style.left = (rect.left + rect.width*0.5 + 10) + 'px';
  bubble.style.top  = (rect.top - 28) + 'px';
  document.body.appendChild(bubble);
  setTimeout(()=> bubble.classList.add('show'), 20);

  // flashing red effect few times while angry
  let flashes = 0;
  const flashInt = setInterval(()=> {
    nyan.style.boxShadow = '0 0 28px rgba(255,30,30,0.35)';
    setTimeout(()=> nyan.style.boxShadow = '', 180);
    flashes++;
    if(flashes > 10) clearInterval(flashInt);
  }, 600);

  await new Promise(r => setTimeout(r, 6000));
  bubble.classList.remove('show');
  setTimeout(()=> bubble.remove(), 220);
  nyan.classList.remove('shake','angry');

  // STAGE 3: smile overlay + 10s star shower
  const smile = document.createElement('div');
  smile.className = 'smile-overlay';
  smile.textContent = '😊';
  smile.style.left = (rect.left + rect.width*0.5 + 6) + 'px';
  smile.style.top  = (rect.top - 22) + 'px';
  document.body.appendChild(smile);
  setTimeout(()=> smile.classList.add('show'), 20);

  createStars(10000);
  await new Promise(r => setTimeout(r, 10000));

  smile.classList.remove('show');
  setTimeout(()=> smile.remove(), 200);

  follow = true;
  busy = false;
  resetIdleTimer();
});

// hide mobile nav if clicking outside
document.addEventListener('click', (e) => {
  if(window.innerWidth <= 920){
    if(!topNav.contains(e.target) && !menuBtn.contains(e.target)){
      topNav.style.display = 'none';
    }
  }
});
