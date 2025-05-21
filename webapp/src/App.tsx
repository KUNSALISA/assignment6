// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import PrivateRoute from "./pages/PrivateRoute";
// import AttendancePage from "./pages/Attendance/AttendancePage";
// import LoginPage from "./pages/Login/LoginPage";
// import DailyDetail from "./pages/DailyDetail/DailyDetail";
// import Summary from "./pages/Summary/Summary";
// import StudentManagement from "./pages/StudentManagemant/StudentManagement";
// import CourseManagement from "./pages/CourseManagement/CourseManagement";
// import TeacherManagement from "./pages/TeacherManagement/TeacherManagement";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/attendance" element={<PrivateRoute><AttendancePage/></PrivateRoute>}/>
//           <Route path="/daily-detail" element={<PrivateRoute><DailyDetail/></PrivateRoute>}/>
//           <Route path="/summary" element={<PrivateRoute><Summary/></PrivateRoute>}/>
//           <Route path="/manage-student" element={<PrivateRoute><StudentManagement/></PrivateRoute>}/>
//           <Route path="/manage-course" element={<PrivateRoute><CourseManagement/></PrivateRoute>}/>
//           <Route path="/manage-teacher" element={<PrivateRoute><TeacherManagement/></PrivateRoute>}/>
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;


// App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PrivateRoute from "./pages/PrivateRoute";
import LoginPage from "./pages/Login/LoginPage";
import Attendance from "./pages/Attendance/AttendancePage";
import CourseManagement from "./pages/CourseManagement/CourseManagement";
import DailyDetail from "./pages/DailyDetail/DailyDetail";
import StudentManagement from "./pages/StudentManagemant/StudentManagement";
import Summary from "./pages/Summary/Summary";
import TeacherManagement from "./pages/TeacherManagement/TeacherManagement";

const App: React.FC = () => {
  return (
    <Router basename="/webapp">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/daily-detail" element={<DailyDetail/>}/>
        <Route path="/summary" element={<Summary/>}/>
        <Route path="/manage-student" element={<StudentManagement/>}/>
        <Route path="/manage-course" element={<CourseManagement/>}/>
        <Route path="/manage-teacher" element={<TeacherManagement/>}/>
      </Routes>
    </Router>
  );
};

export default App;

