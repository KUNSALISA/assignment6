// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./LoginPage.css";
// import type { SignInInterface } from "../../Interface/IUser";
// import { SignIn, GetUserById } from "../../services/https";
// import Loading from "../Components/Loading/Loading";
// import Footer from "../Components/Footer/Footer";
// // import simpleAvatar from "../../assets/cat.png";

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const loginData: SignInInterface = { Username: username, Password: password };
//     const res = await SignIn(loginData);

//     if (res.status === 200) {
//       const userId = res.data.id;
//       localStorage.setItem("token_type", res.data.token_type);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("id", userId);

//       const userResponse = await GetUserById(userId);

//       if (userResponse.status === 200) {
//         const user = userResponse.data;

//         if (user.Status === "Inactive") {
//           setError("บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ");
//           localStorage.clear();
//           setLoading(false);
//           return;
//         }

//         localStorage.setItem("role", user.RoleID.toString());
//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             username: user.Username,
//             FirstName: user.FirstName,
//             LastName: user.LastName,
//           })
//         );

//         // const profilePictureUrl = user.ProfilePicture?.[0]?.FilePath
//         //   ? `http://api.se-elearning.online${user.ProfilePicture[0].FilePath}`
//         //   : simpleAvatar;

//         // localStorage.setItem("profilePicture", profilePictureUrl);

//         if (user.RoleID === 1) {
//           navigate("/attendance");
//         } else if (user.RoleID === 2) {
//           navigate("/daily-detail");
//         } else if (user.RoleID === 3) {
//           navigate("/Dashboard");
//         }
//       } else {
//         setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
//       }
//     } else {
//       setError(res.data?.error || "เข้าสู่ระบบไม่สำเร็จ");
//     }

//     setLoading(false);
//   };

//   return (
//     <>
//     <Footer/>
//     <div className="login-container">
//       <div className="login-card">
//         <h2 className="login-title">เข้าสู่ระบบ</h2>
//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label className="form-label">ชื่อผู้ใช้</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="form-input"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label">รหัสผ่าน</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-input"
//               required
//             />
//           </div>

//           {error && <p className="error-text">{error}</p>}

//           <button type="submit" className="login-button" disabled={loading}>
//             {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
//           </button>
//         </form>
//       </div>
//     </div>
//     </>
//   );
// };

// export default LoginPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import type { SignInInterface } from "../../Interface/IUser";
import { SignIn } from "../../services/https/TeacherService";
import Footer from "../Components/Footer/Footer";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loginData: SignInInterface = { username, password };
    const res = await SignIn(loginData);

    if (res.status === 200) {
      const data = res.data;

      localStorage.setItem("token_type", data.token_type);
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.user_id.toString());
      localStorage.setItem("role", data.role);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          FirstName: data.first_name,
          LastName: data.last_name,
        })
      );

      switch (data.role) {
        case "Admin":
          navigate("/daily-detail");
          break;
        case "Instructor":
          navigate("/attendance");
          break;
        default:
          navigate("/");
      }
    } else {
      setError(res.data?.error || "เข้าสู่ระบบไม่สำเร็จ");
    }

    setLoading(false);
  };

  return (
    <>
      <Footer />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">เข้าสู่ระบบ</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
