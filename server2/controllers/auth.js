import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();


export const registerStudent = async (req, res) => {
    const { given_name, family_name, gender, email, password, student_id, study_program, study_year, strenghts, weeknesses, personality_type } = req.body;

    try {
        const user = await pool.query("SELECT * FROM alluser WHERE email = $1", [email]);
        const student = await pool.query("SELECT * FROM student WHERE student_id = $1", [student_id]);

        if (user.rows.length > 0) {
            return res.status(401).json({ message: "Email registered to another user!" });
        } else if (student.rows.length > 0) {
            return res.status(401).json({ message: "Student ID registered to another user!" });
        } else {
            const bcryptPassword = await bcrypt.hash(password, 12);

            const newUser = await pool.query(
                "INSERT INTO alluser (given_name, family_name, gender, role, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [given_name, family_name, gender, 'Student', email, bcryptPassword]
            );

            const newStudent = await pool.query(
                "INSERT INTO student (student_id, user_id_fk, study_program, study_year, strenghts, weeknesses, personality_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [student_id, newUser.rows[0].user_id, study_program, study_year, strenghts, weeknesses, personality_type]
            );

        }

        res.status(200).json({ message: 'Created student successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const registerTeacher = async (req, res) => {
    const { given_name, family_name, gender, email, password, teacher_id, department, postition } = req.body;

    try {
        const user = await pool.query("SELECT * FROM alluser WHERE email = $1", [email]);

        if (user.rows.length > 0) {
            return res.status(401).json({ message: "Email registered to another user!" });
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

        res.status(200).json({ message: 'Created teacher successfully!' });
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
            return res.status(401).json({ message: "Invalid Email" });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({ user_id: user.rows[0].user_id, role: user.rows[0].role }, 'test', { expiresIn: "1h" });
        const refreshToken = jwt.sign({ user_id: user.rows[0].user_id, role: user.rows[0].role }, 'test1', { expiresIn: "1w" });

        return res.status(200).json({ token, refreshToken })
        // return res.json( user.rows[0] );

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Server error" });
    }
};

export const refreshToken = async (req, res) => {
    const { tok } = req.body;

    try {
        const isCustomAuth = tok.length < 500;

        let decodedData;
        if (tok && isCustomAuth) {
            decodedData = jwt.verify(tok, 'test1');
        }

        const token = jwt.sign({ user_id: decodedData.user_id, role: decodedData.role }, 'test', { expiresIn: "1h" });
        const refreshToken = jwt.sign({ user_id: decodedData.user_id, role: decodedData.role }, 'test1', { expiresIn: "1w" });

        return res.status(200).json({ token, refreshToken })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;