import express,{ Response,Request } from 'express';
require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import UserModel,{UserDocument} from '../models/userModel';

const router = express.Router();

//All Users View View
router.get("/",async(req:Request,res:Response)=>{
  try {
    const users=await UserModel.find({})
    return res.status(200).send(users)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error");
  }
})

export default router