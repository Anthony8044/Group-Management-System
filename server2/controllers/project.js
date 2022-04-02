import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();

export const createproject = async (req, res) => {
    const {
        course_code,
        project_title,
        group_submission_date,
        project_submission_date,
        group_min,
        group_max,
        formation_type,
        project_description,
        project_status,
        user_id
    } = req.body;

    try {
        const teacherCourse = await pool.query("SELECT * FROM course WHERE instructor_id_fk = $1 AND course_id =$2", [user_id, course_code + "-1"]);
        const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);
        const courseRecord = await pool.query("SELECT course_id, course_count FROM course_record WHERE LEFT(course_id, -2) = $1 ORDER BY course_id ASC", [course_code]);

        const GroupNum = [];
        let i = 0;
        while (i < courseRecord.rows.length) {
            const numOfGroup = Math.ceil(courseRecord.rows[i].course_count / group_min);
            GroupNum.push(numOfGroup);
            i++;
        }

        const GroupNum1 = [];
        let f = 1;
        while (f <= group_max) {
            GroupNum1.push("empty");
            f++;
        }

        const GroupNum2 = [];
        let e = 0;
        while (e < GroupNum.length) {
            const studentPerGroup = Math.ceil(courseRecord.rows[e].course_count / GroupNum[e]);
            GroupNum2.push(studentPerGroup);
            e++;
        }


        if (teacherCourse.rows.length === 0) {
            return res.status(401).json({ message: 'You do not teach this course!' });
        }

        if (project.rows.length > 0) {
            return res.status(401).json({ message: 'Project already exisits' });
        }


        ///Students Choice

        const insertProject = await pool.query("INSERT INTO project (course_code, project_title, group_submission_date, project_submission_date, group_min, group_max, formation_type, project_description, project_status, instructor_id_fk) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
            [
                course_code,
                project_title,
                group_submission_date,
                project_submission_date,
                group_min,
                group_max,
                formation_type,
                project_description,
                project_status,
                user_id
            ]);


        if (formation_type === "default") {
            let x = 0;
            let setting = null;
            while (x < GroupNum.length) {

                setting = courseRecord.rows[x].course_id
                let a = 0;
                while (a < GroupNum[x]) {
                    await pool.query(
                        "INSERT INTO allgroup (project_id_fk, course_id_fk, group_num, students_array) VALUES ($1, $2, $3, $4) RETURNING *",
                        [
                            insertProject.rows[0].project_id,
                            setting,
                            a + 1,
                            GroupNum1
                        ]);
                    a++;
                }
                x++;
            }

        } else if (formation_type === "random") {

            let x = 0;
            let setting = null;
            let studetentsList;
            let randomizedList;
            let studetentsList2;
            while (x < GroupNum.length) {
                let z = x + 1;
                studetentsList = await pool.query("SELECT user_id FROM user_course WHERE user_course.course_id = $1", [course_code + "-" + z]);
                studetentsList2 = studetentsList.rows.map(doc => Object.values(doc));
                const merge3 = studetentsList2.flat(1);
                randomizedList = randomizeAndSplit(merge3, GroupNum2[x]);

                setting = courseRecord.rows[x].course_id
                let a = 0;
                while (a < GroupNum[x]) {
                    const asdlfkj = await pool.query(
                        "INSERT INTO allgroup (project_id_fk, course_id_fk, group_num, students_array, group_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                        [
                            insertProject.rows[0].project_id,
                            setting,
                            a + 1,
                            randomizedList[a],
                            "Full"
                        ]);
                    //console.log(asdlfkj.rows)
                    a++;
                }
                x++;
            }

        }



        ////Randomize Choice

        // const studetentsList = await pool.query("SELECT user_id FROM user_course WHERE course_id = $1", [course_code + "-1"]);

        // //console.log(studetentsList.rows);
        // const randomizedList = randomizeAndSplit(studetentsList.rows, Number(group_min));

        // console.log(randomizedList);




        res.status(200).json({ message: 'Created Project successfully!' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getAllProjects = async (req, res) => {

    try {
        // const project = await pool.query("SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_description, ta.course_id, array_agg(te.group_id) AS group_id FROM project e LEFT JOIN allgroup te on e.project_id=te.project_id_fk LEFT JOIN (SELECT LEFT(course_id, -2) AS course_code, array_agg(course_id) AS course_id FROM course GROUP BY course_id) ta USING (course_code) GROUP BY e.project_id, ta.course_id ORDER BY e.course_code ASC;");
        const project = await pool.query(
            "SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_status, e.project_description, te.groups, ta.section_id " +
            "FROM project e " +
            "LEFT JOIN  (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'group_num', group_num, 'group_status', group_status, 'course_id_fk', course_id_fk)ORDER BY course_id_fk, group_num) AS groups FROM allgroup GROUP BY 1) te USING (project_id) " +
            "LEFT JOIN  (SELECT LEFT(course_id, -2) AS course_code, array_agg(course_id) AS section_id FROM course GROUP  BY 1) ta USING (course_code) " +
            "GROUP BY e.project_id, te.groups, ta.section_id ORDER BY e.created_at;"
        );

        if (project.rows.length === 0) {
            return res.status(401).json("No Projects");
        }

        return res.status(200).json(project.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getProjectsByCourseId = async (req, res) => {
    const { id } = req.params;

    try {
        // const project = await pool.query("SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_description, ta.course_id, array_agg(te.group_id) AS group_id FROM project e LEFT JOIN allgroup te on e.project_id=te.project_id_fk LEFT JOIN (SELECT LEFT(course_id, -2) AS course_code, array_agg(course_id) AS course_id FROM course GROUP BY course_id) ta USING (course_code) GROUP BY e.project_id, ta.course_id ORDER BY e.course_code ASC;");
        const project = await pool.query(
            "SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_description, te.groups " +
            "FROM project e " +
            "LEFT JOIN  (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'course_id_fk', course_id_fk, 'group_num', group_num, 'group_status', group_status, 'students_array', students_array )ORDER BY group_num) AS groups FROM allgroup WHERE course_id_fk = $1 GROUP  BY 1) te USING (project_id) " +
            "WHERE LEFT($1, -2)=e.course_code GROUP BY e.project_id, te.groups ORDER BY e.created_at;", [id]
        );

        // if (project.rows.length === 0) {
        //     return res.status(401).json("No Projects");
        // }

        return res.status(200).json(project.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getProject = async (req, res) => {
    const { id } = req.params;

    try {
        // const project = await pool.query("SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_description, ta.course_id, array_agg(te.group_id) AS group_id FROM project e LEFT JOIN allgroup te on e.project_id=te.project_id_fk LEFT JOIN (SELECT LEFT(course_id, -2) AS course_code, array_agg(course_id) AS course_id FROM course GROUP BY course_id) ta USING (course_code) GROUP BY e.project_id, ta.course_id ORDER BY e.course_code ASC;");
        const project = await pool.query(
            "SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_description, te.groups " +
            "FROM project e " +
            "LEFT JOIN  (SELECT project_id_fk AS project_id, jsonb_agg(jsonb_build_object('group_id', group_id, 'course_id_fk', course_id_fk, 'group_num', group_num, 'group_status', group_status, 'students_array', students_array )ORDER BY course_id_fk, group_num) AS groups FROM allgroup GROUP  BY 1) te USING (project_id) " +
            "WHERE e.project_id = $1 GROUP BY e.project_id, te.groups ORDER BY e.created_at;", [id]
        );

        if (project.rows.length === 0) {
            return res.status(401).json("No Project");
        }

        return res.status(200).json(project.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

function randomizeAndSplit(data, chunkSize) {
    var arrayOfArrays = [];
    var shuffled = [...data]; //make a copy so that we don't mutate the original array

    //shuffle the elements
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    //split the shuffled version by the chunk size
    for (var i = 0; i < shuffled.length; i += chunkSize) {
        arrayOfArrays.push(shuffled.slice(i, i + chunkSize));
    }
    return arrayOfArrays;
}

export default router;