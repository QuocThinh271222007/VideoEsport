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

## Cập nhật V5 — logo, highlight Liên Quân, hiệu ứng

- Logo đầu màn hình, căn giữa, lần lượt **Hội Sinh viên → Khoa → CLB Tin học** (`public/assets/logos/`).
- Timeline mới (vẫn 84s): Free Fire cinematic 50–58, Liên Quân artwork 58–66, **Liên Quân highlight 66–74**, hội tụ 74–79, lời mời 79–84.
- Cảnh highlight Liên Quân đọc `public/assets/trailers/lien-quan-highlight.mp4`. Clip lấy từ video TOP 5 highlights APL 2025 người dùng cung cấp (cảnh giao tranh tổng, nguồn 79–87s, đã tắt tiếng). Nếu file bị xóa, cảnh tự dùng artwork Valhein/Nakroth. Thêm clip: `npm run import:lienquan -- --src=<file hoặc URL> --in=<giây bắt đầu> --duration=8`, rồi ghi nguồn vào `TRAILER_SOURCES.json`.
- Hiệu ứng: bỏ nhãn chương/khung chip kiểu slide; chữ tiêu đề hiện từng ký tự rồi zoom xuyên màn hình; camera đẩy vào + nảy theo nhịp; cú đập/flash khi cắt cảnh; light leak, hạt phim, vệt anamorphic theo nhịp nhạc.
