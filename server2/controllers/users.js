import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();


export const register = async (req, res) => {
    const { given_name, family_name, gender, email, password, teacher_id, department, postition } = req.body;

    try {
        const user = await pool.query("SELECT * FROM alluser WHERE email = $1", [email]);

        if (user.rows.length > 0) {
            return res.status(401).json("User already exists!");
        }

        const bcryptPassword = await bcrypt.hash(password, 12);

        const newUser = await pool.query(
            "INSERT INTO alluser (given_name, family_name, gender, role, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [given_name, family_name, gender, 'Teacher', email, bcryptPassword]
        );

        const newStudent = await pool.query(
            "INSERT INTO teacher (teacher_id, user_id_fk, department, postition) VALUES ($1, $2, $3, $4) RETURNING *",
            [teacher_id, newUser.rows[0].user_id, department, postition]
        );

        //const jwtToken = jwtGenerator(newUser.rows[0].id);

        //return res.json({ jwtToken });
        const token = jwt.sign({ email: newUser.rows[0].email, id: newUser.rows[0].id }, 'cat123', { expiresIn: "1h" });
        const result = newUser.rows[0];

        return res.status(200).json({ result, token })
        //return res.json( newUser.rows[0] );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM alluser WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("User does'nt exist.");
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json("Invalid Credential");
        }
        // const jwtToken = jwtGenerator(user.rows[0].id);
        // return res.json({ jwtToken });
        const token = jwt.sign({ email: user.rows[0].email, id: user.rows[0].id}, 'cat123', { expiresIn: "1h"});
        const result = user.rows[0];

        return res.status(200).json({result, token})
        // return res.json( user.rows[0] );

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const registerCourse = async (req, res) => {
    const { course_code, user_id, course_section } = req.body;

    try {
        const course = await pool.query("SELECT * FROM course WHERE course_code = $1 AND course_section =$2", [course_code, course_section]);

        if (course.rows.length === 0) {
            return res.status(401).json("Course does'nt exist.");
        }

        const courseUser = await pool.query("SELECT * FROM user_course WHERE LEFT(course_id, -2) = LEFT($1, -2) AND user_id = $2", [course.rows[0].course_id, user_id]);

        if (courseUser.rows.length > 0) {
            return res.status(401).json("Already joined course.");
        }
        const user = await pool.query("SELECT * FROM alluser WHERE user_id = $1", [user_id]);

        const insertCourseUser = await pool.query("INSERT INTO user_course (user_id, course_id, course_role) VALUES ($1, $2, $3) RETURNING *", [user_id, course.rows[0].course_id, user.rows[0].role] );

        res.status(200).json( {message: 'User added to course successfully!'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;