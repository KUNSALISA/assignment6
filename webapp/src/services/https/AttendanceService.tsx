import axios from "axios";
import type { AttendanceInterface  } from "../../Interface/IUser";
const apiUrl = "http://localhost:5004";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function GetAttendances() {
  return await axios
    .get(`${apiUrl}/attendances`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAttendanceByID(id: number) {
  return await axios
    .get(`${apiUrl}/attendances/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateAttendance(id: number, data: AttendanceInterface) {
  return await axios
    .put(`${apiUrl}/attendances/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteAttendance(id: number) {
  return await axios
    .delete(`${apiUrl}/attendances/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function MarkAttendance(data: AttendanceInterface) {
  return await axios
    .post(`${apiUrl}/mark-attendance`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAttendanceByCourse(courseID: number) {
  return await axios
    .get(`${apiUrl}/attendances/course/${courseID}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAttendanceByStudent(studentID: number) {
  return await axios
    .get(`${apiUrl}/attendances/student/${studentID}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  GetAttendances,
  GetAttendanceByID,
  UpdateAttendance,
  DeleteAttendance,
  MarkAttendance,
  GetAttendanceByCourse,
  GetAttendanceByStudent,
};
