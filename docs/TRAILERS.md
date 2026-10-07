# V4 — artwork cũ + highlight/trailer, không giọng đọc

Theo yêu cầu mới: bỏ hoàn toàn hoạt cảnh rig tự làm và giọng đọc v4. Bản preview mặc định dùng lại renderer artwork 2.5D của v3, thêm footage thật và chỉ phát nhạc/SFX. Không dùng các clip luyện kỹ năng Neon.

## Timeline (84 giây)

| Thời gian | Nội dung |
|---|---|
| 00–06 | Intro v3 |
| 06–22 | Neon, Omen, Yoru, Viper — artwork v3 |
| 22–28 | VCT 2025 IL Kickoff: trích đoạn thi đấu/hype, nguồn 13.3–19.3s |
| 28–32.8 | Masters Bangkok cinematic: nguồn 00–04.8s |
| 32.8–35.8 | VCT Kickoff: nguồn 23.5–26.5s |
| 35.8–38 | VCT Stage 1 Hype Trailer: nguồn 06–08.2s |
| 38–50 | Free Fire — artwork v3 |
| 50–62 | Free Fire cinematic chính thức: nguồn 03–15s |
| 62–74 | Liên Quân — artwork v3 |
| 74–78 | Hội tụ |
| 78–84 | Lời mời tham gia + credit nhạc |

Nguồn đầy đủ, in-point, thời lượng và SHA-256 ở `TRAILER_SOURCES.json`. Các file đã cắt được commit để preview/render không phụ thuộc YouTube. Reel VCT có cả cảnh thi đấu thật, tuyển thủ và cinematic; không gọi mọi cảnh trong reel là highlight thi đấu. Free Fire là cinematic. Liên Quân hiện vẫn là artwork cũ, chưa bổ sung highlight/trailer riêng.

Nhạc: The Fury — Scott Buckley, CC BY 4.0; giữ credit trong mô tả khi đăng. Footage thuộc Riot Games/Garena và chủ sở hữu tương ứng; không tuyên bố là CC0. Toàn bộ audio của footage bị tắt trong bản dựng, không có voice-over mới.

Kiểm tra: build PASS; asset/timeline/browser/scene-transition/deterministic-seek PASS. Footage dùng seek chờ frame giải mã khi export, luôn muted, và bị pause khi rời cảnh.

## V6 — dựng nhanh theo nhịp, giới thiệu Ban Thể thao điện tử

Bỏ kiểu trình chiếu từng nhân vật. Nội dung lấy từ Đề án thành lập Ban Thể thao điện tử (CLB Tin học, NH 2026-2027): tư duy chiến thuật, phản xạ, phối hợp; thi đấu có tổ chức, có luật; công nghệ trong esports; sinh hoạt, giao lưu, giải nội bộ, đội tuyển; chơi có trách nhiệm, không cá cược, kết thúc trước 22:00, Ban không thu phí riêng; tuyển thành viên tháng 10/2026.

| Giây | Cảnh |
|---|---|
| 0–5 | Mở đầu: tên Ban + logo (3D) |
| 5–19 | act1: 12 cú cắt nhanh, chữ TƯ DUY CHIẾN THUẬT / PHẢN XẠ / PHỐI HỢP / ĐỒNG ĐỘI |
| 19–31 | act2: ba cột footage chạy song song, đổi cảnh mỗi 2 giây |
| 31–45 | act3: công nghệ (phần cứng, mạng, phát sóng, phân tích, phát triển game), tông xanh |
| 45–60 | act4: 15 cú cắt 1 giây — sinh hoạt, giao lưu, giải nội bộ, đội tuyển |
| 60–70 | act5: chậm lại — chơi có trách nhiệm |
| 70–76 | Hội tụ nhân vật (3D) |
| 76–84 | Lời mời tuyển thành viên + credit nhạc |

- Danh sách cảnh cắt: `src/montage.js`. Tạo lại clip: `npm run montage` (cần `top5-highlights-apl-2025.mp4`, `valorant-reel.mp4`, `free-fire-cinematic.mp4` trong `public/assets/trailers/`). Clip ra ở `public/assets/montage/act1–5.mp4`.
- Video giải đấu Liên Quân chỉ lấy vùng gameplay (bỏ bảng điểm, camera tuyển thủ). Mỗi cú cắt có nhịp đập zoom/sáng/rung trong preview.
- Chữ động: `words` trong `src/config.js` (giây trong cảnh, độ dài, dòng chữ '/' xuống dòng).
- Nhịp cắt đặt theo lưới thời gian; chưa canh theo nhịp bản nhạc vì chưa phân tích được file nhạc. SFX đặt tại điểm vào cảnh và các lần chữ xuất hiện.
- Tên game không xuất hiện trên màn hình: đề án nêu danh mục game từng giải do Ban Chủ nhiệm duyệt. Footage chỉ minh họa.
- Nguồn footage Liên Quân: video TOP 5 highlights APL 2025 do người dùng cung cấp. Bản quyền thuộc Garena/APL và các chủ sở hữu tương ứng.
