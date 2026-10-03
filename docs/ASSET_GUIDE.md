# Asset đã chuẩn bị

## Người dùng cung cấp

`files.zip`: 22 PNG nền trong suốt, kiểm tra có alpha. Gồm Miks, Veto, Waylay, Tejo, Deadlock, Gekko, Harbor, Neon, KAYO, Astra, Yoru, Skye, Breach, Raze, Sage, Sova, Cypher, Omen, Viper, Brimstone, Iso, Chamber.

Script import tạo WebP cao tối đa 1500 px, quality 88, giữ alpha và không ghi đè bản PNG gốc. Bản nháp đang dùng Neon/Omen/Cypher, có thể thay các nhân vật còn lại qua config. Không tự xác nhận tên/nguồn gốc ngoài tên file người dùng gửi.

## Tải thêm từ nguồn chính thức (2026-10-03)

| Game | Số lượng | Kích thước gốc | Nguồn |
|---|---:|---|---|
| Free Fire | 4 wallpaper ngang | Tất cả 1920×1080 | https://ff.garena.com/vn/wallpaper/ |
| Liên Quân | 3 artwork Krixi, Valhein, Triệu Vân | 1920×890 | https://lienquan.garena.vn/ |
| Liên Quân | 3 artwork Nakroth | 1920×1129, 1280×786, 1920×1180 | https://lienquan.garena.vn/hoc-vien/tuong-skin/d/nakroth/ |

`asset-sources.json` chứa URL ảnh gốc, trang nguồn, tên file và SHA-256. `npm run assets` chỉ tải 10 ảnh trong danh mục, kiểm tra checksum. File nguồn thay đổi thì script báo lỗi để người dựng xem lại, không âm thầm chấp nhận ảnh khác.

## Valorant bổ sung khi cần

- Media hub: https://playvalorant.com/en-us/media/
- Asset kit: https://playvalorant.com/en-gb/news/game-updates/valorant-asset-kit/
- Episode 8 Act I wallpaper ZIP, liên kết từ media hub: https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/1371084d631d25722a1e4b8d5df41d2ac6a70443.zip

Các nguồn Valorant bổ sung đã tìm thấy nhưng chưa tải trong bản này vì đã có 22 ảnh người dùng gửi.

## Phạm vi sử dụng

Đây là artwork từ nhà phát hành, không phải tài sản CC0. Không gọi đây là “miễn bản quyền”. Trang Valorant Media dẫn tới điều kiện sử dụng của Riot; bản dựng phát hành cần đối chiếu mục đích sử dụng. Với Garena, chưa xác minh giấy phép tái phân phối tổng quát. Lưu các ảnh trong bộ asset phục vụ dự án; repo công khai chỉ chứa danh mục nguồn và script tải.

Chưa thu thập model 3D, âm nhạc hoặc footage từ video của nhà sáng tạo khác. Cần gameplay riêng/được phép dùng và ảnh hoạt động CLB nếu muốn đoạn phim phản ánh hoạt động thật.
