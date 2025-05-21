import React, { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import "./AttendancePage.css";
import Swal from "sweetalert2";
import { GetAttendances } from "../../services/https/AttendanceService"; // <-- import
import type { AttendanceInterface } from "../../Interface/IUser"; // <-- import

interface Student {
  id: number;
  studentId: string;
  name: string;
  status: "มาเรียน" | "ป่วย" | "ลา" | "ขาด";
  behavior: string;
}

const AttendancePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(" ");

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    const res = await GetAttendances();

    if (res && res.status === 200) {
      const data: AttendanceInterface[] = res.data;

      const formatted: Student[] = data
        .filter((att) => att.Student !== undefined && att.Student !== null)
        .map((att, index) => ({
          id: index + 1,
          studentId: att.Student!.studentId!,
          name: att.Student!.name!,
          status: convertStatus(att.Status),
          behavior: "", // default behavior as empty string
        }));

      setStudents(formatted);
    } else {
      Swal.fire({
        icon: "error",
        title: "ดึงข้อมูลไม่สำเร็จ",
        text: res?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลการเข้าเรียน",
      });
    }
  };

  const convertStatus = (status: string): Student["status"] => {
    switch (status) {
      case "Present":
        return "มาเรียน";
      case "Sick":
        return "ป่วย";
      case "Leave":
        return "ลา";
      case "Absent":
      default:
        return "ขาด";
    }
  };

  const handleStatusChange = (id: number, newStatus: Student["status"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const getRowColor = (status: string) => {
    switch (status) {
      case "มาเรียน":
        return "row-green";
      case "ขาด":
        return "row-red";
      case "ป่วย":
        return "row-yellow";
      case "ลา":
        return "row-blue";
      default:
        return "";
    }
  };

  const handleSave = () => {
    const attendanceData = {
      date,
      students,
    };
    console.log("บันทึกข้อมูล:", attendanceData);

    Swal.fire({
      icon: "success",
      title: "บันทึกสำเร็จ!",
      text: "บันทึกข้อมูลเรียบร้อยแล้ว",
      confirmButtonText: "ตกลง",
    });
  };

  return (
    <div className="attendance-container">
      <Header />
      <Footer />

      <div className="attendance-content">
        <h1 className="attendance-title">
          <select defaultValue="">
            <option value="" disabled>
              เลือกวิชา
            </option>
            <option value="1">วิชา 1</option>
            <option value="2">วิชา 2</option>
          </select>
        </h1>

        <div className="attendance-header">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>เลขประจำตัว</th>
              <th>ชื่อ-สกุล</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className={getRowColor(student.status)}>
                <td>{student.id}</td>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td className="status-buttons">
                  {["มาเรียน", "ป่วย", "ลา", "ขาด"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(
                          student.id,
                          status as Student["status"]
                        )
                      }
                      className={student.status === status ? "active" : ""}
                    >
                      {status}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="save-button-container">
          <button onClick={handleSave} className="save-button">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
