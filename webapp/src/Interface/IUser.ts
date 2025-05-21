export interface SignInInterface{
    username: string;
    password: string;
}

export interface RoleInterface {
  ID?: number;
  Role: string;
}
export interface TeacherInterface {
  ID?: number;
  title?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  role_id?: number;
  role?: RoleInterface;
}

export interface StudentInterface {
  id?: number;
  studentId?: string;
  name?: string;
}

export interface CourseInterface {
  ID?: number;
  code?: string;
  name?: string;
  teacher_id?: number;
  teacher?: TeacherInterface; 
}

export interface AttendanceInterface {
  ID?: number;
  StudentID: number;
  CourseID: number;
  Date: Date;
  Status: string;

  Student?: StudentInterface;
  Course?: CourseInterface;
}

export interface StudentAttendanceInterface {
  id: number;
  name: string;
  present: number;
  sick: number;
  leave: number;
  absent: number;
}

