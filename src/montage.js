// Danh sách cảnh dựng nhanh (montage). Dùng chung cho scripts/montage.mjs (tạo clip) và preview (nhịp cắt).
// src: apl = Liên Quân APL 2025, lola/lolb = LoL ASIAD 2026 (VIE vs KSA, 2 phần), ffa = Free Fire FFWS (WAG), val = reel VCT, ff = Free Fire cinematic.
// Footage giải đấu được cắt bỏ phần bảng điểm/HUD ngoài rìa (xem crops trong scripts/montage.mjs).
// [nguồn, giây bắt đầu trong nguồn, độ dài trên timeline, tốc độ (<1 = chậm)]
const S=(src,at,dur,speed=1)=>({src,at,dur,speed});
export const sources={
 apl:'public/assets/trailers/top5-highlights-apl-2025.mp4',
 val:'public/assets/trailers/valorant-reel.mp4',
 ff:'public/assets/trailers/free-fire-cinematic.mp4',
 lola:'public/assets/trailers/vie-vs-ksa-asiad-2026-part1.mp4',
 lolb:'public/assets/trailers/vie-vs-ksa-asiad-2026-part2.mp4',
 ffa:'public/assets/trailers/wag-ffws-sea-fall-2024-part1.mp4',
};
export const acts={
 // 14s: cắt nhanh trộn các game
 act1:{grade:'',shots:[S('lola',29,1.2),S('val',6,1),S('ffa',48,1.4),S('apl',83,1.2),S('ffa',160,1.2),S('val',8,1),S('lolb',65,1.4),S('ffa',100,1.2),S('apl',108,1),S('lolb',121,1.4),S('ffa',80,1),S('ff',4,1)]},
 // 12s: ba cột chạy song song (Free Fire | Liên Quân | LoL), mỗi cột đổi cảnh mỗi 2 giây
 act2:{triptych:[
  [S('ffa',30,2),S('ffa',38,2),S('ffa',46,2),S('ffa',98,2),S('ffa',126,2),S('ffa',150,2)],
  [S('apl',82,2),S('apl',84,2),S('apl',92,2),S('apl',110,2),S('apl',127,2),S('apl',131,2)],
  [S('lolb',17,2),S('lola',45,2),S('lolb',33,2),S('lolb',73,2),S('lola',109,2),S('lolb',129,2)],
 ]},
 // 14s: giao tranh dài hơn, phủ tông xanh (không chữ)
 act3:{grade:'tech',shots:[S('lola',29,2.4),S('lolb',129,2.4),S('apl',24,2.4),S('lola',109,2.2),S('lolb',77,2.4),S('apl',94,2.2)]},
 // 15s: 15 cú cắt, mỗi cú 1 giây
 act4:{grade:'',shots:[S('lola',41,1),S('ffa',36,1),S('apl',113,1),S('lolb',21,1),S('ffa',146,1),S('val',14,1),S('apl',117,1),S('lola',113,1),S('ffa',170,1),S('lolb',93,1),S('val',14.9,1),S('apl',131,1),S('ffa',178,1),S('lolb',137,1),S('ffa',158,1)]},
 // 10s: chậm lại, cảnh rộng
 act5:{grade:'warm',shots:[S('ff',10,2,.6),S('ff',11,2,.5),S('ff',9,2,.7),S('ff',1,2,.6),S('ff',3,2,.5)]},
 // --- Bản 30 giây ---
 // 8s: 8 cú cắt, mỗi cú 1 giây
 s1:{grade:'',shots:[S('lola',29,1),S('val',6,1),S('ffa',48,1),S('apl',83,1),S('ffa',160,1),S('lolb',65,1),S('ffa',100,1),S('apl',108,1)]},
 // 6s: ba cột, mỗi cột đổi cảnh mỗi 2 giây
 s2:{triptych:[
  [S('ffa',30,2),S('ffa',46,2),S('ffa',98,2)],
  [S('apl',82,2),S('apl',92,2),S('apl',110,2)],
  [S('lolb',17,2),S('lola',45,2),S('lolb',73,2)],
 ]},
 // 6s: 6 cú cắt, mỗi cú 1 giây
 s3:{grade:'',shots:[S('lola',41,1),S('ffa',36,1),S('apl',113,1),S('lolb',21,1),S('ffa',146,1),S('apl',117,1)]},
 // 3s: chậm lại, cảnh rộng
 s4:{grade:'warm',shots:[S('ff',10,1.5,.6),S('ff',9,1.5,.7)]},
};
export const actShots=a=>a.triptych?a.triptych[0]:a.shots;
export const actDuration=a=>+actShots(a).reduce((t,s)=>t+s.dur,0).toFixed(3);
