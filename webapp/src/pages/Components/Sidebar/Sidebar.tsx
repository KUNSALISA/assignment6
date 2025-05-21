// Sidebar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose(); // ปิด sidebar ทุกครั้งที่มีการกดเมนู
  };

  return (
    <div className={`sidebar ${isVisible ? "visible" : ""}`}>
      <ul>
        {userRole === "Instructor" && (
          <>
            <li onClick={() => handleNavigate("/attendance")}>เช็คชื่อ</li>
            <li onClick={() => handleNavigate("/daily-detail")}>รายละเอียดรายวัน</li>
            <li onClick={() => handleNavigate("/summary")}>สรุปเวลาเรียน</li>
          </>
        )}
        {userRole === "Admin" && (
          <>
            <li onClick={() => handleNavigate("/daily-detail")}>รายละเอียดรายวัน</li>
            <li onClick={() => handleNavigate("/summary")}>สรุปเวลาเรียน</li>
            <li onClick={() => handleNavigate("/manage-student")}>จัดการข้อมูลนักศึกษา</li>
            <li onClick={() => handleNavigate("/manage-teacher")}>จัดการข้อมูลอาจารย์</li>
            <li onClick={() => handleNavigate("/manage-course")}>จัดการข้อมูลวิชาเรียน</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
