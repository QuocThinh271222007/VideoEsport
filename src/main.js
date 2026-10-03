import * as THREE from 'three';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import './style.css';
import {film,scenes,assetPaths} from './config.js';

const $=s=>document.querySelector(s), exportMode=new URLSearchParams(location.search).has('export');
document.body.classList.toggle('export',exportMode);
let renderer,scene,camera,points,rings=[],art={},playing=false,current=0,prev=0,previousScene=-1;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
function resize(){const w=innerWidth,h=exportMode?innerHeight:innerHeight-100;$('#film').style.transform=`scale(${Math.min(w/1920,h/1080)})`;if(renderer){renderer.setSize(Math.round(Math.min(w,h*16/9)),Math.round(Math.min(h,w*9/16)),false)}}
window.addEventListener('resize',resize);resize();
function mesh(texture,width,height,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));m.position.set(x,y,z);scene.add(m);return m}
async function initialize(){
  await Promise.all([document.fonts.load('700 100px "Barlow Condensed"','ĐIỆN TỬ'),document.fonts.load('400 25px "Be Vietnam Pro"','ĐỒNG ĐỘI'),document.fonts.load('600 19px "Be Vietnam Pro"','ĐỒNG ĐỘI')]);await document.fonts.ready;
  renderer=new THREE.WebGLRenderer({canvas:$('#world'),antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;resize();
  scene=new THREE.Scene();scene.background=new THREE.Color('#070c12');camera=new THREE.PerspectiveCamera(43,16/9,.1,100);camera.position.set(0,0,12);
  const loader=new THREE.TextureLoader();const textures={};
  await Promise.all(Object.entries(assetPaths).map(async([key,url])=>{const tx=await loader.loadAsync(url);tx.colorSpace=THREE.SRGBColorSpace;textures[key]=tx}));
  art.ff=mesh(textures.freeFire,20,11.25,1.5,0,-1.8);art.lq=mesh(textures.lienQuan,20,20*1129/1920,2.3,0,-1.8);
  for(const [key,x,z,h] of [['omen',4.0,-.7,8.6],['cypher',6.4,-.8,7.9],['neon',3.0,.8,9.2]]){const tx=textures[key];art[key]=mesh(tx,h*tx.image.width/tx.image.height,h,x,-.35,z)}
  const positions=[];for(let i=0;i<180;i++){const r=(i*16807%997)/997;positions.push((r-.5)*30,(((i*48271)%991)/991-.5)*17,-9+((i*97)%101)/101*11)}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));points=new THREE.Points(geo,new THREE.PointsMaterial({color:'#9bffca',size:.023,transparent:true,opacity:.7}));scene.add(points);
  for(let i=0;i<7;i++){const g=new THREE.TorusGeometry(3+i*.47,.009,4,3);const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#9bffca',transparent:true,opacity:.32}));m.position.set(3.8,-.1,-3-i*.5);scene.add(m);rings.push(m)}
  $('#brand').textContent=film.brand;
  window.__film={ready:true,duration:film.duration,scenes:scenes.map(({start,end,kind})=>({start,end,kind})),seek:renderAt};
  renderAt(0);requestAnimationFrame(tick);
}
function renderAt(seconds){
  current=clamp(seconds,0,film.duration);const idx=scenes.findIndex(s=>current>=s.start&&current<s.end);const n=idx<0?scenes.length-1:idx,s=scenes[n],local=current-s.start,p=clamp(local/(s.end-s.start));
  if(n!==previousScene){previousScene=n;$('#film').style.setProperty('--accent',s.color);$('#chapter').textContent=s.label;$('#eyebrow').textContent=s.eyebrow;$('#headline').replaceChildren(...s.title.map(t=>{let x=document.createElement('span');x.textContent=t;return x}));$('#headline').classList.toggle('single',s.title.length===1);$('#description').textContent=s.description;$('#tags').replaceChildren(...s.tags.map(t=>{let x=document.createElement('span');x.textContent=t;return x}));$('#huge-number').textContent=String(n+1).padStart(2,'0')}
  const enter=smooth(local/1),leave=1-smooth((local-(s.end-s.start-.55))/.55),opacity=enter*leave;
  $('#copy').style.opacity=opacity;$('#copy').style.transform=`translate(${(1-enter)*-65}px,${(1-enter)*18}px)`;
  $('#huge-number').style.opacity=opacity;$('#progress').style.width=`${100*current/film.duration}%`;
  $('#wipe').style.opacity=n>0?Math.max(0,1-local/.32)*.4:0;
  const community=s.kind==='community';const isIntro=['intro','outro'].includes(s.kind);
  for(const m of Object.values(art))m.visible=false;
  if(s.kind==='valorant'||community){for(const key of ['neon','omen','cypher']){const m=art[key];m.visible=true;m.material.opacity=opacity*(community?.36:1);const base={neon:3,omen:4,cypher:6.4}[key];m.position.x=base+Math.sin(local*.32+base)*.17+(1-enter)*1.6;m.position.y=-.35+Math.sin(local*.35+base)*.09;m.scale.setScalar(1+p*.06)} }
  if(['free-fire','lien-quan'].includes(s.kind)){const m=art[s.kind==='free-fire'?'ff':'lq'];m.visible=true;m.material.opacity=leave;m.scale.setScalar(1.03+p*.08);m.position.x=(s.kind==='free-fire'?1.5:2.3)-p*.35;m.position.y=-p*.1}
  for(let i=0;i<rings.length;i++){let m=rings[i];m.material.color.set(s.color);m.material.opacity=(isIntro?.6:community?.28:.15)*(.8+.2*Math.sin(local+i));m.rotation.set(Math.sin(local*.12+i*.1)*.28,local*.14+i*.12,local*.08+i*.18);m.position.x=isIntro?4.1:4.8}
  points.material.color.set(s.color);points.rotation.z=current*.012;points.position.x=Math.sin(current*.2)*.3;
  camera.position.x=Math.sin(local*.22)*.09;camera.position.y=Math.cos(local*.16)*.05;camera.lookAt(0,0,0);renderer.render(scene,camera);
  $('#scrub').value=current;$('#time').textContent=`00:${String(Math.floor(current)).padStart(2,'0')} / 00:48`;
  return {time:current,scene:s.kind};
}
function tick(now){if(playing){renderAt(Math.min(film.duration,current+(now-prev)/1000));if(current>=film.duration){playing=false;$('#play').textContent='Phát lại'}}prev=now;requestAnimationFrame(tick)}
$('#play').onclick=()=>{if(!window.__film?.ready)return;if(current>=film.duration)renderAt(0);playing=!playing;$('#play').textContent=playing?'Tạm dừng':'Phát';prev=performance.now()};
$('#scrub').oninput=e=>{if(window.__film?.ready)renderAt(Number(e.target.value))};
$('#fullscreen').onclick=()=>$('#stage').requestFullscreen();
initialize().catch(e=>{console.error(e);$('#error').style.display='block';$('#error').textContent='Không tải được scene. Hãy chạy npm run assets và nhập bộ ảnh Valorant theo README. Chi tiết: '+e.message;window.__film={ready:false,error:e.message}});
