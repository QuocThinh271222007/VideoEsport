import * as THREE from 'three';
import {assetPaths,casts,cues} from './config.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const easeOut=x=>1-Math.pow(1-clamp(x),3),lerp=THREE.MathUtils.lerp;

// Frame transforms depend only on absolute time, never an accumulated delta.
export class FilmWorld {
 async init(canvas,width,height){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
  this.renderer.setPixelRatio(1);this.renderer.setSize(width,height,false);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#050b13');this.scene.fog=new THREE.FogExp2('#050b13',.021);
  this.camera=new THREE.PerspectiveCamera(44,16/9,.1,160);
  const loader=new THREE.TextureLoader();this.textures={};
  await Promise.all(Object.entries(assetPaths).map(async([key,path])=>{const tx=await loader.loadAsync(path);tx.colorSpace=THREE.SRGBColorSpace;this.textures[key]=tx}));
  this.tintMaterials=[];this.portals=[];this.shards=[];this.art={};this.createStage();
  for(const [key,tx] of Object.entries(this.textures))this.art[key]=this.createArt(key,tx);
  this.createParticles();
 }
 tintMaterial(opacity=1){const m=new THREE.MeshBasicMaterial({color:'#99ffd6',transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending});this.tintMaterials.push(m);return m}
 createStage(){
  for(let i=0;i<11;i++){
   const group=new THREE.Group(),m=this.tintMaterial(.34);
   for(const [x,y,w,h] of [[-9,0,.035,12],[9,0,.035,12],[0,6,18,.035],[0,-6,18,.035]]){
    const bar=new THREE.Mesh(new THREE.BoxGeometry(w,h,.09),m);bar.position.set(x,y,0);group.add(bar);
   }
   this.scene.add(group);this.portals.push(group);
  }
  const floor=new THREE.GridHelper(100,50,'#5cb69e','#122932');floor.position.y=-4.8;
  floor.material.transparent=true;floor.material.opacity=.4;this.scene.add(floor);this.floor=floor;
  const glowMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
   uniforms:{tint:{value:new THREE.Color('#99ffd6')},power:{value:.55}},
   vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec2 vUv; uniform vec3 tint; uniform float power; void main(){float r=length((vUv-.5)*2.);float a=pow(max(0.,1.-r),3.)*power;gl_FragColor=vec4(tint,a);}'
  });
  this.glow=new THREE.Mesh(new THREE.PlaneGeometry(23,19),glowMat);this.glow.position.set(3,0,-6);this.scene.add(this.glow);
  this.rings=[];
  for(let i=0;i<3;i++){
   const ring=new THREE.Mesh(new THREE.TorusGeometry(3.7+i*.32,.018,5,96),this.tintMaterial(.65-i*.12));
   ring.position.set(3,-4.5+i*.1,0);ring.rotation.x=-Math.PI/2;this.scene.add(ring);this.rings.push(ring);
  }
  for(let i=0;i<18;i++){
   const m=new THREE.Mesh(new THREE.BoxGeometry(.035,1.0+(i%4)*.6,.035),this.tintMaterial(.28));this.scene.add(m);this.shards.push(m);
  }
 }
 createArt(key,tx){
  const character=['neon','omen','yoru','viper'].includes(key),h=character?8.5:7.1,w=character?h*tx.image.width/tx.image.height:12.1;
  const root=new THREE.Group(),mat=new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:true,alphaTest:.02,side:THREE.DoubleSide});
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);root.add(panel);let frame,shadow;
  if(!character){
   panel.scale.y=(w*tx.image.height/tx.image.width)/h;
   frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w+.08,w*tx.image.height/tx.image.width+.08,.17)),new THREE.LineBasicMaterial({color:'#b7e7f4',transparent:true,opacity:.5}));root.add(frame);
  }else{
   const sm=mat.clone();sm.color.set('#16322f');sm.opacity=.16;sm.depthWrite=false;shadow=new THREE.Mesh(panel.geometry,sm);shadow.position.set(.13,-8.45,-.12);shadow.scale.y=-1;root.add(shadow);
  }
  root.visible=false;this.scene.add(root);return {root,panel,mat,frame,shadow,character};
 }
 createParticles(){
  const p=[];for(let i=0;i<420;i++)p.push(((i*16807%997)/997-.5)*40,((i*48271%991)/991-.5)*22,-70+(i*97%101)/101*85);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  const mat=new THREE.PointsMaterial({color:'#b5ffe5',size:.045,transparent:true,opacity:.6,depthWrite:false});this.particles=new THREE.Points(geo,mat);this.scene.add(this.particles);
 }
 resize(w,h){this.renderer.setSize(w,h,false)}
 draw(t,s,energy=0){
  const local=t-s.start,duration=s.end-s.start,p=clamp(local/duration),leave=1-smooth((local-duration+.55)/.55);
  const hue=new THREE.Color(s.color),pulse=Math.exp(-Math.max(0,t-(cues.filter(c=>c<=t).at(-1)||0))*5);
  this.tintMaterials.forEach(m=>m.color.copy(hue));this.glow.material.uniforms.tint.value.copy(hue);this.glow.material.uniforms.power.value=.5+energy*.35+pulse*.2;
  this.particles.material.color.copy(hue);this.particles.position.z=(t*.45)%8;this.particles.rotation.z=Math.sin(t*.06)*.08;
  for(let i=0;i<this.portals.length;i++){const g=this.portals[i];g.position.set(0,0,8-i*7+(local*2.2)%7);g.rotation.z=Math.sin(local*.2+i*.16)*.1}
  this.floor.position.z=(local*2)%2;
  for(let i=0;i<this.shards.length;i++){const m=this.shards[i];m.position.set((i%2?1:-1)*(8+(i%3)*2),Math.sin(i*13)*6,-22+((i*5+local*3.2)%37));m.rotation.set(.4,i*.21,Math.sin(local*.4+i)*.8)}
  this.rings.forEach((r,i)=>{r.rotation.z=local*.2*(i%2?1:-1);r.scale.setScalar(1+energy*.045+pulse*.09)});
  for(const a of Object.values(this.art)){a.root.visible=false;a.root.scale.setScalar(1);a.root.rotation.set(0,0,0);a.mat.opacity=1;if(a.frame)a.frame.material.opacity=.5;if(a.shadow)a.shadow.material.opacity=.16}
  let active=null,visible=[];const cast=casts[s.kind];
  if(cast){
   const slot=duration/cast.length,k=Math.min(cast.length-1,Math.floor(local/slot));active=cast[k];
   for(let i=0;i<cast.length;i++){
    const age=local-i*slot;if(age<0||age>slot+.8)continue;
    const a=this.art[cast[i].asset],entry=easeOut(age/1.15),exit=smooth((age-slot+.25)/1.05);
    a.root.visible=true;a.mat.opacity=smooth(age/.28)*(1-exit)*leave;
    a.root.position.set(lerp(10,3.3,entry)-exit*11,lerp(-.7,-.2,entry),lerp(-24,0,entry)+exit*7+clamp(age/slot)*.45);
    a.root.rotation.y=lerp(-.45,0,entry)+(a.character?Math.sin(age*.4)*.025:-.085+Math.sin(age*.35)*.065);a.root.rotation.z=(1-entry)*-.09+exit*.09;
    if(a.frame)a.frame.material.opacity=.55*a.mat.opacity;if(a.shadow)a.shadow.material.opacity=.13*a.mat.opacity;
    visible.push({asset:cast[i].asset,opacity:a.mat.opacity,z:a.root.position.z});
   }
   const shotP=(local%slot)/slot;this.camera.position.set(-.5+Math.sin(shotP*Math.PI)*1.25,.3+Math.sin(shotP*Math.PI)*.25,15.5-shotP*2.5);this.camera.lookAt(.15,0,-1);
  }else if(s.kind==='community'){
   ['ff1','neon','lq1'].forEach((key,i)=>{const a=this.art[key],e=easeOut((local-i*.23)/.9);a.root.visible=true;a.root.position.set((i-1)*6.4,1.1,lerp(-22,i===1?0:-2,e));a.root.scale.setScalar(key==='neon'?.57:.48);a.root.rotation.y=(i-1)*-.18;a.mat.opacity=e*leave;visible.push({asset:key,opacity:a.mat.opacity,z:a.root.position.z})});
   this.camera.position.set(Math.sin(local*.5)*.5,1,17.5-p*2);this.camera.lookAt(0,0,0);
  }else{
   ['neon','omen','yoru','viper'].forEach((key,i)=>{const a=this.art[key],e=easeOut((local-.65-i*.18)/1.4);a.root.visible=true;a.root.position.set(3.5+i*2.8,-.8,-12-i*4+e*3);a.mat.opacity=e*(s.kind==='intro'?.32:.2)*leave});
   this.camera.position.set(-1.8+p*2.8,.3+Math.sin(p*Math.PI)*.3,23-p*9);this.camera.lookAt(.7,0,-5);
  }
  this.renderer.render(this.scene,this.camera);return {active,visible,camera:this.camera.position.toArray(),pulse};
 }
}
