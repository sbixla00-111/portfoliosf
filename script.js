const cat = document.getElementById("floating-character");

// soft floating animation
let floatY = 0, direction = 1;
function floatLoop(){
    floatY += 0.2 * direction;
    if(floatY > 8 || floatY < -8) direction*=-1;
    cat.style.transform = `translateY(${floatY}px)`;
    requestAnimationFrame(floatLoop);
}
floatLoop();

// Click animations: Dizzy → Angry → Smile → Star Shower
cat.addEventListener("click", ()=>{
    cat.style.transition="transform 0.2s";
    cat.style.transform="translateY(0) rotate(-20deg)"; // lose control
    setTimeout(()=>{
        cat.style.transform="translateY(-10px) rotate(20deg)"; // dizzy
    },3000);
    setTimeout(()=>{
        cat.style.transform="translateY(0) rotate(0deg)"; // angry
        // can add angry visual here
    },9000);
    setTimeout(()=>{
        cat.style.transform="translateY(0) rotate(0deg)"; // smile
        createStars(10000);
    },15000);
});

function randomBetween(a,b){return a+Math.random()*(b-a);}
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

// CSS keyframes for stars
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes fall{
  from{transform:translateY(0) scale(1);opacity:1}
  to{transform:translateY(120vh) scale(0.3);opacity:0}
}`;
document.head.appendChild(styleSheet);
