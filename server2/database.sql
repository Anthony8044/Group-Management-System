CREATE DATABASE gms;

CREATE TABLE alluser(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    given_name VARCHAR(255) NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_img VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teacher(
    teacher_id VARCHAR(255) PRIMARY KEY,
    user_id_fk uuid NOT NULL,
    department VARCHAR(255) NOT NULL,
    postition VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    notification_email BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_user_id FOREIGN KEY(user_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE
);

CREATE TABLE student(
    student_id VARCHAR(255) PRIMARY KEY,
    user_id_fk uuid NOT NULL,
    study_program VARCHAR(255) NOT NULL,
    study_year VARCHAR(255) NOT NULL,
    strenghts VARCHAR(255),
    weeknesses VARCHAR(255),
    description VARCHAR(255),
    personality_type VARCHAR(255),
    notification_email BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_user_id FOREIGN KEY(user_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE
);

CREATE TABLE course(
    course_id VARCHAR(255) PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    course_section VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_course(
    user_id uuid REFERENCES alluser(user_id) ON DELETE CASCADE,
    course_id VARCHAR(255) REFERENCES course(course_id) ON DELETE CASCADE,
    course_role VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id, course_id)
);

CREATE TABLE project(
    project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id_fk VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    submission_date VARCHAR(255) NOT NULL,
    students_per_group VARCHAR(255) NOT NULL,
    formation_type VARCHAR(255) NOT NULL,
    project_description VARCHAR(255),
    user_id_fk uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_id FOREIGN KEY(course_id_fk) REFERENCES course(course_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY(user_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE
);

create view student_course as
select alluser.user_id, user_course.course_id, user_course.course_role, student.student_id, alluser.given_name, alluser.family_name, alluser.email, student.study_program, student.study_year
from alluser, student, user_course
where alluser.user_id=user_course.user_id AND alluser.user_id=student.user_id_fk;

create view teacher_course as
select alluser.user_id, user_course.course_id, user_course.course_role, teacher.teacher_id, alluser.given_name, alluser.family_name, alluser.email, teacher.department, teacher.postition
from alluser, teacher, user_course
where alluser.user_id=user_course.user_id AND alluser.user_id=teacher.user_id_fk;

insert into course(course_id, course_code, course_title, course_section) VALUES ( 'COMP4035-1', 'COMP4035',
'Math', '1');

insert into course(course_id, course_code, course_title, course_section) VALUES ('ENG2055-1', 'ENG2055', 'English', '1');
insert into user_course(user_id, course_id, course_role) VALUES ('34302cf6-a23f-428a-bce5-aa8c00d612c8', 'COMP3080-1', 'Student');

INSERT INTO student (
    given_name,
    family_name,
    gender,
    role,
    email,
    password,
    student_number,
    study_program,
    study_year
  ) VALUES (
    'Anthony',
    'Stoltzfus',
    'Male',
    'Student',
    'anthonystoltzfus@gmail.com',
    '123123',
    '18208568',
    'Computer Science',
    'Year 3'
);

INSERT INTO student (
    student_id,
    user_id_fk,
    study_program,
    study_year
  ) VALUES (
    '18208562',
    '34302cf6-a23f-428a-bce5-aa8c00d612c8',
    'Computer Science',
    'Year 4'
);

INSERT INTO teacher (
    teacher_number,
    user_id_fk,
    department,
    postition
  ) VALUES (
    '12345678',
    'b374a60e-cc37-4fc4-984b-dae70d29ce45',
    'Computer Science',
    'Head Teacher'
);

INSERT INTO alluser (
    given_name,
    family_name,
    gender,
    role,
    email,
    password
  ) VALUES (
    'Samantha',
    'Chan',
    'Female',
    'Teacher',
    'anthonystoltzfus3@gmail.com',
    '123123'
);

INSERT INTO alluser (
    given_name,
    family_name,
    gender,
    role,
    email,
    password
  ) VALUES (
    'Sarah',
    'Lee',
    'Female',
    'Student',
    'anthonystoltzfus2@gmail.com',
    '123123'
);

SELECT *
    FROM alluser u, teacher t
    WHERE u.user_id = 'b374a60e-cc37-4fc4-984b-dae70d29ce45' AND t.user_id_fk = 'b374a60e-cc37-4fc4-984b-dae70d29ce45';

SELECT e.course_id, array_agg(te.user_id) AS student_user_id
  FROM course e 
  LEFT JOIN student_course te on e.course_id=te.course_id 
  LEFT JOIN alluser t on te.user_id=t.user_id 
  GROUP BY e.course_id;
