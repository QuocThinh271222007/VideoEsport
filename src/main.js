import '@fontsource/barlow-condensed/700.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import './style.css';
import {film,scenes,audioConfig} from './config.js';
import {cuts} from './montage.js';
import {FootageLayer} from './footage.js';
import {FilmWorld,clamp,smooth} from './world.js';
const $=s=>document.querySelector(s),exportMode=new URLSearchParams(location.search).has('export');
document.body.classList.toggle('export',exportMode);
const footage=new FootageLayer();
const world=new FilmWorld();let playing=false,current=0,prev=0,previousScene=-1,envelope=[];
const music=new Audio(audioConfig.preview);music.preload='auto';
function dimensions(){const h=exportMode||document.fullscreenElement?innerHeight:innerHeight-100;return {w:Math.round(Math.min(innerWidth,h*16/9)),h:Math.round(Math.min(h,innerWidth*9/16))}}
function resize(){const {w,h}=dimensions();$('#film').style.transform=`scale(${w/1920})`;if(world.renderer)world.resize(w,h)}
window.addEventListener('resize',resize);document.addEventListener('fullscreenchange',resize);resize();
async function initialize(){
 await Promise.all([document.fonts.load('700 100px "Barlow Condensed"','ĐIỆN TỬ'),document.fonts.load('400 25px "Be Vietnam Pro"','ĐỒNG ĐỘI'),document.fonts.load('600 19px "Be Vietnam Pro"','ĐỒNG ĐỘI')]);await document.fonts.ready;
 const {w,h}=dimensions();await world.init($('#world'),w,h);await footage.init($('#cam'),scenes);
 const r=await fetch('/assets/audio/envelope.json');if(!r.ok)throw new Error('Chưa chuẩn bị nhạc. Chạy npm run audio.');envelope=(await r.json()).values;
 $('#brand').textContent=film.brand;$('#scrub').max=film.duration;$('#credit').textContent=audioConfig.credit;
 window.__film={ready:true,duration:film.duration,scenes:scenes.map(({start,end,kind})=>({start,end,kind})),seek:async t=>{const state=renderAt(t);await footage.seekExact();return state}};renderAt(0);if(!exportMode)requestAnimationFrame(tick);
}
const logos=[...document.querySelectorAll('#logos img')];let letters=[];
// Mọi hiệu ứng là hàm thuần của thời gian tuyệt đối nên tua/render lại không lệch.
function renderAt(seconds){
 current=clamp(seconds,0,film.duration);const index=scenes.findIndex(s=>current>=s.start&&current<s.end),n=index<0?scenes.length-1:index,base=scenes[n],local=current-base.start,duration=base.end-base.start;
 // Cảnh footage optional chưa có file sẽ tự dùng artwork dự phòng.
 const s=base.video&&!footage.has(base)?{...base,video:undefined}:base;
 if(n!==previousScene){
  previousScene=n;$('#film').dataset.kind=s.kind;$('#film').style.setProperty('--accent',s.color);$('#eyebrow').textContent=s.eyebrow||'';letters=[];
  $('#headline').replaceChildren(...(s.title||[]).map((t,i)=>{const line=document.createElement('div');line.className='ln'+((s.title||[]).length>1&&i===(s.title||[]).length-1?' acc':'');[...t].forEach(c=>{const span=document.createElement('span');span.className='ch';span.textContent=c===' '?' ':c;line.append(span);letters.push(span)});return line}));
  $('#words').replaceChildren(...(s.words||[]).map(w=>{const el=document.createElement('div');el.className='word';if(w.label){const sm=document.createElement('small');sm.textContent=w.label;el.append(sm)}const lines=w.text.split('/').map(t=>{const ln=document.createElement('div');ln.className='wl';ln.textContent=t;el.append(ln);return ln});const bar=document.createElement('i');el.append(bar);return {...w,el,lines,bar}}).map(w=>(w.el.__w=w,w.el)));
  $('#description').textContent=s.description||'';$('#tags').replaceChildren(...(s.tags||[]).map(t=>{const span=document.createElement('span');span.textContent=t;return span}));
 }
 footage.update(s,current,playing,exportMode);$('#film').classList.toggle('has-footage',!!s.video);
 const action=!!s.video;
 const state=world.draw(current,s,envelope[Math.min(envelope.length-1,Math.floor(current*60))]||0);$('#film').classList.toggle('action',action);$('#film').dataset.phase=state.phase;
 // Camera: đẩy vào chậm + nảy theo nhịp + cú đập khi vào cảnh, mờ/zoom nhẹ lúc rời cảnh (cắt nhanh kiểu trailer, không mờ dần).
 const enter=n?Math.exp(-local*7.5):0,leave=smooth((local-(duration-.2))/.2)*(n<scenes.length-1?1:0),drift=clamp(local/duration);
 // Mỗi cú cắt montage tạo một nhịp đập: zoom, sáng và rung ngắn.
 const lastCut=cuts.reduce((m,c)=>c<=current?c:m,-9),punch=s.video?Math.exp(-(current-lastCut)*11):0;
 const zoom=1+.045*drift+state.pulse*.016+enter*.1+leave*.07+state.impact*.03+punch*.045,roll=Math.sin(current*.45)*.22+state.impact*Math.sin(current*90)*.35;
 const shx=Math.sin(current*61)*(state.impact*8+enter*5+punch*6),shy=Math.cos(current*53)*(state.impact*8+enter*5+punch*6);
 $('#cam').style.transform=`translate3d(${shx}px,${shy}px,0) scale(${zoom}) rotate(${roll}deg)`;
 $('#cam').style.filter=`blur(${enter*7+leave*5}px) brightness(${1+enter*.5+leave*.35+state.impact*.2+punch*.28}) saturate(1.14) contrast(1.05)`;
 // Chữ tiêu đề động: từng ký tự bật lên từ xa, thoát bằng zoom xuyên màn hình.
 const delay=s.kind==='intro'?2.2:s.kind==='community'?.3:s.kind==='outro'?.25:.04,hold=action?.95:duration-.6;
 const out=smooth((local-hold)/(action?.3:.5));
 letters.forEach((el,i)=>{const p=smooth((local-delay-i*.032)/.5);el.style.opacity=p;el.style.transform=`translate3d(0,${(1-p)*50}px,0) scale(${1+(1-p)*.55})`;el.style.filter=p<1?`blur(${(1-p)*14}px)`:'none'});
 $('#headline').style.opacity=1-out;$('#headline').style.transform=`scale(${1+out*(action?.45:.06)})`;$('#headline').style.filter=out>0?`blur(${out*(action?18:6)}px)`:'none';
 const info=action?0:smooth((local-delay-.5)/.45)*(1-out);$('#eyebrow').style.opacity=info;$('#description').style.opacity=info;$('#tags').style.opacity=info;
 $('#description').style.transform=$('#tags').style.transform=`translate3d(0,${(1-info)*18}px,0)`;
 // Chữ động trên footage: từng dòng bật vào từ xa (zoom + nhòe), thoát bằng phóng lớn.
 for(const el of $('#words').children){const w=el.__w,u=local-w.t;
  if(u<-.05||u>w.d+.1){el.style.opacity=0;continue}
  const out=smooth((u-(w.d-.32))/.3);el.style.opacity=1-out;el.style.transform=`scale(${1+out*.18})`;el.style.filter=out>0?`blur(${out*10}px)`:'none';
  w.lines.forEach((ln,i)=>{const p=smooth((u-i*.07)/.3);ln.style.opacity=p;ln.style.transform=`translate3d(0,${(1-p)*40}px,0) scale(${1+(1-p)*.8})`;ln.style.filter=p<1?`blur(${(1-p)*16}px)`:'none';ln.style.letterSpacing=`${(1-p)*26+4}px`});
  w.bar.style.transform=`scaleX(${smooth((u-.25)/.4)})`;const sm=el.querySelector('small');if(sm)sm.style.opacity=smooth((u-.1)/.3);
 }
 // Logo đầu màn hình: lần lượt Hội Sinh viên → Khoa → CLB.
 const logoOut=1-smooth((current-film.duration+1.1)/1.1);
 logos.forEach((img,i)=>{const p=smooth((current-.35-i*.28)/.55);img.style.opacity=p*logoOut;img.style.transform=`translate3d(0,${(1-p)*-26}px,0) scale(${.7+.3*p})`});
 $('#logos').style.opacity=logoOut;$('#logos').style.setProperty('--shine',`${-200+((current*130)%1500)}px`);
 // Ánh sáng, hạt phim, vệt anamorphic theo nhịp.
 const energy=envelope[Math.min(envelope.length-1,Math.floor(current*60))]||0,lx=50+40*Math.sin(current*.27),ly=25+15*Math.cos(current*.19);
 $('#leak').style.background=`radial-gradient(circle at ${lx}% ${ly}%,${s.color}cc 0,transparent 38%),radial-gradient(circle at ${100-lx}% ${100-ly}%,${s.color}77 0,transparent 34%)`;$('#leak').style.opacity=.12+energy*.22+state.pulse*.12;
 $('#grain').style.backgroundPosition=`${(Math.floor(current*24)*53)%220}px ${(Math.floor(current*24)*97)%220}px`;
 $('#streak').style.opacity=Math.min(1,state.pulse*.9+state.impact*.8);$('#streak').style.transform=`scaleX(${.3+state.pulse*.9+state.impact})  scaleY(${1+state.impact*2})`;
 $('#wipe').style.opacity=Math.max(enter*.38,leave*.3,state.impact*.1,punch*.14);$('#wipe').style.background=enter>leave?s.color:'#fff';
 $('#progress').style.width=`${100*current/film.duration}%`;
 $('#curtain').style.opacity=Math.max(1-smooth(current/.7),smooth((current-film.duration+1.1)/1.1));
 $('#credit').style.opacity=s.kind==='outro'?smooth((local-.6)/.5)*(1-smooth((local-3.6)/.8)):0;
 const stamp=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;$('#scrub').value=current;$('#time').textContent=`${stamp(current)} / ${stamp(film.duration)}`;
 return {time:current,scene:base.kind,...state};
}
function tick(now){if(playing){renderAt(!music.paused?music.currentTime:current+(now-prev)/1000);if(current>=film.duration){playing=false;music.pause();$('#play').textContent='Phát lại'}}prev=now;requestAnimationFrame(tick)}
$('#play').onclick=async()=>{if(!window.__film?.ready)return;if(playing){playing=false;music.pause();footage.pause();$('#play').textContent='Phát';return}if(current>=film.duration)renderAt(0);music.currentTime=current;prev=performance.now();playing=true;$('#play').textContent='Tạm dừng';try{await music.play()}catch{playing=false;$('#play').textContent='Phát';$('#notice').textContent='Không phát được nhạc. Kiểm tra npm run audio rồi thử lại.'}};
$('#scrub').oninput=e=>{if(window.__film?.ready){renderAt(Number(e.target.value));music.currentTime=current}};
$('#mute').onclick=()=>{music.muted=!music.muted;$('#mute').textContent=music.muted?'Bật tiếng':'Tắt tiếng'};
$('#fullscreen').onclick=()=>$('#stage').requestFullscreen();
initialize().catch(e=>{console.error(e);$('#error').style.display='block';$('#error').textContent='Không tải được bản dựng: '+e.message;window.__film={ready:false,error:e.message}});
