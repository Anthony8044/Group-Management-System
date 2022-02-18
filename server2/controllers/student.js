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


export const getStudent = async (req, res) => {
    const { user_id } = req.body;

    try {
        const user = await pool.query("Select alluser.user_id, alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.study_program, student.study_year, student.student_id from alluser, student where alluser.user_id = $1 and student.user_id_fk = $1;", [user_id]);

        if (user.rows.length === 0) {
            return res.status(401).json("User does'nt exist.");
        }

        return res.status(200).json(user.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const updateStudent = async (req, res) => {
    const {
        given_name,
        family_name,
        gender,
        role,
        email,
        profile_img,
        study_program,
        study_year,
        student_id
    } = req.body;
    const { id } = req.params;


    try {
        const user = await pool.query("SELECT * FROM alluser WHERE user_id = $1", [id]);
        //const user = await pool.query("Select alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.study_program, student.study_year, student.student_id from alluser, student where alluser.user_id = $1 and student.user_id_fk = $1;", [user_id]);

        if (user.rows.length === 0) {
            return res.status(401).json("User does'nt exist.");
        }

        const updatedUser = await pool.query(
            "UPDATE alluser SET given_name = $1, family_name = $2, gender = $3, role = $4, email = $5, profile_img = $6 WHERE user_id = $7 RETURNING *",
            [
                given_name,
                family_name,
                gender,
                role,
                email,
                profile_img,
                id
            ]
        );

        const updatedStudent = await pool.query(
            "UPDATE student SET study_program = $1, study_year = $2, student_id = $3 WHERE user_id_fk = $4 RETURNING *",
            [
                study_program,
                study_year,
                student_id,
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
            "student_id": updatedStudent.rows[0].student_id
        }

        return res.status(200).json(sendUser)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;