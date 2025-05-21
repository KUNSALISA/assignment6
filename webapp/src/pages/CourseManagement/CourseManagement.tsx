import React, { useState, useEffect } from "react";
import "./CourseManagement.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Swal from "sweetalert2";
import { CourseInterface, TeacherInterface } from "../../Interface/IUser";
import { GetCourses } from "../../services/https/CourseService";
import { GetAllTeachers } from "../../services/https/TeacherService";

import { Modal, Input, Select, Button } from "antd";

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [teachers, setTeachers] = useState<TeacherInterface[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  const [form, setForm] = useState<CourseInterface>({
    code: "",
    name: "",
    teacher_id: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const courseRes = await GetCourses();
      console.log("sdfghjkl; courseRes", courseRes)
      if (courseRes) {
        setCourses(courseRes);
      }

      const teacherRes = await GetAllTeachers();
      console.log("sdfghjkl; teacherRes", teacherRes.data)
      if (teacherRes.data) {
        setTeachers(teacherRes.data);
      }
    };

    fetchData();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setForm({ code: "", name: "", teacher_id: 0 });
    setModalVisible(true);
  };

  const openEditModal = (course: CourseInterface) => {
    setIsEditMode(true);
    setEditingCourseId(course.ID!);
    setForm({
      code: course.code,
      name: course.name,
      teacher_id: course.teacher_id,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "ต้องการลบข้อมูลวิชานี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setCourses(courses.filter((course) => course.ID !== id));
        Swal.fire("ลบสำเร็จ!", "ข้อมูลรายวิชาถูกลบแล้ว", "success");
      }
    });
  };

  const handleSubmit = () => {
    if (!form.code || !form.name || form.teacher_id === 0) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบ", "", "warning");
      return;
    }

    if (isEditMode && editingCourseId !== null) {
      setCourses((prev) =>
        prev.map((c) => (c.ID === editingCourseId ? { ...c, ...form } : c))
      );
      Swal.fire("อัปเดตข้อมูลสำเร็จ", "", "success");
    } else {
      const newId = (courses[courses.length - 1]?.ID ?? 0) + 1;


      const newCourse: CourseInterface = {
        ID: newId,
        code: form.code,
        name: form.name,
        teacher_id: form.teacher_id,
        teacher: undefined, // หรือ null หรือค่าจริง ถ้ามี
      };

      setCourses((prev) => [...prev, newCourse]);
      Swal.fire("เพิ่มวิชาเรียบร้อย", "", "success");
    }

    setModalVisible(false);
    setForm({ code: "", name: "", teacher_id: 0 });
    setEditingCourseId(null);
    setIsEditMode(false);
  };

  // const getTeacherName = (teacher_id: number): string => {
  //   const teacher = teachers.find((t) => t.ID === teacher_id);
  //   return teacher ? `${teacher.FirstName} ${teacher.LastName}` : "ไม่พบข้อมูล";
  // };

  return (
    <>
      <Header />
      <div className="course-container">
        <h2>จัดการข้อมูลวิชาเรียน</h2>
        <button className="add-button" onClick={openAddModal}>
          + เพิ่มวิชาเรียนใหม่
        </button>
        <table className="course-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>อาจารย์ผู้สอน</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={course.ID}>
                  <td>{index + 1}</td>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>
                    {(() => {
                      const teacher = teachers.find(t => t.ID === course.teacher_id);
                      return teacher
                        ? `${teacher.first_name} ${teacher.last_name}`
                        : "ไม่พบข้อมูล";
                    })()}
                  </td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => openEditModal(course)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(course.ID!)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title={isEditMode ? "แก้ไขข้อมูลวิชา" : "เพิ่มวิชาใหม่"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            ยกเลิก
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
          >
            {isEditMode ? "อัปเดต" : "บันทึก"}
          </Button>,
        ]}
        width="30%"
        bodyStyle={{ padding: 20, fontSize: 20 }}
      >
        <Input
          placeholder="รหัสวิชา"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          style={{ marginBottom: 15 }}
        />
        <Input
          placeholder="ชื่อวิชา"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ marginBottom: 15 }}
        />
        <Select
          placeholder="เลือกอาจารย์ผู้สอน"
          value={form.teacher_id || undefined}
          onChange={(value) => setForm({ ...form, teacher_id: Number(value) })}
          style={{ width: "100%" }}
        >
          {teachers.length === 0 ? (
            <Select.Option disabled>ไม่มีข้อมูลอาจารย์</Select.Option>
          ) : (
            teachers.map((t) => (
              <Select.Option key={t.ID} value={t.ID}>
                {t.first_name} {t.last_name}
              </Select.Option>
            ))
          )}
        </Select>
      </Modal>

      <Footer />
    </>
  );
};

export default CourseManagement;
