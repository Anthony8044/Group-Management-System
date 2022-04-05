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
        group_position,
        user_id
    } = req.body;

    try {
        const inCourse = await pool.query("SELECT * FROM user_course WHERE user_id= $1 AND course_id = $2 ", [user_id, course_id]);
        const checkallgroup = await pool.query("SELECT * FROM allgroup WHERE project_id_fk = $1 AND LEFT(course_id_fk, -2) = LEFT($2, -2) AND $3 = ANY (students_array)", [project_id, course_id, user_id]);
        const checkposition = await pool.query("SELECT array_position(students_array, 'empty') FROM allgroup WHERE group_id = $1;", [group_id]);
        //const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);

        if (inCourse.rows.length === 0) {
            return res.status(401).json({ message: 'You have not joined this course!' });
        }

        if (checkallgroup.rows.length > 0) {
            return res.status(401).json({ message: 'You already joined a group in this project' });
        }

        if (checkposition.rows.length === 0) {
            return res.status(401).json({ message: 'Group is already full!' });
        }

        if (checkposition.rows.length != 0 && inCourse.rows.length != 0 && checkallgroup.rows.length === 0) {
            const insertGroup = await pool.query(
                "UPDATE allgroup SET students_array[$1] =  $2  WHERE group_id = $3 RETURNING *",
                [
                    group_position,
                    user_id,
                    group_id
                ]
            );

            const checkgroup = await pool.query("SELECT * FROM allgroup join lateral unnest(students_array) as un(student) on true where un.student like 'empty' AND group_id=$1;", [group_id]);
            if (checkgroup.rows.length === 0) {
                await pool.query(
                    "UPDATE allgroup SET group_status = 'Full' WHERE group_id = $1 RETURNING *",
                    [
                        group_id
                    ]
                );
            }
        }


        res.status(200).json({ message: 'Successfully joined group' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const leaveGroup = async (req, res) => {
    const {
        group_id,
        course_id,
        group_position,
        user_id
    } = req.body;

    try {
        const inCourse = await pool.query("SELECT * FROM user_course WHERE user_id= $1 AND course_id = $2 ", [user_id, course_id]);
        const checkallgroup = await pool.query("SELECT * FROM allgroup WHERE group_id = $1 AND $2 = ANY (students_array)", [group_id, user_id]);
        //const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);

        if (inCourse.rows.length === 0) {
            return res.status(401).json({ message: 'You have not joined this course!' });
        }

        if (checkallgroup.rows.length === 0) {
            return res.status(401).json({ message: 'You have not joined this group!' });
        }

        if (inCourse.rows.length != 0 && checkallgroup.rows.length != 0) {
            const insertGroup = await pool.query(
                "UPDATE allgroup SET students_array[$1] =  $2  WHERE group_id = $3 RETURNING *",
                [
                    group_position,
                    "empty",
                    group_id
                ]
            );

            const checkgroup = await pool.query("SELECT * FROM allgroup join lateral unnest(students_array) as un(student) on true where un.student like 'empty' AND group_id=$1;", [group_id]);
            if (checkgroup.rows.length > 0) {
                await pool.query(
                    "UPDATE allgroup SET group_status = 'Not Full' WHERE group_id = $1 RETURNING *",
                    [
                        group_id
                    ]
                );
            }
        }


        res.status(200).json({ message: 'Successfully left group' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const invite = async (req, res) => {
    const {
        sender_id_fk,
        recipient_id_fk,
        section_id_fk,
        project_id_fk,
        group_id_fk,
        group_num,
        group_position
    } = req.body;

    try {
        const invite = await pool.query("SELECT * FROM invite WHERE sender_id_fk = $1 AND recipient_id_fk = $2 AND group_id_fk=$3 ", [sender_id_fk, recipient_id_fk, group_id_fk]);
        //const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);


        if (invite.rows.length > 0) {
            return res.status(401).json({ message: 'You have already sent an invite to this student' });
        }

        const inviteGroup = await pool.query("INSERT INTO invite (sender_id_fk, recipient_id_fk, invite_status, section_id_fk, project_id_fk, group_id_fk, group_num, group_position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                sender_id_fk,
                recipient_id_fk,
                "Pending",
                section_id_fk,
                project_id_fk,
                group_id_fk,
                group_num,
                group_position
            ]);

        res.status(200).json(inviteGroup.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const acceptInvite = async (req, res) => {
    const {
        sender_id_fk,
        invite_id,
        recipient_id_fk,
        section_id_fk,
        project_id_fk,
        group_id_fk,
        group_num,
        group_position
    } = req.body;

    try {
        // const invite = await pool.query("SELECT * FROM invite WHERE sender_id_fk = $1 AND recipient_id_fk = $2 AND group_id_fk=$3 ", [sender_id_fk, recipient_id_fk, group_id_fk]);
        // const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);


        // if (invite.rows.length > 0) {
        //     return res.status(401).json({ message: 'You have already sent an invite to this student' });
        // }

        const inCourse = await pool.query("SELECT * FROM user_course WHERE user_id= $1 AND course_id = $2 ", [recipient_id_fk, section_id_fk]);
        const checkallgroup = await pool.query("SELECT * FROM allgroup WHERE project_id_fk = $1 AND course_id_fk = $2 AND $3 = ANY (students_array)", [project_id_fk, section_id_fk, recipient_id_fk]);
        const checkposition = await pool.query("SELECT array_position(students_array, 'empty') FROM allgroup WHERE group_id = $1;", [group_id_fk]);

        if (checkposition.rows.length === 0) {
            return res.status(401).json({ message: 'Group is already full!' });
        }

        if (inCourse.rows.length === 0) {
            return res.status(401).json({ message: 'You have not joined this course!' });
        }

        if (checkallgroup.rows.length > 0) {
            return res.status(401).json({ message: 'You already joined a group in this project' });
        }

        if (checkposition.rows.length != 0 && inCourse.rows.length != 0 && checkallgroup.rows.length === 0) {
            const insertGroup = await pool.query(
                "UPDATE allgroup SET students_array[$1] =  $2  WHERE group_id = $3 RETURNING *",
                [
                    checkposition.rows[0].array_position,
                    recipient_id_fk,
                    group_id_fk
                ]
            );

            const updateInvite = await pool.query(
                "UPDATE invite SET invite_status = 'Closed'  WHERE invite_id =  $1 RETURNING *",
                [
                    invite_id
                ]
            );

            const checkgroup = await pool.query("SELECT * FROM allgroup join lateral unnest(students_array) as un(student) on true where un.student like 'empty' AND group_id=$1;", [group_id_fk]);
            if (checkgroup.rows.length === 0) {
                await pool.query(
                    "UPDATE allgroup SET group_status = 'Full' WHERE group_id = $1 RETURNING *",
                    [
                        group_id_fk
                    ]
                );
            }
        }


        res.status(200).json({ message: 'Sucessfully joined group' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const rejectInvite = async (req, res) => {
    const {
        invite_id
    } = req.body;

    try {
        const invite = await pool.query("SELECT * FROM invite WHERE invite_id = $1; ", [invite_id]);
        //const project = await pool.query("SELECT * FROM project WHERE course_code = $1 AND project_title =$2", [course_code, project_title]);


        if (invite.rows.length === 0) {
            return res.status(401).json({ message: 'Invite does not exist' });
        }

        const deleteInvite = await pool.query(
            "DELETE from invite WHERE invite_id =  $1 RETURNING *",
            [
                invite_id
            ]
        );

        res.status(200).json({ message: 'Sucessfully closed invite' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getStudentInvite = async (req, res) => {
    const { id } = req.params;

    try {
        const invite = await pool.query("SELECT i.invite_id, i.sender_id_fk, a.given_name, a.family_name, i.recipient_id_fk, i.invite_status, i.section_id_fk, i.project_id_fk, p.project_title, i.group_id_fk, i.group_num, i.group_position, i.created_at, a.profile_img FROM invite i, alluser a, project p WHERE i.recipient_id_fk = $1 AND i.sender_id_fk = a.user_id AND i.project_id_fk = p.project_id; ", [id]);

        res.status(200).json(invite.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export const getInviteSent = async (req, res) => {
    const { id } = req.params;

    try {
        const invite = await pool.query("SELECT i.invite_id, i.sender_id_fk, i.recipient_id_fk, a.given_name, a.family_name, i.invite_status, i.section_id_fk, i.project_id_fk, p.project_title, i.group_id_fk, i.group_num, i.group_position, i.created_at, a.profile_img FROM invite i, alluser a, project p WHERE i.sender_id_fk = $1 AND i.recipient_id_fk = a.user_id AND i.project_id_fk = p.project_id; ", [id]);

        res.status(200).json(invite.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

export default router;