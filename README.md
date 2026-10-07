# VideoEsport — Trailer v4, không giọng đọc

Bản dựng ngang **84 giây**, khôi phục artwork/camera/hiệu ứng của v3 và xen **cảnh thi đấu từ trailer VCT + cinematic game**. Đã bỏ hoạt cảnh rig tự làm, giọng nam Việt và clip luyện kỹ năng Neon của bản thử trước.

- VALORANT: Neon → Omen → Yoru → Viper, tiếp đến reel VCT/Kickoff/Masters Bangkok.
- Free Fire: artwork v3 và cinematic chính thức.
- Liên Quân: giữ artwork Nakroth → Triệu Vân → Valhein của v3; chưa có footage riêng.
- Âm thanh: The Fury + SFX, không voice-over. Audio footage luôn tắt.

[Timeline, phân loại footage và tình trạng](docs/TRAILERS.md) · [Nguồn clip/checksum](docs/TRAILER_SOURCES.json) · [Credit nhạc](docs/MUSIC_CREDITS.md)

## Chạy

Cần Node.js 22.12+ và FFmpeg trong PATH.

```sh
npm ci
npm run setup
npm run dev
```

Ảnh và các clip đã cắt có trong repo. `setup` tải nhạc gốc theo checksum và phối soundtrack 84 giây. Preview có phát/dừng, tua, tắt tiếng và toàn màn hình.

## Kiểm tra và xuất MP4

```sh
npx playwright install chromium
npm run check
npm run build
npm run render -- --width=1920 --fps=30 --out=output/VideoEsport-v4-no-voice.mp4
```

Có thể đặt `CHROME_PATH` trỏ tới Chromium sẵn có. Để thử một đoạn, thêm `--from=22 --to=26`. Renderer chờ footage giải mã đúng thời điểm trước khi chụp mỗi frame; không tải video qua mạng trong khi render.

## Chỉnh sửa

- `src/config.js`: timeline 84 giây, đoạn video, in-point, chữ, màu và cue nhạc.
- `src/world.js`: renderer artwork v3 được giữ nguyên.
- `src/footage.js`: preload, phát/dừng và seek frame của highlight/cinematic.
- `src/main.js`, `src/style.css`: bố cục, typography và điều khiển.
- `scripts/audio.mjs`, `scripts/render.mjs`: nhạc/SFX và xuất MP4.

Artwork vẫn là 2D trong không gian 3D, không phải nhân vật có skeleton. Repo không chứa rig và giọng đọc đã bị yêu cầu loại bỏ. Asset game thuộc các chủ sở hữu tương ứng; xem hướng dẫn nguồn và credit trong `docs/`.
