import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();

export const createproject = async (req, res) => {
    const {
        course_id,
        project_title,
        submission_date,
        students_per_group,
        formation_type,
        project_description,
        user_id
    } = req.body;

    try {
        const teacherCourse = await pool.query("SELECT * FROM teacher_course WHERE user_id = $1 AND course_id =$2", [user_id, course_id]);
        const project = await pool.query("SELECT * FROM project WHERE course_id_fk = $1 AND project_title =$2", [course_id, project_title]);


        if (teacherCourse.rows.length === 0) {
            return res.status(401).json({ message: 'You do not teach this course!' });
        }

        if (project.rows.length > 0) {
            return res.status(401).json({ message: 'Project already exisits' });
        }

        const insertProject = await pool.query("INSERT INTO project (course_id_fk, project_title, submission_date, students_per_group, formation_type, project_description, user_id_fk) VALUES ($1, $2, $3, $4, $5, $6 ,$7) RETURNING *",
            [
                course_id,
                project_title,
                submission_date,
                students_per_group,
                formation_type,
                project_description,
                user_id
            ]);

        res.status(200).json({ message: 'Created Project successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;