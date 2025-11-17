// -- main elements
const nyan = document.getElementById('nyan');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

// menu toggle (3-dots)
menuToggle.addEventListener('click', () => {
  if(mainNav.style.display === 'flex') { mainNav.style.display = 'none'; }
  else { mainNav.style.display = 'flex'; mainNav.style.flexDirection = 'column'; mainNav.style.gap = '8px'; mainNav.style.position='absolute'; mainNav.style.right='18px'; mainNav.style.top='60px'; mainNav.style.background='rgba(15,7,32,0.9)'; mainNav.style.padding='8px'; mainNav.style.borderRadius='10px'; }
});

// -- floating + idle + tap animation
let follow = true;
let idleTimer = null;
let busy = false;

function updateNyan(){
  if(!follow) return;
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? scrollY / docHeight : 0;
  const bottom = 120 - p * 50;
  const right = 22 + p * 60;
  nyan.style.bottom = Math.max(48, bottom) + 'px';
  nyan.style.right = right + 'px';
}
function loop(){ updateNyan(); requestAnimationFrame(loop); }
loop();

// idle detection -> star shower
function resetIdle(){
  if(idleTimer) clearTimeout(idleTimer);
  if(busy) return;
  idleTimer = setTimeout(()=> {
    busy = true;
    // small explode animation then star shower for 10s
    nyan.style.transform = 'scale(1.4) rotate(20deg)';
    setTimeout(()=>{ nyan.style.transform = ''; createStars(10000); }, 600);
    setTimeout(()=>{ busy = false; }, 10600);
  }, 5000);
}
window.addEventListener('scroll', ()=>{ resetIdle(); follow = true; }, {passive:true});
resetIdle();

// helper random
function randomBetween(a,b){ return a + Math.random() * (b - a); }

// global star shower (duration ms)
function createStars(duration){
  const count = Math.min(100, Math.floor(window.innerWidth / 8));
  const created = [];
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = randomBetween(6,16);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = randomBetween(0, window.innerWidth) + 'px';
    s.style.top = (-randomBetween(0, window.innerHeight * 0.2)) + 'px';
    const colors = ['#ffd966','#ff78b6','#ffb886','#c0a0ff','#ff6a00'];
    s.style.background = colors[Math.floor(Math.random()*colors.length)];
    s.style.opacity = '1';
    s.style.position = 'fixed';
    s.style.borderRadius = '50%';
    s.style.zIndex = 110;
    s.style.pointerEvents = 'none';
    s.style.animation = `fall ${randomBetween(1.6,3.2)}s linear forwards`;
    document.body.appendChild(s);
    created.push(s);
  }
  setTimeout(()=>{ created.forEach(x=>x.remove()); }, duration + 1200);
}

// Tap sequence (CSS-only effects + generated DOM overlays)
// Sequence: Stage1 (lose control, 3s) -> Stage2 (angry shouting, 6s) -> Stage3 (smile + 10s star shower)
nyan.addEventListener('click', async () => {
  if(busy) return;
  busy = true;
  follow = false; // pause following while animating

  // STAGE 1: Lose control (3s) -> dizzy stars over head
  nyan.classList.add('wiggle');
  // create rotating dizzy stars above head
  const rect = nyan.getBoundingClientRect();
  const dizzyStars = [];
  for(let i=0;i<4;i++){
    const s = document.createElement('div');
    s.className = 'star';
    s.style.width = '10px';
    s.style.height = '10px';
    s.style.left = (rect.left + rect.width/2) + 'px';
    s.style.top = (rect.top - 12) + 'px';
    s.style.background = ['#ffd966','#ff78b6','#c0a0ff'][i%3];
    s.style.zIndex = 140;
    document.body.appendChild(s);
    dizzyStars.push(s);
  }
  // spin dizzy stars
  let angle = 0;
  const spin = setInterval(()=>{
    angle += 18;
    dizzyStars.forEach((el,i)=>{
      const rad = (angle + i*90) * Math.PI/180;
      el.style.left = (rect.left + rect.width/2 + 20 * Math.cos(rad)) + 'px';
      el.style.top  = (rect.top - 14 + 12 * Math.sin(rad)) + 'px';
    });
  }, 60);

  await new Promise(r => setTimeout(r, 3000)); // 3s
  clearInterval(spin);
  dizzyStars.forEach(s => s.remove());
  nyan.classList.remove('wiggle');

  // STAGE 2: Angry shouting (6s)
  nyan.classList.add('angry', 'shake');
  // angry bubble near cat
  const bubble = document.createElement('div');
  bubble.className = 'angry-bubble';
  bubble.textContent = 'ARGH!!!';
  bubble.style.left = (rect.left + rect.width/2 + 10) + 'px';
  bubble.style.top  = (rect.top - 20) + 'px';
  document.body.appendChild(bubble);
  setTimeout(()=> bubble.classList.add('show'), 20);

  // also create quick repeating small flashes near cat
  let flashCount = 0;
  const flashInterval = setInterval(()=>{
    nyan.style.boxShadow = '0 0 30px rgba(255,40,40,0.35)';
    setTimeout(()=> nyan.style.boxShadow = '', 200);
    flashCount++;
    if(flashCount>8) clearInterval(flashInterval);
  }, 700);

  await new Promise(r => setTimeout(r, 6000)); // 6s
  bubble.classList.remove('show');
  setTimeout(()=> bubble.remove(), 200);
  nyan.classList.remove('shake','angry');

  // STAGE 3: Smile + 10s star shower
  // show smile overlay
  const smile = document.createElement('div');
  smile.className = 'smile-overlay';
  smile.textContent = '😊';
  smile.style.left = (rect.left + rect.width/2 + 6) + 'px';
  smile.style.top  = (rect.top - 18) + 'px';
  document.body.appendChild(smile);
  setTimeout(()=> smile.classList.add('show'), 20);

  // big star shower 10s
  createStars(10000);

  await new Promise(r => setTimeout(r, 10000)); // 10s

  smile.classList.remove('show');
  setTimeout(()=> smile.remove(), 300);
  follow = true;
  busy = false;
});

// ensure menu hides on resize larger screens
window.addEventListener('resize', ()=> {
  if(window.innerWidth > 900){
    mainNav.style.display = 'flex';
    mainNav.style.position = 'static';
    mainNav.style.flexDirection = 'row';
  } else {
    mainNav.style.display = 'none';
  }
});
