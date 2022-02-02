import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const router = express.Router();

export const getUsers = async (req, res) => {
     try {
         const UserModel = await userModel.find();

         console.log(UserModel);

         res.status(200).json(UserModel);

     } catch (error) {
         res.status(404).json({ message: error.message });
     }
}

export const createUser = async (req, res) => {

    const user = req.body;

    const newUser = new userModel({ ...user, creator: req.userId, createdAt: new Date().toISOString() });

    try{
        await newUser.save();

        res.status(201).json(newUser);

    }catch(error){
        res.status(409).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {

    const { id: _id } = req.params;
    const user = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with that ID');

    const updatedUser = await userModel.findByIdAndUpdate(_id, user, { new: true });

    res.json(updatedUser);
    console.log('Updated: '+ _id);
}

export default router;

export const deleteUser = async (req, res) => {

    const { id } = req.params;

    console.log('Deleted id: '+ id);

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with that ID');

    await userModel.findByIdAndRemove(id);

    res.json( {message: 'User deleted successfully'});
}