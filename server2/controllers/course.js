import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();

export const createCourse = async (req, res) => {
    const { code, sections, course_title, instructor_id } = req.body;
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
        const user = await pool.query("SELECT * FROM teacher WHERE user_id_fk = $1", [instructor_id]);


        if (course.rows.length > 0) {
            return res.status(401).json({ message: "Course already exists!" });
        }

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "User does not exists!" });
        }

        let a = 0;
        while (a < sections) {
            await pool.query(
                "INSERT INTO course (course_id, course_title, instructor_id_fk) VALUES ($1, $2, $3) RETURNING *",
                [course_id[a], course_title, instructor_id]
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
    // const course_code = course_id.slice(0, -2);
    // console.log(course_code);

    try {
        const course = await pool.query("SELECT * FROM course WHERE course_id = $1", [course_id]);
        const student = await pool.query("SELECT * FROM student WHERE user_id_fk = $1", [user_id]);


        if (course.rows.length === 0) {
            return res.status(401).json({ message: "Course does'nt exist." });
        }
        if (student.rows.length === 0) {
            return res.status(401).json({ message: "Student does not exist." });
        }

        const courseUser = await pool.query("SELECT * FROM user_course WHERE course_id= $1 AND user_id = $2", [course_id, user_id]);

        const courseUser2 = await pool.query("SELECT * FROM user_course WHERE LEFT(course_id, -2) = LEFT($1, -2) AND user_id = $2", [course_id, user_id]);

        if (courseUser.rows.length > 0) {
            return res.status(401).json({ message: "Already joined this section of this course." });
        }

        if (courseUser2.rows.length > 0) {
            return res.status(401).json({ message: "Already joined another section of this course." });
        }

        await pool.query("INSERT INTO user_course (user_id, course_id) VALUES ($1, $2) RETURNING *", [user_id, course_id]);

        res.status(200).json({ message: 'Student added to course successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
};

export const getAllCourses = async (req, res) => {

    try {
        const course = await pool.query("SELECT e.course_id, e.instructor_id_fk, array_agg(te.user_id) AS user_id FROM course e LEFT JOIN user_course te on e.course_id=te.course_id LEFT JOIN alluser t on te.user_id=t.user_id GROUP BY e.course_id ORDER BY e.course_id ASC;");

        if (course.rows.length === 0) {
            return res.status(401).json({ message: "No courses found!" });
        }

        return res.status(200).json(course.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: "Server error" });
    }
};

export const getCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await pool.query("SELECT e.course_id, e.instructor_id_fk, array_agg(te.user_id) AS user_id FROM course e LEFT JOIN user_course te on e.course_id=te.course_id LEFT JOIN alluser t on te.user_id=t.user_id WHERE e.course_id = $1 GROUP BY e.course_id ORDER BY e.course_id ASC;", [id]);

        if (course.rows.length === 0) {
            return res.status(401).json({ message: "No course found!" });
        }

        return res.status(200).json(course.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;