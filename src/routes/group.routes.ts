import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import GroupModel,{GroupDocument} from '../models/groupModels';
import GroupParticipantModel,{GroupMemberDocument} from '../models/groupMember';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import { isMember } from '../permissions/isMember';
import { group } from 'console';

const router = express.Router();

//? Get all Groups of Current User
router.get("/",verifyToken,async (req:Request,res:Response)=>{
  try {
    const allGroups = await GroupModel.find();
    const groups=allGroups.filter(group=>isMember(req.user.id,group.id))
    return res.status(200).send(groups)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Servor Error")
}
})

export default router