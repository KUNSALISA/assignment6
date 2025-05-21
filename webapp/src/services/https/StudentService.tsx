import axios from "axios";
import type { StudentInterface } from "../../Interface/IUser";

const apiUrl = "http://localhost:5002";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function CreateStudent(data: StudentInterface) {
  return await axios
    .post(`${apiUrl}/students`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetStudents() {
  return await axios
    .get(`${apiUrl}/students`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetStudentByID(id: number) {
  return await axios
    .get(`${apiUrl}/students/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateStudent(id: number, data: StudentInterface) {
  return await axios
    .put(`${apiUrl}/students/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteStudent(id: number) {
  return await axios
    .delete(`${apiUrl}/students/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  CreateStudent,
  GetStudents,
  GetStudentByID,
  UpdateStudent,
  DeleteStudent,
};