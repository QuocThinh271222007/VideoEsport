# VideoEsport — Giới thiệu Ban Thể thao điện tử (CLB Tin học)

Video ngang **84 giây** theo phong cách trailer: cắt nhanh theo nhịp, chữ động, camera đập theo từng cú cắt. Nội dung lấy từ Đề án thành lập Ban Thể thao điện tử (CLB Tin học, NH 2026-2027). Logo Hội Sinh viên → Khoa → CLB Tin học nằm giữa đầu màn hình. Không có giọng đọc.

| Giây | Cảnh |
|---|---|
| 0–5 | Mở đầu: tên Ban (artwork 3D làm nền) |
| 5–19 | act1: cắt nhanh — TƯ DUY CHIẾN THUẬT / PHẢN XẠ / PHỐI HỢP / ĐỒNG ĐỘI |
| 19–31 | act2: ba cột chạy song song (Free Fire · Liên Quân · LoL) |
| 31–45 | act3: giao tranh, tông xanh, không chữ |
| 45–60 | act4: 15 cú cắt — SINH HOẠT ĐỊNH KỲ / GIAO LƯU / TỔ CHỨC GIẢI ĐẤU / XÂY DỰNG ĐỘI TUYỂN |
| 60–70 | act5: chậm lại — chơi có trách nhiệm, không cá cược, cân bằng học tập, sân chơi lành mạnh |
| 70–76 | Hội tụ nhân vật 3D |
| 76–84 | TUYỂN THÀNH VIÊN — THÁNG 10/2026 |

Chi tiết: [docs/TRAILERS.md](docs/TRAILERS.md) · [nguồn footage](docs/TRAILER_SOURCES.json) · [credit nhạc](docs/MUSIC_CREDITS.md)

## Hai bản dựng: 84 giây và 30 giây

Mặc định là bản 84 giây. Bản **30 giây** (mở đầu 3.5s → cắt nhanh → ba cột → sinh hoạt/giao lưu/giải đấu → sân chơi lành mạnh → tuyển thành viên) chọn bằng `--profile=short`:

```sh
npm run audio:short
npm run render:short -- --width=1920 --fps=60 --out=output/VideoEsport-30s-1080p60.mp4
```

Profile khai báo trong `src/config.js` (`profiles`), các đoạn montage bản ngắn là `s1–s4` trong `src/montage.js`. Preview: `npm run dev` rồi mở `/?profile=short`. Nhạc/envelope bản ngắn lưu riêng (`soundtrack-short.mp3`, `envelope-short.json`).

## Dựng và xuất video đầy đủ (có nhạc, 1080p60)

Cần Node.js 22.12+ và FFmpeg trong PATH.

```sh
npm ci
npx playwright install chromium
npm run audio        # tải The Fury (kiểm tra SHA-256), cắt 84 giây, thêm SFX, tạo envelope ánh sáng
npm run check        # tùy chọn: kiểm tra asset, timeline, seek xác định
npm run render -- --width=1920 --fps=60 --out=output/VideoEsport-1080p60.mp4
```

- Xem thử một đoạn: thêm `--from=19 --to=31`. Xem nhanh: `--width=1280 --fps=30`.
- Render dựng từng khung hình trong trình duyệt nên chậm (1080p60 có thể mất nhiều giờ nếu không có GPU). Có thể chia đoạn bằng `--from/--to` rồi nối bằng FFmpeg.
- **Footage trong repo là H.264.** Chromium của Playwright trên Linux thường không giải mã được H.264 (lỗi "Không tải được footage"). Cách xử lý: đặt `CHROME_PATH` trỏ tới Google Chrome thật, hoặc tạm đổi `public/assets/montage/act*.mp4` sang VP9/WebM (`ffmpeg -i in.mp4 -an -c:v libvpx-vp9 -crf 24 -b:v 0 -g 1 -f webm out.mp4`) chỉ để render, **không commit bản đã đổi**.
- Nhạc: The Fury — Scott Buckley, CC BY 4.0. Giữ credit trong mô tả khi đăng. Cú cắt đặt theo lưới thời gian, chưa canh theo nhịp bản nhạc; có thể chỉnh trong `src/montage.js` sau khi nghe thử.
- Preview tương tác: `npm run dev` (cần đã chạy `npm run audio`).

## Dựng lại các đoạn montage

Các đoạn `public/assets/montage/act1–5.mp4` và `s1–s4.mp4` (1280×720, 30fps, không tiếng) được cắt từ footage nguồn trong `public/assets/trailers/`:

```sh
npm run montage            # tất cả; hoặc: npm run montage -- act2 act4
```

- `src/montage.js`: danh sách cú cắt (nguồn, giây bắt đầu, độ dài, tốc độ) — dùng chung cho script dựng và nhịp đập trong preview.
- `scripts/montage.mjs`: cắt vùng gameplay (bỏ bảng điểm/HUD), zoom nhẹ mỗi cú cắt, ghép ba cột, phủ tông màu.
- Muốn nét hơn ở 1080p: đổi `W,H` trong `scripts/montage.mjs` thành 1920×1080 rồi chạy lại `npm run montage`.

## Chỉnh sửa

- `src/config.js`: timeline, chữ động (`words`: giây trong cảnh, độ dài, dòng chữ, `/` xuống dòng), màu, cue SFX.
- `src/main.js`, `src/style.css`, `index.html`: bố cục, chữ động, camera đập, logo, hiệu ứng ánh sáng/hạt phim.
- `src/world.js`: cảnh 3D mở đầu và hội tụ (artwork Valorant 2.5D).
- `src/footage.js`: tải, phát và seek chính xác footage.
- `scripts/audio.mjs`, `scripts/render.mjs`, `scripts/check.mjs`: nhạc/SFX, xuất MP4, kiểm tra.
- Logo: `public/assets/logos/`.

## Lưu ý nội dung

- Ban đang trong giai đoạn trình đề án: video dùng từ "tuyển thành viên", các hoạt động ghi ở thì tương lai/định hướng. Không ghi tên game lên màn hình vì danh mục game từng giải do Ban Chủ nhiệm duyệt.
- Footage thuộc Garena, Riot Games, VNG/APL và các chủ sở hữu tương ứng (xem `docs/TRAILER_SOURCES.json`); chỉ minh họa, không phải hoạt động thật của Ban.
- Lời mời cuối đang ghi "Theo dõi fanpage CLB Tin học"; thay bằng link/QR đăng ký khi có.
