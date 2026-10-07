// Danh sách cảnh dựng nhanh (montage). Dùng chung cho scripts/montage.mjs (tạo clip) và preview (nhịp cắt).
// src: apl = video APL 2025 (cắt vùng gameplay, bỏ bảng điểm/camera tuyển thủ), val = reel VCT, ff = Free Fire cinematic.
// [nguồn, giây bắt đầu trong nguồn, độ dài trên timeline, tốc độ (<1 = chậm)]
const S=(src,at,dur,speed=1)=>({src,at,dur,speed});
export const sources={
 apl:'public/assets/trailers/top5-highlights-apl-2025.mp4',
 val:'public/assets/trailers/valorant-reel.mp4',
 ff:'public/assets/trailers/free-fire-cinematic.mp4',
};
export const acts={
 // 14s: cắt nhanh trộn ba nguồn
 act1:{start:5,grade:'',shots:[S('apl',81,1.2),S('val',6,1),S('apl',83,1.4),S('ff',4,1.2),S('apl',91,1.2),S('val',8,1),S('apl',108,1.4),S('ff',9,1.2),S('val',1.5,1),S('apl',126,1.4),S('ff',6,1),S('apl',129,1)]},
 // 12s: ba cột chạy song song, mỗi cột đổi cảnh mỗi 2 giây
 act2:{start:19,triptych:[
  [S('ff',1,2,.7),S('ff',4,2,.8),S('ff',6,2,.5),S('ff',9,2,.6),S('ff',10,2,.6),S('ff',3,2,.5)],
  [S('apl',82,2),S('apl',84,2),S('apl',92,2),S('apl',110,2),S('apl',127,2),S('apl',131,2)],
  [S('val',6,2,.75),S('val',8,2,.6),S('val',9.4,2,.5),S('val',14,2,.5),S('val',14.9,2,.5),S('val',1,2,.5)],
 ]},
 // 14s: giao tranh dài hơn, phủ tông xanh công nghệ
 act3:{start:31,grade:'tech',shots:[S('apl',16,2.4),S('apl',20,2.4),S('apl',24,2.4),S('apl',37,2.2),S('apl',54.5,2.4),S('apl',94,2.2)]},
 // 15s: 15 cú cắt, mỗi cú 1 giây
 act4:{start:45,grade:'',shots:[S('apl',113,1),S('ff',1,1),S('apl',117,1),S('val',14,1),S('apl',131,1),S('ff',10,1),S('val',14.9,1),S('apl',134,1),S('ff',7,1),S('apl',137,1),S('val',9.4,1),S('apl',145,1),S('ff',3,1),S('apl',57,1),S('val',4,1)]},
 // 10s: chậm lại, cảnh rộng
 act5:{start:60,grade:'warm',shots:[S('ff',10,2,.6),S('ff',11,2,.5),S('ff',9,2,.7),S('ff',1,2,.6),S('ff',3,2,.5)]},
};
const actShots=a=>a.triptych?a.triptych[0]:a.shots;
export const actDuration=a=>+actShots(a).reduce((t,s)=>t+s.dur,0).toFixed(3);
// Thời điểm mỗi cú cắt (giây trên timeline) để đánh nhịp flash/zoom trong preview.
export const cuts=Object.values(acts).flatMap(a=>{let t=a.start;return actShots(a).map(s=>{const at=t;t+=s.dur;return +at.toFixed(3)})});
