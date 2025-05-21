import React, { useState, useEffect } from "react";
import "./Summary.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { GetAttendanceByCourse } from "../../services/https/AttendanceService"; 
import { GetCourseByID } from "../../services/https/CourseService"; 
import { CourseInterface, StudentAttendanceInterface } from "../../Interface/IUser";

const Summary: React.FC = () => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [students, setStudents] = useState<StudentAttendanceInterface[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [subject, setSubject] = useState("");

const userID = Number(localStorage.getItem("user_id"));

  // ดึงวิชาของครูเมื่อ component โหลดขึ้นมา
  useEffect(() => {
    const fetchCourses = async () => {
      if (!userID) return;

      const res = await GetCourseByID(userID);
      if (res && res.data) {
        setCourses(res.data);
      }
    };
    fetchCourses();
  }, [userID]);

  // ดึงข้อมูลนักเรียนและการมาเรียนตามวิชา
  const handleShowData = async () => {
    if (!subject) return;

    const res = await GetAttendanceByCourse(parseInt(subject));
    if (res && res.data) {
      setStudents(res.data);
    }
  };

  const getAttendancePercentage = (student: StudentAttendanceInterface) => {
    const total = student.present + student.sick + student.leave + student.absent;
    if (total === 0) return 0;
    return Math.round((student.present / total) * 100);
  };

  return (
    <>
      <Header />
      <Footer />
      <div className="summary-container">
        <h2>สรุปการมาเรียน</h2>
        <div className="filter-section">
          <label>
            วิชา:
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">-- เลือกวิชา --</option>
              {courses.map((course) => (
                <option key={course.ID} value={course.ID}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            วันที่:
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </label>
          <button className="btn-show" onClick={handleShowData}>แสดงข้อมูล</button>
        </div>

        <table className="summary-table">
          <thead>
            <tr>
              <th>เลขที่</th>
              <th>ชื่อ-สกุล</th>
              <th>มาเรียน (วัน)</th>
              <th>ป่วย (วัน)</th>
              <th>ลา (วัน)</th>
              <th>ขาด (วัน)</th>
              <th>เปอร์เซ็นต์การมาเรียน</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const percent = getAttendancePercentage(s);
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.present}</td>
                  <td>{s.sick}</td>
                  <td>{s.leave}</td>
                  <td>{s.absent}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <span>{percent}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Summary;
