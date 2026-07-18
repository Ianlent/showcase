> **Lưu ý:** Đây là dự án vẫn đang được phát triển.

## 📌 Tổng quan dự án (Project Overview)

Dự án hướng tới giải quyết bài toán vận hành liên tục cho các chuỗi cửa hàng bán lẻ ngay cả khi mất kết nối mạng Internet. Hệ thống được chia tách rõ ràng thành 2 phân hệ:

1. **Lớp vận hành local (Monolith):** Ứng dụng PERN stack chạy tại từng cửa hàng để đảm bảo tính toàn vẹn dữ liệu giao dịch (ACID) tuyệt đối tại chỗ.
2. **Lớp truyền thông đồng bộ (Distributed Mesh Layer):** Kết nối các cửa hàng với nhau qua giao thức Gossip mạng ngang hàng, sử dụng Event Sourcing và Version Vectors để đồng bộ dữ liệu (Eventual Consistency) mà không phụ thuộc vào Cloud tập trung.

> **Lưu ý:** Repo này là code cho lớp vận hành(Monolith) vẫn đang trong quá trình phát triển. Lớp truyền thông vẫn đang ở khâu thiết kế và chưa được code.

## 🚀 Các kỹ thuật đã hiện thực hóa trong Repository này

### 1. Kiểm soát đồng thời (Concurrency Control)

- **Vấn đề:** Tranh chấp dữ liệu (Race condition) khi nhiều nhân viên cùng thao tác trên một đơn hàng.
- **Giải pháp:** Triển khai cơ chế khóa bi quan (Pessimistic Locking) ở mức dòng (Row-level) với một thứ tự khóa nghiêm ngặt (Strict locking order).
- **Mã nguồn chứng minh:** Xem chi tiết tại `backend/services/orderService.js` và `backend/services/ServiceHelper/orderLogic.js`.

### 2. Thiết kế API chống lỗi mạng (Idempotent API)

- **Vấn đề:** Khách hàng bị trừ tiền/điểm nhiều lần do mạng chập chờn khiến Request bị gửi lại.
- **Giải pháp:** Tự viết Middleware xử lý Idempotency Key. Băm (Hash) phương thức, đường dẫn và thân Request (SHA-256), lưu trữ trạng thái trong PostgreSQL để phân giải các Request trùng lặp.
- **Mã nguồn chứng minh:** Xem `backend/middleware/handleIdempotency.js` và `backend/repositories/idempotencyRepository.js` cùng với biểu đồ.

### 3. Tối ưu hóa Cơ sở dữ liệu (Database Tuning)

- **Vấn đề:** Tìm kiếm văn bản tiếng Việt chậm chạp trên tập dữ liệu lớn; bảo vệ toàn vẹn dữ liệu phi chuẩn hóa.
- **Giải pháp:**
    - Sử dụng định danh `UUIDv7` sắp xếp theo thời gian để tối ưu hóa indexing.
    - Tạo các cột dữ liệu phi chuẩn hóa dạng không dấu (`f_unaccent`), kết hợp với chỉ mục **GIN (Trigram Index)** giúp tăng tốc độ tìm kiếm mờ (Fuzzy matching).
    - Chuyển giao logic bảo vệ toàn vẹn dữ liệu (tính tổng tiền, soft-deletes) cho Database Triggers.
- **Mã nguồn chứng minh:** Xem chi tiết Schema và Triggers tại `backend/postgresForSetup/pos.sql` với biểu đồ.

### 4. Quản lý trạng thái Frontend

- **Giải pháp:** Sử dụng Redux Toolkit và **RTK Query** để tổ chức bộ nhớ đệm (Client-side caching), tối ưu luồng gọi API, giảm thiểu request thừa và đồng bộ trạng thái giao diện mượt mà.

---
