import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();

export const createCourse = async (req, res) => {
    const { code, sections, course_title } = req.body;
    const course_id = [];
    const course_section = [];
    let i = 1;

    while (i <= sections) {
        course_id.push(code + "-" + i);
        course_section.push(i);
        i++;
    }

    try {
        const course = await pool.query("SELECT * FROM course WHERE course_id = $1", [code + "-1"]);

        if (course.rows.length > 0) {
            return res.status(401).json({ message: "Course already exists!" });
        }
        let a = 0;
        while (a < sections) {
            await pool.query(
                "INSERT INTO course (course_id, course_code, course_title, course_section) VALUES ($1, $2, $3, $4) RETURNING *",
                [course_id[a], code, course_title, course_section[a]]
            );
            a++;
        }

        return res.status(200).json({ message: "Created course successfully!" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const registerCourse = async (req, res) => {
    const { course_id, user_id } = req.body;

    try {
        const course = await pool.query("SELECT * FROM course WHERE course_id = $1", [course_id]);

        if (course.rows.length === 0) {
            return res.status(401).json({ message: "Course does'nt exist." });
        }

        const courseUser = await pool.query("SELECT * FROM user_course WHERE course_id= $1 AND user_id = $2", [course_id, user_id]);

        if (courseUser.rows.length > 0) {
            return res.status(401).json({ message: "Already joined course." });
        }
        const user = await pool.query("SELECT * FROM alluser WHERE user_id = $1", [user_id]);

        const insertCourseUser = await pool.query("INSERT INTO user_course (user_id, course_id, course_role) VALUES ($1, $2, $3) RETURNING *", [user_id, course_id, user.rows[0].role]);

        res.status(200).json({ message: 'User added to course successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};

export const getAllCourses = async (req, res) => {

    try {
        const course = await pool.query("SELECT e.course_id, array_agg(te.user_id) AS user_id FROM course e LEFT JOIN user_course te on e.course_id=te.course_id LEFT JOIN alluser t on te.user_id=t.user_id GROUP BY e.course_id;");

        if (course.rows.length === 0) {
            return res.status(401).json("No courses");
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