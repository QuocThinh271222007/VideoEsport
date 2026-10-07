// Native trailer/highlight footage. Export waits for decoded frames when seeking.
export class FootageLayer {
 async init(container,scenes){
  this.videos=new Map();
  await Promise.all(scenes.filter(s=>s.video).map(async s=>{
   const v=document.createElement('video');v.className='footage';v.muted=true;v.playsInline=true;v.preload='auto';v.hidden=true;
   container.append(v);this.videos.set(s.kind,v);
   try{
    await new Promise((resolve,reject)=>{v.addEventListener('loadeddata',resolve,{once:true});v.addEventListener('error',()=>reject(new Error(`Không tải được footage: ${s.video}`)),{once:true});v.src=s.video;v.load()});
    if(v.duration+.04<(s.videoIn||0)+s.end-s.start)throw new Error(`Footage quá ngắn: ${s.video}`);
   }catch(e){
    // Cảnh optional (clip chưa nhập) dùng artwork dự phòng thay vì làm hỏng cả video.
    if(!s.optional)throw e;v.remove();this.videos.delete(s.kind);console.warn(e.message);
   }
  }));
 }
 has(scene){return this.videos.has(scene.kind)}
 update(scene,time,playing,exportMode){
  const active=this.videos.get(scene.kind);this.active=active;this.target=(scene.videoIn||0)+time-scene.start;
  for(const v of this.videos.values()){v.hidden=v!==active;if(v!==active)v.pause()}
  if(active&&!exportMode){
   if(Math.abs(active.currentTime-this.target)>(playing?.25:.001))active.currentTime=this.target;
   if(playing)active.play().catch(()=>{});else active.pause();
  }
 }
 async seekExact(){
  const v=this.active;if(!v)return;
  const target=this.target;v.pause();
  if(Math.abs(v.currentTime-target)<.00001&&v.readyState>=2)return;
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{cleanup();reject(new Error('Footage seek timed out'))},10000);
   const cleanup=()=>{clearTimeout(timer);v.removeEventListener('seeked',done);v.removeEventListener('error',fail)};
   const done=()=>{cleanup();resolve()};const fail=()=>{cleanup();reject(new Error('Footage decode failed'))};
   v.addEventListener('seeked',done,{once:true});v.addEventListener('error',fail,{once:true});v.currentTime=target;
  });
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 }
 pause(){for(const v of this.videos.values())v.pause()}
}
