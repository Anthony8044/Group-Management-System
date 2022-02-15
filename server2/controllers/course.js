import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();

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

export const getAllUserCourse = async (req, res) => {
    
    try {
        const course = await pool.query("SELECT * FROM student_course");

        if (course.rows.length === 0) {
            return res.status(401).json("No one registered to any courses");
        }

        return res.status(200).json(course.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getCourseUsers = async (req, res) => {
    const { course_id } = req.body;

    try {
        const course = await pool.query("SELECT * FROM user_course WHERE course_id = $1", [course_id]);

        if (course.rows.length === 0) {
            return res.status(401).json("No users in course.");
        }
        console.log(course.rows);

        return res.status(200).json(course.rows)

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getUserCourses = async (req, res) => {
    const { user_id } = req.body;

    try {
        const course = await pool.query("SELECT * FROM user_course WHERE user_id = $1", [user_id]);

        if (course.rows.length === 0) {
            return res.status(401).json("Not registered to any courses");
        }

        return res.status(200).json(course.rows)

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;