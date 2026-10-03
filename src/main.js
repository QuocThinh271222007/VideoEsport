import '@fontsource/barlow-condensed/700.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import './style.css';
import {film,scenes,casts,audioConfig} from './config.js';
import {FilmWorld,clamp,smooth} from './world.js';
const $=s=>document.querySelector(s),exportMode=new URLSearchParams(location.search).has('export');
document.body.classList.toggle('export',exportMode);
const world=new FilmWorld();let playing=false,current=0,prev=0,previousScene=-1,previousCast='',envelope=[];
const music=new Audio(audioConfig.preview);music.preload='auto';
function dimensions(){const h=exportMode||document.fullscreenElement?innerHeight:innerHeight-100;return {w:Math.round(Math.min(innerWidth,h*16/9)),h:Math.round(Math.min(h,innerWidth*9/16))}}
function resize(){const {w,h}=dimensions();$('#film').style.transform=`scale(${w/1920})`;if(world.renderer)world.resize(w,h)}
window.addEventListener('resize',resize);document.addEventListener('fullscreenchange',resize);resize();
async function initialize(){
 await Promise.all([document.fonts.load('700 100px "Barlow Condensed"','ĐIỆN TỬ'),document.fonts.load('400 25px "Be Vietnam Pro"','ĐỒNG ĐỘI'),document.fonts.load('600 19px "Be Vietnam Pro"','ĐỒNG ĐỘI')]);await document.fonts.ready;
 const {w,h}=dimensions();await world.init($('#world'),w,h);
 const r=await fetch('/assets/audio/envelope.json');if(!r.ok)throw new Error('Chưa chuẩn bị nhạc. Chạy npm run audio.');envelope=(await r.json()).values;
 $('#brand').textContent=film.brand;$('#scrub').max=film.duration;$('#credit').textContent=audioConfig.credit;
 window.__film={ready:true,duration:film.duration,scenes:scenes.map(({start,end,kind})=>({start,end,kind})),seek:renderAt};renderAt(0);if(!exportMode)requestAnimationFrame(tick);
}
function renderAt(seconds){
 current=clamp(seconds,0,film.duration);const index=scenes.findIndex(s=>current>=s.start&&current<s.end),n=index<0?scenes.length-1:index,s=scenes[n],local=current-s.start,duration=s.end-s.start;
 if(n!==previousScene){
  previousScene=n;$('#film').dataset.kind=s.kind;$('#film').style.setProperty('--accent',s.color);$('#chapter').textContent=s.label;$('#eyebrow').textContent=s.eyebrow;
  $('#headline').replaceChildren(...s.title.map(t=>{const span=document.createElement('span');span.textContent=t;return span}));$('#headline').classList.toggle('single',s.title.length===1);$('#description').textContent=s.description;
  $('#tags').replaceChildren(...s.tags.map(t=>{const span=document.createElement('span');span.textContent=t;return span}));
 }
 const entry=smooth((local-.1)/.8),exit=1-smooth((local-duration+.55)/.55);$('#copy').style.opacity=entry*exit;$('#copy').style.transform=`translate3d(${(1-entry)*-90}px,${(1-entry)*25}px,0)`;$('#progress').style.width=`${100*current/film.duration}%`;
 const state=world.draw(current,s,envelope[Math.min(envelope.length-1,Math.floor(current*60))]||0),castKey=state.active?.name||'';
 if(castKey!==previousCast){previousCast=castKey;$('#hero-name').textContent=castKey;$('#hero-line').textContent=state.active?.line||''}
 const slot=casts[s.kind]?duration/casts[s.kind].length:duration,shot=local%slot;
 const action=!!casts[s.kind];$('#film').classList.toggle('action',action);
 if(action){const title=smooth(local/.12)*(1-smooth((local-.75)/.3));$('#copy').style.opacity=title;$('#copy').style.transform=`translate3d(${(1-title)*-100}px,0,0) scale(${1+(1-title)*.25})`;}
 else if(s.kind==='intro'){$('#copy').style.opacity=smooth((local-2.35)/.25)*exit;}
 $('#film').dataset.phase=state.phase;
 $('#hero').style.opacity=casts[s.kind]?smooth((shot-.65)/.18)*(1-smooth((shot-1.6)/.15)):0;$('#hero').style.transform=`translateY(${(1-smooth(shot/.8))*45}px)`;
 $('#shot-index').textContent=casts[s.kind]?`${String(Math.min(casts[s.kind].length,Math.floor(local/slot)+1)).padStart(2,'0')} / ${String(casts[s.kind].length).padStart(2,'0')}`:'';
 $('#wipe').style.opacity=Math.max(n?Math.max(0,1-local/.12)*.24:0,state.impact*.12);
 $('#wipe').style.background=s.color;$('#curtain').style.opacity=Math.max(1-smooth(current/.7),smooth((current-film.duration+1.1)/1.1));
 $('#credit').style.opacity=s.kind==='outro'?smooth((local-1)/.5)*(1-smooth((local-5)/1)):0;
 $('#scrub').value=current;$('#time').textContent=`00:${String(Math.floor(current)).padStart(2,'0')} / 00:${film.duration}`;
 return {time:current,scene:s.kind,...state};
}
function tick(now){if(playing){renderAt(!music.paused?music.currentTime:current+(now-prev)/1000);if(current>=film.duration){playing=false;music.pause();$('#play').textContent='Phát lại'}}prev=now;requestAnimationFrame(tick)}
$('#play').onclick=async()=>{if(!window.__film?.ready)return;if(playing){playing=false;music.pause();$('#play').textContent='Phát';return}if(current>=film.duration)renderAt(0);music.currentTime=current;prev=performance.now();playing=true;$('#play').textContent='Tạm dừng';try{await music.play()}catch{playing=false;$('#play').textContent='Phát';$('#notice').textContent='Không phát được nhạc. Kiểm tra npm run audio rồi thử lại.'}};
$('#scrub').oninput=e=>{if(window.__film?.ready){renderAt(Number(e.target.value));music.currentTime=current}};
$('#mute').onclick=()=>{music.muted=!music.muted;$('#mute').textContent=music.muted?'Bật tiếng':'Tắt tiếng'};
$('#fullscreen').onclick=()=>$('#stage').requestFullscreen();
initialize().catch(e=>{console.error(e);$('#error').style.display='block';$('#error').textContent='Không tải được bản dựng: '+e.message;window.__film={ready:false,error:e.message}});
