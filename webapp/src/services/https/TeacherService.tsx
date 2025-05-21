import axios from 'axios';
import type { SignInInterface, TeacherInterface } from "../../Interface/IUser";

//const apiUrl = "http://teacher-service:5001";
const apiUrl = "http://localhost:5001";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetAllTeachers() {
  return await axios
    .get(`${apiUrl}/teacher-all`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetTeacherByID(id: number) {
  return await axios
    .get(`${apiUrl}/teacher/${id}`, requestOptions)
    .then((res) => res.data)
    .catch((e) => e.response);
}

async function CreateTeacher(data: TeacherInterface) {
  return await axios
    .post(`${apiUrl}/teacher`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateTeacher(id: number, data: TeacherInterface) {
  return await axios
    .patch(`${apiUrl}/teacher-edit/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteTeacher(id: number) {
  return await axios
    .delete(`${apiUrl}/teacher-delete/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

export {
  SignIn,
  GetAllTeachers,
  GetTeacherByID,
  CreateTeacher,
  UpdateTeacher,
  DeleteTeacher,
};
