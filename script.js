const nyan = document.getElementById('nyan');
let follow = true;
let inAnimation = false;
let idleTimer = null;

// Floating cat movement
function updateNyan(){
  if(!follow) return;
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const p = docHeight>0 ? scrollY/docHeight : 0;
  nyan.style.bottom = Math.max(48,120 - p*50) + 'px';
  nyan.style.right = (22 + p*60) + 'px';
}
function loop(){ updateNyan(); requestAnimationFrame(loop); }
loop();

// Helper
function randomBetween(a,b){ return a + Math.random()*(b-a); }

// Idle star shower (5s no scroll)
function resetIdleTimer(){
  if(idleTimer) clearTimeout(idleTimer);
  if(inAnimation) return;
  idleTimer = setTimeout(()=>{
    inAnimation=true;
    createStars(10000);
    setTimeout(()=> inAnimation=false,10000);
  },5000);
}
window.addEventListener('scroll',()=>{ follow=true; resetIdleTimer(); }, {passive:true});
resetIdleTimer();

// Stars
function createStars(duration){
  const count = Math.min(100,Math.floor(window.innerWidth/8));
  const stars = [];
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className='star';
    const size=randomBetween(6,16);
    s.style.width=s.style.height=size+'px';
    s.style.left=randomBetween(0,window.innerWidth)+'px';
    s.style.top=-randomBetween(0,window.innerHeight*0.2)+'px';
    const colors=['#ffd966','#ff78b6','#ffb886','#c0a0ff','#ff6a00'];
    s.style.background=colors[Math.floor(Math.random()*colors.length)];
    s.style.position='fixed';
    s.style.borderRadius='50%';
    s.style.zIndex=95;
    s.style.pointerEvents='none';
    s.style.animation = `fall ${randomBetween(1.6,3.2)}s linear forwards`;
    document.body.appendChild(s);
    stars.push(s);
  }
  setTimeout(()=>stars.forEach(s=>s.remove()),duration+1200);
}

// Tears
function createTears(count){
  const rect=nyan.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const t=document.createElement('div');
    t.className='tears';
    t.style.left=rect.left + rect.width*0.45 + randomBetween(-6,12)+'px';
    t.style.top=rect.top + rect.height*0.55 + randomBetween(-4,6)+'px';
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),1000);
  }
}

// Tap sequence: dizzy 3s -> angry 6s -> default
nyan.addEventListener('click',()=>{
  if(inAnimation) return;
  inAnimation=true;

  // 1. Small shake (lose control)
  nyan.style.transform='rotate(-12deg) translateX(-6px)';
  setTimeout(()=>{
    nyan.style.transform='';

    // 2. Dizzy
    nyan.src='images/dizzy.gif';
    createTears(5);
    createStars(500);

    setTimeout(()=>{
      // 3. Angry
      nyan.src='images/angry.gif';
      createTears(8);
      createStars(800);

      setTimeout(()=>{
        // 4. Back to default
        nyan.src='images/pixel_safa_cat.gif';
        inAnimation=false;
      },6000);

    },3000);

  },500);
});
