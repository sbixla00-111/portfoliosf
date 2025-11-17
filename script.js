// Floating cat behaviour + star shower + tap animation
const nyan = document.getElementById('nyan');

let follow = true;
let idleTimer = null;
let inAnimation = false;
let lastScroll = Date.now();

// update position based on scroll ratio (right side)
function updateNyan(){
  if(!follow) return;
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight > 0 ? scrollY / docHeight : 0;
  // bottom moves a bit, right shifts slightly with scroll
  const bottom = 120 - p * 50;   // base 120 -> moves up when scrolled
  const right = 22 + p * 60;     // base 22 -> moves a bit inward when scrolled
  nyan.style.bottom = Math.max(48, bottom) + 'px';
  nyan.style.right = right + 'px';
}

function loop(){
  updateNyan();
  requestAnimationFrame(loop);
}
loop();

// Idle detection: if user stops scrolling for 5s -> explode + star shower
function resetIdleTimer(){
  if(idleTimer) clearTimeout(idleTimer);
  if(inAnimation) return;
  idleTimer = setTimeout(()=>{
    // trigger explosion & star shower
    inAnimation = true;
    nyan.classList.add('explode');
    // small visual scale/rotate
    nyan.style.transform = 'scale(1.4) rotate(20deg)';
    setTimeout(()=> {
      nyan.style.transform = '';
      nyan.classList.remove('explode');
      createStars(10000); // 10s stars
      setTimeout(()=> { inAnimation = false; }, 10600);
    }, 600);
  }, 5000);
}

// on scroll, reset idle timer and allow follow
window.addEventListener('scroll', (e)=>{
  lastScroll = Date.now();
  if(inAnimation) return;
  follow = true;
  resetIdleTimer();
}, {passive:true});
resetIdleTimer();

// helper
function randomBetween(a,b){ return a + Math.random() * (b - a); }

// create star shower
function createStars(duration){
  const count = Math.min(100, Math.floor(window.innerWidth / 8));
  const created = [];
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = randomBetween(6,16);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = (randomBetween(0, window.innerWidth)) + 'px';
    s.style.top = (-randomBetween(0, window.innerHeight * 0.2)) + 'px';
    const colors = ['#ffd966','#ff78b6','#ffb886','#c0a0ff','#ff6a00'];
    s.style.background = colors[Math.floor(Math.random()*colors.length)];
    s.style.opacity = '1';
    s.style.borderRadius = '50%';
    s.style.position = 'fixed';
    s.style.zIndex = 95;
    s.style.pointerEvents = 'none';
    s.style.animation = `fall ${randomBetween(1.6,3.2)}s linear forwards`;
    document.body.appendChild(s);
    created.push(s);
  }
  setTimeout(()=>{ created.forEach(x=>x.remove()); }, duration + 1200);
}

// Tap interaction: wiggle -> dizzy -> tears
nyan.addEventListener('click', () => {
  if(inAnimation) return;
  inAnimation = true;
  // wiggle
  nyan.classList.add('wiggle');
  setTimeout(()=>{
    nyan.classList.remove('wiggle');
    // dizzy state
    nyan.classList.add('dizzy');
    // create tears
    createTears(5);
    // create small local stars around head while dizzy
    createLocalDizzyStars();
    setTimeout(()=>{
      nyan.classList.remove('dizzy');
      inAnimation = false;
    }, 2200);
  }, 1500);
});

function createTears(count){
  const rect = nyan.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const t = document.createElement('div');
    t.className = 'tears';
    // randomize starting position near eyes area
    const startX = rect.left + rect.width * 0.45 + randomBetween(-6, 12);
    const startY = rect.top + rect.height * 0.55 + randomBetween(-4, 6);
    t.style.left = startX + 'px';
    t.style.top = startY + 'px';
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 1000);
  }
}

// small spinning stars above the cat during dizzy
function createLocalDizzyStars(){
  const rect = nyan.getBoundingClientRect();
  const stars = [];
  for(let i=0;i<4;i++){
    const s = document.createElement('div');
    s.className = 'star';
    s.style.width = '8px';
    s.style.height = '8px';
    s.style.left = (rect.left + rect.width/2) + 'px';
    s.style.top = (rect.top - 8) + 'px';
    s.style.background = '#ffd966';
    s.style.zIndex = 130;
    document.body.appendChild(s);
    stars.push(s);
  }
  // spin them for 2s
  let angle = 0;
  const spin = setInterval(()=>{
    angle += 18;
    stars.forEach((el,i)=>{
      const rad = (angle + i*90) * Math.PI/180;
      el.style.left = (rect.left + rect.width/2 + 22 * Math.cos(rad)) + 'px';
      el.style.top  = (rect.top - 8 + 12 * Math.sin(rad)) + 'px';
    });
  }, 60);
  setTimeout(()=>{
    clearInterval(spin);
    stars.forEach(s=>s.remove());
  }, 2000);
}
