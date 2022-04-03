import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();


export const getAllStudents = async (req, res) => {
    try {
        const user = await pool.query("Select alluser.user_id, alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.study_program, student.study_year, student.student_id from alluser, student WHERE alluser.user_id = student.user_id_fk;");

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "No Students." });
        }

        return res.status(200).json(user.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getSectionStudents = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query("Select alluser.user_id, alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.study_program, student.study_year, student.student_id FROM alluser, student, user_course WHERE alluser.user_id = student.user_id_fk AND user_course.user_id = alluser.user_id AND user_course.course_id = $1;", [id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "No Students." });
        }

        return res.status(200).json(user.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


export const getStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await pool.query("Select alluser.user_id, alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.study_program, student.study_year, student.student_id, student.weeknesses, student.strenghts, student.personality_type from alluser, student where alluser.user_id = $1 and student.user_id_fk = $1;", [id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does'nt exist." });
        }

        return res.status(200).json(user.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getStudentGroups = async (req, res) => {
    const { id } = req.params;
    const idString = id.toString();

    try {
        // const user = await pool.query(
        //     "SELECT u.user_id, u.course_id, p.project_id, bool_or(case when u.user_id::text = ANY (a.students_array) then true else false end) AS isJoined " +
        //     "FROM user_course u, project p, allgroup a WHERE u.user_id = $1 AND LEFT(u.course_id, -2) = p.course_code AND p.project_id = a.project_id_fk " +
        //     "GROUP BY u.user_id, u.course_id, p.project_id", [id]
        // );
        const user = await pool.query(
            "SELECT u.user_id, u.course_id, p.project_id, te.group_id, te.group_num, te.group_status, te.array_position " +
            "FROM user_course u, allgroup a, project p " +
            "LEFT JOIN (SELECT project_id_fk AS project_id, group_id, group_num, group_status, array_position(students_array, $1) FROM allgroup WHERE $1 = ANY (students_array) GROUP  BY group_id) te USING (project_id) " +
            "WHERE u.user_id = $2 AND LEFT(u.course_id, -2) = p.course_code AND p.project_id = a.project_id_fk " +
            "GROUP BY u.user_id, u.course_id, p.project_id, te.group_id, te.group_num, te.group_status, te.array_position", [idString, id]
        );
        //"LEFT JOIN (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'course_id_fk', course_id_fk, 'students_array', students_array )) AS groups FROM allgroup WHERE $1 = ANY (students_array) GROUP  BY 1) te USING (project_id) " +
        //"LEFT JOIN (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'course_id_fk', course_id_fk, 'students_array', students_array )) AS groups FROM allgroup GROUP  BY 1) te USING (project_id) " +



        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does'nt exist." });
        }

        return res.status(200).json(user.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getStudentTable = async (req, res) => {
    const { id } = req.params;
    const idString = id.toString();

    try {
        // const user = await pool.query(
        //     "SELECT u.user_id, u.course_id, p.project_id, bool_or(case when u.user_id::text = ANY (a.students_array) then true else false end) AS isJoined " +
        //     "FROM user_course u, project p, allgroup a WHERE u.user_id = $1 AND LEFT(u.course_id, -2) = p.course_code AND p.project_id = a.project_id_fk " +
        //     "GROUP BY u.user_id, u.course_id, p.project_id", [id]
        // );
        const user = await pool.query(
            "SELECT * " +
            "FROM course_record, user_course " +
            "WHERE user_course.user_id = $1 AND user_course.course_id=course_record.course_id ORDER BY course_record.course_id ASC; ", [id]
        );
        //"LEFT JOIN (SELECT project_id_fk AS project_id, group_id, group_num, group_status, array_position(students_array, $1) FROM allgroup WHERE $1 = ANY (students_array) GROUP  BY group_id) te USING (project_id) " +

        //"LEFT JOIN (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'course_id_fk', course_id_fk, 'students_array', students_array )) AS groups FROM allgroup WHERE $1 = ANY (students_array) GROUP  BY 1) te USING (project_id) " +
        //"LEFT JOIN (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'course_id_fk', course_id_fk, 'students_array', students_array )) AS groups FROM allgroup GROUP  BY 1) te USING (project_id) " +



        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does'nt exist." });
        }

        return res.status(200).json(user.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// export const getStudentinProject = async (req, res) => {
//     const { id, projid } = req.params;
//     const idString = id.toString();

//     try {
//         const user = await pool.query(
//             "SELECT user_course.user_id, allgroup.course_id_fk, te.project_id, te.group_id, te.group_num, te.group_status " +
//             "FROM user_course, allgroup, project " +
//             "LEFT JOIN (SELECT project_id_fk AS project_id, group_id, group_num, group_status FROM allgroup WHERE $1 = ANY (students_array) GROUP  BY group_id) te USING (project_id) " +
//             "WHERE user_course.user_id = $2 AND user_course.course_id = allgroup.course_id_fk AND allgroup.project_id_fk = $3 " +
//             "GROUP BY user_course.user_id, te.project_id, allgroup.course_id_fk, te.group_id, te.group_num, te.group_status", [idString, id, projid]
//         );


//         if (user.rows.length === 0) {
//             return res.status(401).json({ message: "User does'nt exist." });
//         }

//         return res.status(200).json(user.rows[0])
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server error");
//     }
// };

export const updateStudent = async (req, res) => {
    const {
        given_name,
        family_name,
        gender,
        email,
        profile_img,
        study_program,
        study_year,
        student_id,
        strenghts,
        weeknesses,
        personality_type
    } = req.body;
    const { id } = req.params;


    try {
        const user = await pool.query("SELECT * FROM alluser WHERE user_id = $1", [id]);
        //const user = await pool.query("Select alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.study_program, student.study_year, student.student_id from alluser, student where alluser.user_id = $1 and student.user_id_fk = $1;", [user_id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does'nt exist." });
        }

        const updatedUser = await pool.query(
            "UPDATE alluser SET given_name = $1, family_name = $2, gender = $3, email = $4, profile_img = $5 WHERE user_id = $6 RETURNING *",
            [
                given_name,
                family_name,
                gender,
                email,
                profile_img,
                id
            ]
        );

        const updatedStudent = await pool.query(
            "UPDATE student SET study_program = $1, study_year = $2, student_id = $3, strenghts = $4, weeknesses = $5, personality_type = $6 WHERE user_id_fk = $7 RETURNING *",
            [
                study_program,
                study_year,
                student_id,
                strenghts,
                weeknesses,
                personality_type,
                id
            ]
        );

        const sendUser = {
            "given_name": updatedUser.rows[0].given_name,
            "family_name": updatedUser.rows[0].family_name,
            "gender": updatedUser.rows[0].gender,
            "role": updatedUser.rows[0].role,
            "email": updatedUser.rows[0].email,
            "profile_img": updatedUser.rows[0].profile_img,
            "study_program": updatedStudent.rows[0].study_program,
            "study_year": updatedStudent.rows[0].study_year,
            "student_id": updatedStudent.rows[0].student_id,
            "strenghts": updatedStudent.rows[0].strenghts,
            "weeknesses": updatedStudent.rows[0].weeknesses,
            "personality_type": updatedStudent.rows[0].personality_type,
        }
        return res.status(200).json(sendUser)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;