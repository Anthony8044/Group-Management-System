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

insert into course(course_id, course_code, course_title, course_section) VALUES ( 'COMP3080-1', 'COMP3080',
'Math', '1');

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
    'Anthony',
    'Stoltzfus',
    'Male',
    'Student',
    'anthonystoltzfus@gmail.com',
    '123123'
);

SELECT *
    FROM alluser u, teacher t
    WHERE u.user_id = 'b374a60e-cc37-4fc4-984b-dae70d29ce45' AND t.user_id_fk = 'b374a60e-cc37-4fc4-984b-dae70d29ce45';
