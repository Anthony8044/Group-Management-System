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
    course_title VARCHAR(255) NOT NULL,
    instructor_id_fk uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY(instructor_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE
);

CREATE TABLE user_course(
    user_id uuid REFERENCES alluser(user_id) ON DELETE CASCADE,
    course_id VARCHAR(255) REFERENCES course(course_id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, course_id)
);

CREATE TABLE project(
    project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    group_submission_date VARCHAR(255) NOT NULL,
    project_submission_date VARCHAR(255) NOT NULL,
    group_min VARCHAR(255) NOT NULL,
    group_max VARCHAR(255) NOT NULL,
    project_status VARCHAR(255) NOT NULL,
    formation_type VARCHAR(255) NOT NULL,
    project_description VARCHAR(255),
    instructor_id_fk uuid NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY(instructor_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE
);

CREATE TABLE allgroup(
    group_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id_fk uuid NOT NULL,
    course_id_fk VARCHAR(255) NOT NULL,
    group_num SMALLINT NOT NULL,
    students_array text ARRAY,
    group_status VARCHAR(255) DEFAULT 'Not Full',
    submission_status VARCHAR(255) DEFAULT 'Not Submitted',
    CONSTRAINT fk_project_id FOREIGN KEY(project_id_fk) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_course_id FOREIGN KEY(course_id_fk) REFERENCES course(course_id) ON DELETE CASCADE
);

CREATE TABLE invite(
    invite_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id_fk uuid NOT NULL,
    recipient_id_fk uuid NOT NULL,
    invite_status VARCHAR(255) NOT NULL,
    section_id_fk VARCHAR(255) NOT NULL,
    project_id_fk uuid NOT NULL,
    group_id_fk uuid NOT NULL,
    group_num SMALLINT NOT NULL,
    group_position SMALLINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sender_id FOREIGN KEY(sender_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_recipient_id FOREIGN KEY(recipient_id_fk) REFERENCES alluser(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_section_id FOREIGN KEY(section_id_fk) REFERENCES course(course_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_id FOREIGN KEY(project_id_fk) REFERENCES project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_id FOREIGN KEY(group_id_fk) REFERENCES allgroup(group_id) ON DELETE CASCADE
);

create view student_course as
select alluser.user_id, user_course.course_id, student.student_id, alluser.given_name, alluser.family_name, alluser.email, student.study_program, student.study_year
from alluser, student, user_course
where alluser.user_id=user_course.user_id AND alluser.user_id=student.user_id_fk;

CREATE VIEW course_record AS
SELECT *
FROM course 
LEFT JOIN(
   SELECT course_id AS course_id, count(*) AS course_count
   FROM   user_course 
   GROUP  BY 1 
   ) p USING (course_id)
LEFT JOIN(
   SELECT instructor_id_fk AS instructor_id_fk, count(*) AS project_count
   FROM   project 
   GROUP  BY 1 
   ) a USING (instructor_id_fk)
LEFT JOIN(
   SELECT course_id_fk AS course_id, sum(trues) AS students_joined
   FROM   group_record 
   GROUP  BY 1 
   ) b USING (course_id);

LEFT JOIN(
   SELECT course_id AS course_id, count(*) AS course_count
   FROM   user_course 
   GROUP  BY 1 
   ) p USING (course_id)

CREATE VIEW group_record AS
SELECT *, (select sum(case b when 'empty' then 0 else 1 end) from unnest(students_array) as dt(b)) as trues from allgroup;

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

INSERT INTO alluser (
    given_name,
    family_name,
    gender,
    role,
    email,
    password
  ) VALUES (
    'Admin',
    'ADMIN',
    'Male',
    'Admin',
    'anthonystoltzfus7@gmail.com',
    '123123'
);

SELECT *
    FROM alluser u, teacher t
    WHERE u.user_id = 'b374a60e-cc37-4fc4-984b-dae70d29ce45' AND t.user_id_fk = 'b374a60e-cc37-4fc4-984b-dae70d29ce45';

SELECT e.course_id, array_agg(te.user_id ) AS student_user_id
  FROM course e 
  LEFT JOIN user_course te on e.course_id=te.course_id 
  LEFT JOIN alluser t on te.user_id=t.user_id 
  GROUP BY e.course_id;
