import React, { useEffect, useState } from "react";
import "./TeacherManagement.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Swal from "sweetalert2";
import { TeacherInterface } from "../../Interface/IUser";
import { GetAllTeachers, CreateTeacher, UpdateTeacher, DeleteTeacher } from "../../services/https/TeacherService";
import { Modal, Button, Input } from "antd";

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherInterface[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState<TeacherInterface>({
    ID: 0,
    title: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    role_id: 2,
    role: { ID: 2, Role: "Instructor" },
  });


  useEffect(() => {
    const fetchTeachers = async () => {
      const res = await GetAllTeachers();
      console.log("sdfghjkl;", res)
      if (res?.data) {
        setTeachers(res.data);
      }
    };
    fetchTeachers();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setForm({
      ID: 0,
      title: "",
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      role_id: 2,
      role: { ID: 2, Role: "Instructor" },
    });
    setModalVisible(true);
  };

  const openEditModal = (teacher: TeacherInterface) => {
    setIsEditMode(true);
    setForm({ ...teacher });
    setModalVisible(true);
  };

  const handleDeleteTeacher = async (id: number) => {
    const result = await Swal.fire({
      title: "ต้องการลบข้อมูลอาจารย์คนนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      const res = await DeleteTeacher(id);
      if (res?.status === 200) {
        setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.ID !== id));
        Swal.fire("ลบสำเร็จ!", "ข้อมูลอาจารย์ถูกลบแล้ว", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
      }
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.first_name || !form.last_name || !form.username || !form.password) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "warning");
      return;
    }

    if (isEditMode) {
      if (form.ID === undefined) {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่พบรหัสอาจารย์", "error");
        return;
      }

      const res = await UpdateTeacher(form.ID, form);
      if (res?.status === 200) {
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) => (teacher.ID === form.ID ? { ...form } : teacher))
        );
        Swal.fire("อัปเดตข้อมูลสำเร็จ", "", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้", "error");
      }
    } else {
      const res = await CreateTeacher(form);
      if (res?.status === 201) {
        setTeachers((prevTeachers) => [...prevTeachers, { ...form, ID: res.data.ID }]);
        Swal.fire("เพิ่มข้อมูลสำเร็จ", "", "success");
      } else {
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้", "error");
      }
    }
    setModalVisible(false);
  };

  return (
    <>
      <Header />
      <div className="teacher-container">
        <h2>จัดการข้อมูลอาจารย์</h2>
        <button className="add-button" onClick={openAddModal}>
          + เพิ่มอาจารย์ใหม่
        </button>
        <table className="teacher-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>คำนำหน้า</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>ชื่อผู้ใช้</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.ID}>
                <td>{index + 1}</td>
                <td>{teacher.title}</td>
                <td>{teacher.first_name}</td>
                <td>{teacher.last_name}</td>
                <td>{teacher.username}</td>
                <td>
                  <button className="edit-button" onClick={() => openEditModal(teacher)}>
                    แก้ไข
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteTeacher(teacher.ID!)}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={isEditMode ? "แก้ไขข้อมูลอาจารย์" : "เพิ่มอาจารย์ใหม่"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width="30%"
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            ยกเลิก
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {isEditMode ? "อัปเดต" : "บันทึก"}
          </Button>,
        ]}
      >
        <Input
          placeholder="คำนำหน้า"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ marginBottom: 15 }}
        />
        <Input
          placeholder="ชื่อ"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          style={{ marginBottom: 15 }}
        />
        <Input
          placeholder="นามสกุล"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          style={{ marginBottom: 15 }}
        />
        <Input
          placeholder="ชื่อผู้ใช้"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={{ marginBottom: 15 }}
        />
        <Input
          placeholder="รหัสผ่าน"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ marginBottom: 15 }}
          type="password"
        />
      </Modal>

      <Footer />
    </>
  );
};

export default TeacherManagement;