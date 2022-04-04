import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
const router = express.Router();

export const authorization = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
        }

        const user = await pool.query("SELECT * FROM alluser WHERE user_id = $1", [decodedData.user_id]);

        if (user.rows[0].role === 'Teacher') {
            next();
        }

    } catch (error) {
        console.log(error);
    }
}

export default router;