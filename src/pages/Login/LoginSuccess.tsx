// File: src/pages/LoginSuccess.tsx

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  // Hook này của react-router-dom giúp đọc các tham số trên URL (ví dụ: ?token=xyz)
  const [searchParams] = useSearchParams();

  // Dùng useEffect để chạy logic ngay khi component được render
  useEffect(() => {
    // Lấy giá trị của 'token' từ URL
    const token = searchParams.get("token");

    if (token) {
      // 1. Nếu có token, lưu nó vào localStorage
      console.log("Token found, saving to localStorage:", token);
      localStorage.setItem("authToken", token);

      // 2. Chuyển hướng về trang chủ VÀ tải lại toàn bộ trang.
      // Việc tải lại trang sẽ buộc Navbar phải đọc lại localStorage và cập nhật giao diện.
      window.location.href = "/";
    } else {
      // Nếu không có token, có thể đã có lỗi, quay về trang login
      console.error("No token found in URL, redirecting to login.");
      window.location.href = "/login?error=true";
    }

    // Mảng rỗng `[]` ở cuối đảm bảo effect này chỉ chạy một lần duy nhất
  }, [searchParams]);

  // Giao diện tạm thời trong lúc xử lý
  // return (
  //   <div style={{ padding: "40px", textAlign: "center", color: "white" }}>
  //     <h1>Login Successful!</h1>
  //     <p>Please wait, we are redirecting you...</p>
  //   </div>
  // );
};

export default LoginSuccess;
