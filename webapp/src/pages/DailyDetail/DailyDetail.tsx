import React, { useEffect, useState } from "react";
import "./DailyDetail.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { GetAttendances } from "../../services/https/AttendanceService";
import { AttendanceInterface } from "../../Interface/IUser";
import { GetCourseByID } from "../../services/https/CourseService";

interface CourseInterface {
  ID: number;
  Code: string;
  Name: string;
  TeacherID: number;
}

const DailyDetail: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<AttendanceInterface[]>([]);
  const [courses, setCourses] = useState<CourseInterface[]>([]);

  const userID = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchData = async () => {
      // โหลดข้อมูลการเข้าเรียน
      const res = await GetAttendances();
      if (res && res.data) {
        setAttendanceData(res.data);
      }

      // โหลดรายวิชาของอาจารย์จาก userID
      if (userID) {
        const courseRes = await GetCourseByID(parseInt(userID));
        if (courseRes && courseRes.data) {
          setCourses(courseRes.data);
          // ตั้งชื่อวิชาเริ่มต้นเป็นวิชาแรกที่ได้จาก API
          if (courseRes.data.length > 0) {
            setSubject(courseRes.data[0].Name);
          }
        }
      }
    };

    fetchData();
  }, [userID]);

  // กรองข้อมูลการเข้าเรียนตามวันที่และวิชา
  const filteredData = attendanceData.filter((entry) => {
    if (!entry.Date) return false;
    const formattedEntryDate = new Date(entry.Date).toISOString().split("T")[0];
    const matchDate = selectedDate ? formattedEntryDate === selectedDate : true;
    const matchSubject = subject ? entry.Course?.name === subject : true;
    return matchDate && matchSubject;
  });

  const calculateAttendanceSummary = () => {
    const total = filteredData.length;
    const present = filteredData.filter((e) => e.Status === "มา").length;
    const late = filteredData.filter((e) => e.Status === "สาย").length;
    const absent = filteredData.filter((e) => e.Status === "ขาด").length;

    return {
      present,
      late,
      absent,
      presentPercentage: total ? ((present / total) * 100).toFixed(2) : "0.00",
      latePercentage: total ? ((late / total) * 100).toFixed(2) : "0.00",
      absentPercentage: total ? ((absent / total) * 100).toFixed(2) : "0.00",
    };
  };

  const {
    present,
    late,
    absent,
    presentPercentage,
    latePercentage,
    absentPercentage,
  } = calculateAttendanceSummary();

  return (
    <>
      <Header />
      <Footer />
      <div className="daily-detail-container">
        <h2>
          รายละเอียดการเข้าเรียนประจำวันที่ {selectedDate || "เลือกวันที่"}
        </h2>

        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {courses.map((course, index) => (
            <option key={index} value={course.Name}>
              {course.Name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-picker"
        />

        <table className="daily-detail-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รหัสนักเรียน</th>
              <th>ชื่อ-สกุล</th>
              <th>เวลาเข้าเรียน</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.Student?.studentId}</td>
                <td>{student.Student?.name}</td>
                {/* <td>{student.time}</td> */}
                <td className={`status ${student.Status}`}>{student.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedDate && (
          <div className="attendance-summary">
            <h3>สรุปการเข้าเรียน</h3>
            <p>มาเรียน: {present} คน ({presentPercentage}%)</p>
            <p>สาย: {late} คน ({latePercentage}%)</p>
            <p>ขาดเรียน: {absent} คน ({absentPercentage}%)</p>
          </div>
        )}
      </div>
    </>
  );
};

export default DailyDetail;
