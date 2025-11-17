const cat = document.getElementById("floating-character");

let follow = true, lastScroll = Date.now(), idle = null, inShow = false;

function updateCat(){
  if(!follow) return;
  const s = window.scrollY || window.pageYOffset;
  const d = document.documentElement.scrollHeight-window.innerHeight;
  const p = d>0?s/d:0;
  const b = 30 + p*40;
  const r = 30 + p*40;
  cat.style.bottom = b + 'px';
  cat.style.right = r + 'px';
}

function loop(){updateCat();requestAnimationFrame(loop);}
loop();

function randomBetween(a,b){return a+Math.random()*(b-a);}

// click animations: dizzy → angry → smile → star shower
cat.addEventListener("click", ()=>{
    follow=false;
    cat.style.transform="rotate(-20deg) translateY(-10px)";
    setTimeout(()=>{cat.style.transform="rotate(15deg) translateY(-15px)";},3000); // dizzy
    setTimeout(()=>{cat.style.transform="rotate(-10deg) translateY(0px)";},9000); // angry
    setTimeout(()=>{
        cat.style.transform="rotate(0deg) translateY(0px)"; // smile
        createStars(10000);
        follow=true;
    },15000);
});

function createStars(duration){
    const count=Math.min(80,Math.floor(window.innerWidth/8));
    const stars=[];
    for(let i=0;i<count;i++){
        const el=document.createElement('div');
        el.style.position="fixed";
        el.style.width="8px";
        el.style.height="8px";
        el.style.borderRadius="50%";
        el.style.left=randomBetween(0,window.innerWidth)+"px";
        el.style.top=randomBetween(0,window.innerHeight/2)+"px";
        el.style.background=["#ffd966","#ff78b6","#ffb886"][Math.floor(Math.random()*3)];
        el.style.opacity="1";
        el.style.pointerEvents="none";
        el.style.zIndex="70";
        el.style.animation=`fall ${randomBetween(1.6,3.2)}s linear forwards`;
        document.body.appendChild(el);
        stars.push(el);
    }
    setTimeout(()=>{stars.forEach(s=>s.remove());},duration+1200);
}

const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes fall{
  from{transform:translateY(0) scale(1);opacity:1}
  to{transform:translateY(120vh) scale(0.3);opacity:0}
}`;
document.head.appendChild(styleSheet);
