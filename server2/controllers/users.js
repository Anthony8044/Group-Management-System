import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js'
const router = express.Router();


export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length > 0) {
            return res.status(401).json("User already exists!");
        }

        const bcryptPassword = await bcrypt.hash(password, 12);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [`${firstName} ${lastName}`, email, bcryptPassword]
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
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

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

export default router;