import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();

export const createGroup = async (req, res) => {
    const {
        project_id,
        course_id,
        student_id
    } = req.body;

    try {
        const allgroup = await pool.query("SELECT * FROM allgroup WHERE project_id_fk = $1 AND LEFT(course_id_fk, -2) = LEFT($2, -2) AND $3 = ANY (students_array)", [project_id, course_id, student_id]);
        //const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);


        if (allgroup.rows.length > 0) {
            return res.status(401).json({ message: 'You already joined a group in this project' });
        }

        const insertGroup = await pool.query("INSERT INTO allgroup (project_id_fk, course_id_fk, students_array) VALUES ($1, $2, $3) RETURNING *",
            [
                project_id,
                course_id,
                [student_id]
            ]);
        console.log(insertGroup.rows);

        res.status(200).json(insertGroup.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const joinGroup = async (req, res) => {
    const {
        group_id,
        project_id,
        course_id,
        student_id
    } = req.body;

    try {
        const checkallgroup = await pool.query("SELECT * FROM allgroup WHERE project_id_fk = $1 AND LEFT(course_id_fk, -2) = LEFT($2, -2) AND $3 = ANY (students_array)", [project_id, course_id, student_id]);
        const allgroup = await pool.query("SELECT * FROM allgroup WHERE project_id_fk = $1 AND LEFT(course_id_fk, -2) = LEFT($2, -2) AND $3 = ANY (students_array)", [project_id, course_id, student_id]);
        //const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);


        if (checkallgroup.rows.length > 0) {
            return res.status(401).json({ message: 'You already joined a group in this project' });
        }

        // const insertGroup = await pool.query("INSERT INTO allgroup (project_id_fk, course_id_fk, students_array) VALUES ($1, $2, $3) RETURNING *",
        //     [
        //         project_id,
        //         course_id,
        //         [student_id]
        //     ]);

        const insertGroup = await pool.query(
            "UPDATE allgroup SET students_array = array_append(students_array, $1 ) WHERE group_id = $2 RETURNING *",
            [
                student_id,
                group_id
            ]
        );

        console.log(insertGroup.rows);

        res.status(200).json(insertGroup.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;