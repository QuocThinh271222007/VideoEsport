import * as THREE from 'three';
import {assetPaths,casts,cues} from './config.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const out=x=>1-(1-clamp(x))**3, mix=THREE.MathUtils.lerp;
const gauss=(x,y,cx,cy,sx,sy)=>Math.exp(-(((x-cx)/sx)**2+((y-cy)/sy)**2));
const colors={neon:'#60eaff',omen:'#ae85ff',yoru:'#438cff',viper:'#9cff43'};

// Every pose, camera cut and effect is a pure function of absolute film time.
export class FilmWorld {
 async init(canvas,width,height){
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
  this.renderer.setPixelRatio(1);this.renderer.setSize(width,height,false);this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#03060c');this.scene.fog=new THREE.FogExp2('#03060c',.014);
  this.camera=new THREE.PerspectiveCamera(48,16/9,.1,180);
  this.textures={};const loader=new THREE.TextureLoader();
  await Promise.all(Object.entries(assetPaths).map(async([key,path])=>{const tx=await loader.loadAsync(path);tx.colorSpace=THREE.SRGBColorSpace;this.textures[key]=tx}));
  this.tintMaterials=[];this.art={};this.pillars=[];this.streaks=[];this.smoke=[];this.bolts=[];
  this.createStage();for(const [key,tx] of Object.entries(this.textures))this.art[key]=this.createArt(key,tx);
  this.createEffects();
 }
 tint(opacity=1){const m=new THREE.MeshBasicMaterial({color:'#80eaff',transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});this.tintMaterials.push(m);return m}
 createStage(){
  const floor=new THREE.GridHelper(140,60,'#396a7f','#0c1822');floor.position.y=-4.8;floor.material.transparent=true;floor.material.opacity=.25;this.scene.add(floor);this.floor=floor;
  for(let i=0;i<32;i++){
   const h=4+(i*13%17),g=new THREE.Group(),body=new THREE.Mesh(new THREE.BoxGeometry(2.4,h,2.4),new THREE.MeshBasicMaterial({color:i%2?'#0d1723':'#080f1b'}));
   body.position.y=h/2-5;g.add(body);
   const strip=new THREE.Mesh(new THREE.BoxGeometry(.045,h,2.43),this.tint(.28));strip.position.set(-1.21,h/2-5,0);g.add(strip);
   g.position.set((i%2?1:-1)*(10+i%5*2),0,-70+Math.floor(i/2)*6);this.scene.add(g);this.pillars.push(g);
  }
  this.portal=new THREE.Group();this.portalRings=[];
  for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(3.6+i*.14,.025+i*.009,6,80,Math.PI*(1.3+i*.2)),this.tint(.7));r.rotation.z=i;this.portal.add(r);this.portalRings.push(r)}this.scene.add(this.portal);
  const pos=[];for(let i=0;i<600;i++)pos.push((i*16807%997)/997*60-30,(i*48271%991)/991*24-12,(i*97%101)/101*90-70);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));this.particles=new THREE.Points(geo,new THREE.PointsMaterial({size:.045,color:'#88dfff',transparent:true,opacity:.6,depthWrite:false}));this.scene.add(this.particles);
 }
 createArt(key,tx){
  const character=Object.hasOwn(colors,key),h=character?9:21,w=h*tx.image.width/tx.image.height;
  const geo=new THREE.PlaneGeometry(w,h,48,56),base=geo.attributes.position.array.slice();
  const mat=new THREE.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.015,side:THREE.DoubleSide,depthWrite:true});
  const root=new THREE.Group(),panel=new THREE.Mesh(geo,mat);root.add(panel);this.scene.add(root);
  const ghosts=[];
  if(character)for(let i=0;i<3;i++){const gm=mat.clone();gm.color.set(colors[key]);gm.blending=THREE.AdditiveBlending;gm.depthWrite=false;const ghost=new THREE.Mesh(geo,gm);root.add(ghost);ghosts.push(ghost)}
  root.visible=false;return {key,root,panel,mat,geo,base,w,h,character,ghosts};
 }
 // Soft local joint weights: shoulder/arm swing, chest breathing, head turn,
 // bent-knee motion and cloth follow-through without cutting the illustration.
 pose(a,time,action){
  const ps=a.geo.attributes.position,base=a.base,swing=Math.sin(time*7),breath=Math.sin(time*2.4),kick=Math.sin(time*9+.8);
  let displacement=0;
  for(let i=0;i<ps.count;i++){
   const x=base[i*3],y=base[i*3+1],u=x/a.w+.5,v=y/a.h+.5;let dx=0,dy=0,dz=0;
   if(a.character){
    const chest=gauss(u,v,.5,.67,.28,.22),head=gauss(u,v,.5,.87,.17,.14),arm=gauss(u,v,.76,.64,.24,.17),leg=gauss(u,v,.65,.24,.23,.24);
    dx=chest*breath*.065+head*Math.sin(time*2.1)*.075+arm*swing*(.07+action*.19)+leg*kick*action*.14;
    dy=chest*breath*.065+arm*Math.cos(time*7)*action*.09+leg*Math.sin(time*9)*action*.11;
    const shoulderX=(.55-.5)*a.w,shoulderY=(.72-.5)*a.h,angle=Math.sin(time*4.5)*(.035+action*.07);
    dx+=arm*(-(y-shoulderY)*Math.sin(angle)+(x-shoulderX)*(Math.cos(angle)-1));
    dy+=arm*((x-shoulderX)*Math.sin(angle)+(y-shoulderY)*(Math.cos(angle)-1));
    dz=chest*(.1+breath*.07)+head*Math.sin(time*2.1)*.12;
    if(a.key==='omen'){dx+=Math.sin(v*10+time*4)*(.12+action*.12)*(1-v);dy+=Math.sin(time*3+u*8)*.08*(1-v)}
    if(a.key==='viper'){dx+=gauss(u,v,.65,.64,.26,.14)*Math.sin(time*22)*action*.075}
   }else{
    const body=gauss(u,v,.53,.5,.27,.4),weapon=gauss(u,v,.73,.56,.2,.2);
    dx=body*Math.sin(time*2.7)*.075+weapon*Math.sin(time*10)*action*.15;
    dy=body*breath*.09+weapon*Math.cos(time*8)*action*.07;
    dz=body*(.2+breath*.12);
   }
   ps.setXYZ(i,x+dx,y+dy,dz);displacement=Math.max(displacement,Math.abs(dx)+Math.abs(dy));
  }
  ps.needsUpdate=true;return displacement;
 }
 createEffects(){
  for(let i=0;i<80;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),this.tint(.5));this.scene.add(m);this.streaks.push(m)}
  this.slashes=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(4+i*.7,.035+i*.035,6,64,Math.PI*1.25),this.tint(.8));this.scene.add(m);this.slashes.push(m)}
  for(let i=0;i<6;i++){
   const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{tint:{value:new THREE.Color()},alpha:{value:.1},clock:{value:0}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform vec3 tint;uniform float alpha;uniform float clock;void main(){vec2 p=(v-.5)*2.;float r=length(p);float n=.85;float a=pow(max(0.,1.-r),2.)*n*alpha;gl_FragColor=vec4(tint,a);}'});
   const m=new THREE.Mesh(new THREE.PlaneGeometry(12,12),mat);this.scene.add(m);this.smoke.push(m);
  }
  for(let i=0;i<5;i++){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(33*3),3));const m=new THREE.Line(g,new THREE.LineBasicMaterial({color:'#8cecff',transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));this.scene.add(m);this.bolts.push(m)}
 }
 resize(w,h){this.renderer.setSize(w,h,false)}
 draw(t,s,energy=0){
  const local=t-s.start,duration=s.end-s.start,p=clamp(local/duration),cast=s.video?undefined:casts[s.kind];
  const slot=cast?duration/cast.length:4,k=cast?Math.min(cast.length-1,Math.floor(local/slot)):0,age=cast?local-k*slot:local;
  const active=cast?.[k]||null,key=active?.asset,phase=age<.72?'entry':age<1.75?'hero':age<2.75?'close':'strike';
  const impact=Math.exp(-Math.max(0,age-2.78)*12)*(age>=2.78?1:0),entry=out(age/.85),exit=smooth((age-3.55)/.45);
  const pulse=Math.exp(-Math.max(0,t-(cues.filter(c=>c<=t).at(-1)||0))*8),tint=new THREE.Color(colors[key]||s.color);
  this.tintMaterials.forEach(m=>m.color.copy(tint));this.particles.material.color.copy(tint);this.particles.position.z=(t*3)%12;
  this.particles.rotation.z=t*.025;this.floor.position.z=(t*8)%2;
  this.floor.visible=!cast||this.art[key].character;
  this.pillars.forEach((g,i)=>{g.visible=!cast||this.art[key].character;g.position.z=-70+Math.floor(i/2)*6+(t*5)%6});
  for(const a of Object.values(this.art)){a.root.visible=false;a.root.scale.setScalar(1);a.root.rotation.set(0,0,0);a.mat.opacity=1;a.mat.color.set('#ffffff');a.ghosts.forEach(g=>g.visible=false)}
  let visible=[],motion=0;
  this.camera.up.set(0,1,0);let cam=new THREE.Vector3(),target=new THREE.Vector3();
  if(cast){
   const a=this.art[key];a.root.visible=true;motion=this.pose(a,t,phase==='strike'?1:.4);
   if(a.character){
    const side=k%2?-1:1,attack=smooth((age-2.75)/.35);
    let x=mix(side*11,0,entry),z=mix(-24,0,entry);let y=-.35;
    if(phase==='strike'){x+=side*(-attack*1.5+exit*12);z+=attack*1.8+exit*5;y+=Math.sin(attack*Math.PI)*.6}
    if(key==='omen'){x=Math.sin(age*1.6)*.35;z=mix(-19,0,entry)+exit*3;y+=Math.sin(age*2)*.3;a.root.scale.setScalar(.8+entry*.2);}
    if(key==='yoru'){x+=Math.sin(age*3)*.18;z+=impact*.9;}
    if(key==='viper'){x=mix(4,0,entry);z=mix(-20,0,entry);y=-.35;}
    a.root.position.set(x,y+Math.sin(t*3)*.075,z);a.root.rotation.set(0,(1-entry)*side*.38+Math.sin(age*1.7)*.065,(1-entry)*side*-.3+attack*side*.06);
    // Two deliberate editorial cuts per performance: wide reveal -> face/detail -> attack.
    if(phase==='close'){cam.set(side*1.8-(age-1.75)*.9,1.6,8.9-(age-1.75)*.8);target.set(.1,1.6,0)}
    else if(phase==='strike'){cam.set(-side*.9+exit*2, .4+impact*.22,13-attack*2);target.set(side*-.5,.25,0)}
    else{cam.set(side*(-1.6+age*.6),-.1+age*.2,16.8-age*2.1);target.set(0,0,-1)}
    a.mat.opacity=(key==='omen'?smooth(age/.65):1)*(1-smooth((age-(key==='viper'||key==='omen'?3.6:3.88))/(key==='viper'||key==='omen'?.4:.12)));
    a.ghosts.forEach((g,j)=>{g.visible=key!=='viper'&&(age<.85||phase==='strike');g.position.set(side*(j+1)*(.38+(1-entry)*1.1+exit*.6),0,-.12*(j+1));g.material.opacity=(.22-j*.055)*(age<.85?1-entry*.6:Math.max(.25,exit));});
   }else{
    // Artwork occupies the entire set; no cards, frames or empty presentation column.
    const dir=k%2?-1:1;
    a.root.position.set(dir*(1-entry)*8+Math.sin(age*.8)*.4,-.4,-8+entry*1.5+exit*3);
    a.root.rotation.z=dir*(-.025+Math.sin(age*1.4)*.015)+impact*.012;
    a.root.scale.setScalar(1.12+age*.035);
    if(phase==='close'){cam.set(dir*2.0,s.kind==='free-fire'?2.8:.6,11.5-(age-1.75)*1.2);target.set(dir*.5,s.kind==='free-fire'?2.8:.6,-7)}
    else {cam.set(-dir*1.5+age*dir*.65,.4,13.8-age*.5);target.set(0,.3,-7)}
    a.mat.color.setRGB(.78,.8,.87);
   }
   visible.push({asset:key,opacity:a.mat.opacity,z:a.root.position.z});
  }else if(s.kind==='community'){
   ['neon','omen','yoru','viper'].forEach((key,i)=>{const a=this.art[key];a.root.visible=true;const e=out((local-i*.1)/.6);a.root.position.set((i-1.5)*3.7,-.4,-4+e*4);a.root.scale.setScalar(.8);this.pose(a,t+i,.65);visible.push({asset:key,opacity:1,z:a.root.position.z})});
   cam.set(Math.sin(local*.9)*1.5,.3,17-local*1.2);target.set(0,0,0);
  }else{
   const intro=s.kind==='intro';['neon','omen','yoru','viper'].forEach((key,i)=>{const a=this.art[key];a.root.visible=true;a.root.position.set((i-1.5)*5,-.5,-4-Math.abs(i-1.5)*3);a.mat.color.set(intro?'#183d50':'#2d5660');this.pose(a,t+i,.35)});
   if(intro&&local<2.5){cam.set(-10+local*5,.3,10);target.set(-6+local*4,.5,-5)}else{cam.set(Math.sin(local*.7)*.5,.5,intro?21-(local-2.5)*2:18-local*.7);target.set(0,0,-3)}
  }
  // Short, decaying impact shake, deterministic even when seeking backwards.
  const shake=impact*.13+pulse*.025;cam.x+=Math.sin(t*83)*shake;cam.y+=Math.cos(t*71)*shake;
  this.camera.position.copy(cam);this.camera.lookAt(target);this.camera.rotateZ(cast?(Math.sin(age*1.3)*.015+impact*.02):0);
  const special=key==='omen'||key==='yoru';this.portal.visible=special;
  this.portal.position.set(cast&&this.art[key].character?0:3,0,-3);this.portal.scale.setScalar(special?1.1+Math.sin(age*2)*.08:.8+impact*.5);
  this.portalRings.forEach((r,i)=>{r.rotation.z=t*(i%2?1.2:-.8)+i;r.material.opacity=special?.65:.12});
  for(let i=0;i<this.streaks.length;i++){
   const m=this.streaks[i],f=(t*(phase==='strike'?2.8:1.1)+i*.618)%1,angle=i*2.399;
   const rad=2.5+(i%8)*1.1;m.position.set(Math.cos(angle)*rad,Math.sin(angle)*rad*.62,-18+f*33);
   m.scale.set(.012+(i%3)*.008,.3+f*(phase==='strike'?6:2.5),1);m.rotation.set(0,0,angle-Math.PI/2);
   m.material.opacity=(.15+energy*.25+impact*.45)*(cast?1:.3);m.visible=!cast||this.art[key].character||i<38;
  }
  for(let i=0;i<this.smoke.length;i++){
   const m=this.smoke[i],viper=key==='viper',a=t*.4+i*2.3;
   m.position.set(Math.sin(a)*8,viper?-3+Math.sin(a*1.3):Math.cos(a*.8)*4,-4+(i%4)*2);
   m.scale.setScalar(.6+(i%4)*.35);m.rotation.z=t*.06+i;m.material.uniforms.tint.value.copy(tint);m.material.uniforms.clock.value=t+i;
   m.material.uniforms.alpha.value=(viper?.36:key==='omen'?.3:.085)*(i<6?1:.5);
  }
  this.slashes.forEach((m,i)=>{const attack=smooth((age-2.7)/.38);m.visible=!!cast&&key!=='viper'&&key!=='omen'&&age>2.7&&age<3.5;m.position.set((attack-.5)*8,-.5,3+i*.4);m.rotation.set(.4,-.3,-.8+attack*2.8+i*.6);m.scale.setScalar(.6+attack*1.6);m.material.opacity=(1-smooth((age-3)/.5))*(.7-i*.15)});
  this.bolts.forEach((m,i)=>{m.visible=key==='neon'||key==='yoru';const p=m.geometry.attributes.position;for(let j=0;j<33;j++){const f=j/32;p.setXYZ(j,(f-.5)*22,-3+i*1.4+Math.sin(f*32+t*18+i)*.18+Math.cos(f*65-t*9)*.11,-2+i*.5)}p.needsUpdate=true;m.material.color.copy(tint);m.material.opacity=.3+impact*.6;});
  this.renderer.render(this.scene,this.camera);
  return {active,visible,camera:this.camera.position.toArray(),pulse,impact,phase,motion,shotTime:age};
 }
}
