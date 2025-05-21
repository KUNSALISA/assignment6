import axios from "axios";
import type { CourseInterface  } from "../../Interface/IUser";

const apiUrl = "http://localhost:5003";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function CreateCourse(data: CourseInterface) {
  return await axios
    .post(`${apiUrl}/courses`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// async function GetCourses() {
//   return await axios
//     .get(`${apiUrl}/courses`, requestOptions)
//     .then((res) => res.data)
//     .catch((e) => e.response);
// }

async function GetCourses() {
  return await axios
    .get(`${apiUrl}/courses/with-teacher`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

// async function GetAllCoursesWithTeachers() {
//   return await axios
//     .get(`${apiUrl}/courses/with-teacher`, requestOptions)
//     .then((res) => res.data)
//     .catch((e) => e.response);
// }

async function GetCourseByID(id: number) {
  return await axios
    .get(`${apiUrl}/courses/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateCourse(id: number, data: CourseInterface) {
  return await axios
    .put(`${apiUrl}/courses/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteCourse(id: number) {
  return await axios
    .delete(`${apiUrl}/courses/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  CreateCourse,
  GetCourses,
  GetCourseByID,
  UpdateCourse,
  DeleteCourse,
  // GetAllCoursesWithTeachers,
};