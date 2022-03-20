import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();


export const getAllTeachers = async (req, res) => {
    try {
        const user = await pool.query("Select alluser.user_id, alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, teacher.department, teacher.postition, teacher.teacher_id from alluser, teacher WHERE alluser.user_id = teacher.user_id_fk;");

        if (user.rows.length === 0) {
            return res.status(401).json("No Students.");
        }

        return res.status(200).json(user.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


export const getTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await pool.query("Select alluser.user_id, alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, teacher.department, teacher.postition, teacher.teacher_id from alluser, teacher where alluser.user_id = $1 and teacher.user_id_fk = $1;", [id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does'nt exist." });
        }

        return res.status(200).json(user.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const updateTeacher = async (req, res) => {
    const {
        given_name,
        family_name,
        gender,
        role,
        email,
        profile_img,
        department,
        postition,
        teacher_id
    } = req.body;
    const { id } = req.params;


    try {
        const user = await pool.query("SELECT * FROM alluser WHERE user_id = $1", [id]);
        //const user = await pool.query("Select alluser.given_name, alluser.family_name, alluser.gender, alluser.role, alluser.email, alluser.profile_img, student.department, teacher.postition, teacher.teacher_id from alluser, student where alluser.user_id = $1 and teacher.user_id_fk = $1;", [user_id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does'nt exist." });
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

        const updatedTeadcher = await pool.query(
            "UPDATE teacher SET department = $1, postition = $2, teacher_id = $3 WHERE user_id_fk = $4 RETURNING *",
            [
                department,
                postition,
                teacher_id,
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
            "study_program": updatedTeadcher.rows[0].department,
            "study_year": updatedTeadcher.rows[0].postition,
            "student_id": updatedTeadcher.rows[0].teacher_id
        }

        return res.status(200).json({ message: "Updated Teacher" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;