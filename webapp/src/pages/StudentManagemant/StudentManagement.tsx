import React, { useEffect, useState } from "react";
import "./StudentManagement.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Swal from "sweetalert2";
import { CreateStudent, GetStudents, UpdateStudent, DeleteStudent } from "../../services/https/StudentService"
import { StudentInterface } from "../../Interface/IUser";
import { Modal, Input, Button } from "antd";

const StudentManagement: React.FC = () => {
  const [studentList, setStudentList] = useState<StudentInterface[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<StudentInterface>({ studentId: "", name: "" });

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await GetStudents();
      console.log("sdfghjkl;", response)
      if (response && response.data) {
        setStudentList(response.data);
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    if (!form.studentId || !form.name) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "warning");
      return;
    }

    if (isEditMode && editingId !== null) {
      const response = await UpdateStudent(editingId, form);
      if (response && response.data) {
        setStudentList((prevList) =>
          prevList.map((student) =>
            student.id === editingId ? { ...student, ...form } : student
          )
        );
        Swal.fire("แก้ไขข้อมูลสำเร็จ!", "", "success");
      }
    } else {
      const response = await CreateStudent(form);
      if (response && response.data) {
        setStudentList([...studentList, response.data]);
        Swal.fire("เพิ่มนักศึกษาสำเร็จ!", "", "success");
      }
    }

    setForm({ studentId: "", name: "" });
    setEditingId(null);
    setIsEditMode(false);
    setModalVisible(false);
  };

  const handleDeleteStudent = async (id: number) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลนักศึกษาคนนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await DeleteStudent(id);
        if (response && response.data) {
          setStudentList(studentList.filter((student) => student.id !== id));
          Swal.fire("ลบสำเร็จ!", "ข้อมูลนักศึกษาถูกลบแล้ว", "success");
        }
      }
    });
  };

  const handleEditStudent = (student: StudentInterface) => {
    setForm({ studentId: student.studentId, name: student.name });
    setEditingId(student.id!);
    setIsEditMode(true);
    setModalVisible(true);
  };

  return (
    <>
      <Header />
      <h2>จัดการข้อมูลนักเรียน</h2>

      <div className="filter-section">
        <button
          className="add-button"
          onClick={() => {
            setForm({ studentId: "", name: "" });
            setIsEditMode(false);
            setEditingId(null);
            setModalVisible(true);
          }}
        >
          + เพิ่มนักศึกษาใหม่
        </button>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>เลขที่</th>
            <th>เลขประจำตัว</th>
            <th>ชื่อ-สกุล</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {studentList.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditStudent(student)}
                >
                  แก้ไข
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteStudent(student.id!)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title={isEditMode ? "แก้ไขข้อมูลนักศึกษา" : "เพิ่มนักศึกษาใหม่"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setModalVisible(false)}
            style={{
              backgroundColor: "#f0f0f0",
              color: "#333",
            }}
          >
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#28a745",
              borderColor: "#28a745",
            }}
          >
            {isEditMode ? "อัปเดต" : "บันทึก"}
          </Button>,
        ]}
      >
        <Input
          placeholder="เลขประจำตัว"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          style={{ width: "100%", marginBottom: 15 }}
        />
        <Input
          placeholder="ชื่อ-สกุล"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ width: "100%", marginBottom: 15 }}
        />
      </Modal>

      <Footer />
    </>
  );
};

export default StudentManagement;