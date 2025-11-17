const nyan=document.getElementById('nyan');
let follow=true,lastScroll=Date.now(),idle=null,inShow=false;

function updateNyan(){
  if(!follow)return;
  const s=window.scrollY||window.pageYOffset,
        d=document.documentElement.scrollHeight-window.innerHeight,
        p=d>0?s/d:0;
  b=80-p*40;
  r=12+p*80;
  nyan.style.bottom=b+'px';
  nyan.style.right=r+'px';
}

function loop(){updateNyan();requestAnimationFrame(loop);}
loop();

function onScroll(){
  lastScroll=Date.now();
  if(inShow) return;
  if(idle) clearTimeout(idle);
  follow=true;
  idle=setTimeout(()=>{
    inShow=true;
    follow=false;
    nyan.classList.add('explode');
    setTimeout(()=>{nyan.classList.remove('explode');createStars(5000)},600);
    setTimeout(()=>{inShow=false;follow=true},5600);
  },5000);
}

window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

function randomBetween(a,b){return a+Math.random()*(b-a);}

function createStars(duration){
  const count=Math.min(80,Math.floor(window.innerWidth/8));
  const stars=[];
  for(let i=0;i<count;i++){
    const el=document.createElement('div');
    el.className='star';
    const size=randomBetween(6,14);
    el.style.width=size+'px';
    el.style.height=size+'px';
    el.style.left=randomBetween(0,window.innerWidth)+'px';
    el.style.top=(-randomBetween(0,window.innerHeight*0.2))+'px';
    const colors=['#ffd966','#ff78b6','#ffb886'];
    el.style.background=colors[Math.floor(Math.random()*colors.length)];
    el.style.opacity='1';
    el.style.borderRadius='50%';
    el.style.pointerEvents='none';
    el.style.zIndex=70;
    el.style.animation=`fall ${randomBetween(1.6,3.2)}s linear forwards`;
    document.body.appendChild(el);
    stars.push(el);
  }
  setTimeout(()=>{stars.forEach(s=>s.remove());},duration+1200);
}
