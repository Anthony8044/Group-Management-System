import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import nodemailer from 'nodemailer';
import mailGun from 'nodemailer-mailgun-transport';
import dotenv from 'dotenv';
import schedule from 'node-schedule';
import handlebars from 'handlebars';
import moment from "moment";
import path from 'path';
import fs from 'fs';
const router = express.Router();
dotenv.config();

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
        user_id,
        send_notification
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

        const insertProject = await pool.query("INSERT INTO project (course_code, project_title, group_submission_date, project_submission_date, group_min, group_max, formation_type, project_description, project_status, instructor_id_fk, send_notification) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
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
                user_id,
                send_notification
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

        if (send_notification === true) {
            automateEmails(group_submission_date, project_submission_date, course_code, project_title, project_description);
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

export const updateProject = async (req, res) => {
    const {
        project_title,
        project_description,
        course_code
    } = req.body;
    const { id } = req.params;

    try {
        const project = await pool.query(
            "SELECT * " +
            "FROM project e WHERE project_id = $1;", [id]
        );

        const project1 = await pool.query(
            "SELECT * " +
            "FROM project e WHERE course_code = $1 AND project_title = $2 AND project_id != $3;", [course_code, project_title, id]
        );

        if (project.rows.length === 0) {
            return res.status(401).json({ message: 'Project does not exisit' });
        } else if (project1.rows.length > 0) {
            return res.status(401).json({ message: 'Project title already used' });
        } else {
            const updatedProject = await pool.query(
                "UPDATE project SET project_title = $1, project_description = $2 WHERE project_id = $3 RETURNING *",
                [
                    project_title,
                    project_description,
                    id
                ]
            );
        }


        return res.status(200).json({ message: 'Project updated successfully!' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const deleteProject = async (req, res) => {
    const {
        project_id
    } = req.body;

    try {
        const project = await pool.query("SELECT * FROM project WHERE project_id = $1; ", [project_id]);

        if (project.rows.length === 0) {
            return res.status(401).json({ message: 'Project does not exist' });
        } else {
            const deleteInvite = await pool.query(
                "DELETE from project WHERE project_id =  $1 RETURNING *",
                [
                    project_id
                ]
            );
        }

        res.status(200).json({ message: 'Sucessfully deleted project' });
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

export const getProjectGroups = async (req, res) => {
    const { id, course_id } = req.params;

    try {
        // const project = await pool.query("SELECT e.project_id, e.course_code, e.project_title, e.group_submission_date, e.project_submission_date, e.group_min, e.group_max, e.formation_type, e.project_description, ta.course_id, array_agg(te.group_id) AS group_id FROM project e LEFT JOIN allgroup te on e.project_id=te.project_id_fk LEFT JOIN (SELECT LEFT(course_id, -2) AS course_code, array_agg(course_id) AS course_id FROM course GROUP BY course_id) ta USING (course_code) GROUP BY e.project_id, ta.course_id ORDER BY e.course_code ASC;");
        const project = await pool.query(
            "SELECT a.group_num AS " + '"Group_Number"' + ", a.ordinality AS " + '"Postion"' + ", (case when ta.student_id IS NULL then 'Empty' else ta.student_id  end) AS " + '"Student_ID"' + ", (case when te.given_name IS NULL then 'Empty' else concat(te.family_name,', ',te.given_name) end) AS " + '"Full_Name"' + " " +
            "FROM group_student_record a " +
            "LEFT JOIN  (SELECT user_id::text AS student, given_name, family_name FROM alluser GROUP BY student, given_name, family_name) te USING (student) " +
            "LEFT JOIN  (SELECT user_id_fk::text AS student, student_id FROM student GROUP BY student, student_id) ta USING (student) " +
            "WHERE a.project_id_fk = $1 AND a.course_id_fk = $2 ORDER BY a.group_num, a.ordinality;", [id, course_id]
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
    var shuffled = [...data];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    for (var i = 0; i < shuffled.length; i += chunkSize) {
        arrayOfArrays.push(shuffled.slice(i, i + chunkSize));
    }
    return arrayOfArrays;
}

function automateEmails(groupDate, submisionDate, course_id, project_title, project_description) {
    let stringDate1 = moment(groupDate);
    let stringDate2 = moment(submisionDate);
    let sendDate1 = stringDate1.subtract(3, "days");
    let sendDate2 = stringDate2.subtract(3, "days");

    const temp = fs.readFileSync("./email_templates/projectStarted.html", "utf8")
    const auth = {
        auth: {
            api_key: process.env.API_KEY,
            domain: process.env.DOMAIN
        }
    };
    const transporter = nodemailer.createTransport(mailGun(auth));

    const template = handlebars.compile(temp);

    const htmlToSend1 = template({
        course_id: course_id,
        project_title: project_title,
        project_description: project_description,
        formation_date: stringDate1.format('MMMM Do YYYY, h:mm a'),
        submission_date: stringDate2.format('MMMM Do YYYY, h:mm a')
    });

    const mailOptions1 = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'New Project Created',
        html: htmlToSend1
    };

    transporter.sendMail(mailOptions1, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });

    schedule.scheduleJob(sendDate1.format(), () => {
        const emailTemplateSource = fs.readFileSync("./email_templates/formationDeadline.html", "utf8")

        const template = handlebars.compile(emailTemplateSource);

        const htmlToSend = template({
            course_id: course_id,
            project_title: project_title,
            project_description: project_description,
            formation_date: stringDate1.format('MMMM Do YYYY, h:mm a'),
            submission_date: stringDate2.format('MMMM Do YYYY, h:mm a')
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Project Group Formation Reminder',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        });
    })

    schedule.scheduleJob(sendDate2.format(), () => {
        const emailTemplateSource = fs.readFileSync("./email_templates/submissionDeadline.html", "utf8")

        const template = handlebars.compile(emailTemplateSource);

        const htmlToSend = template({
            course_id: course_id,
            project_title: project_title,
            project_description: project_description,
            formation_date: stringDate1.format('MMMM Do YYYY, h:mm a'),
            submission_date: stringDate2.format('MMMM Do YYYY, h:mm a')
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Project Submission Reminder',
            html: htmlToSend
        };

        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        });
    })

}

export default router;