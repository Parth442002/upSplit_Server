import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import GroupModel,{GroupDocument} from '../models/groupModels';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import {canAddMember} from "../permissions/canAddMember"

//Functions
import { addMembersToGroup } from '../functions/addMembersToGroup';
import { removeMembersFromGroups } from '../functions/removeMembersFromGroups';
const router = express.Router();

//? Add Member to Group
router.post("/:groupId/members",verifyToken,async (req:Request,res:Response)=>{
  try {
    const { memberDataList } = req.body;
    const {groupId}=req.params
    if (!mongoose.Types.ObjectId.isValid(groupId)||memberDataList.length==0) {
      return res.status(400).json({ error: 'Incomplete Data' });
    }
    const group = await GroupModel.findById(groupId);
    if(!group){
      return res.status(404).send("The Group does not exist")
    }
    const canAdd=await canAddMember(group,req.user.id)
    if(!canAdd){
      return res.status(400).send("You are not the admin")
    }
    //ACTUAL Process
    const updatedGroup=await addMembersToGroup(group,memberDataList)
    return res.status(201).send(updatedGroup)
  } catch (error) {
    return res.status(400).send(error)
  }
})

//? Remove members from group
router.delete("/:groupId/remove_members",verifyToken,async (req:Request,res:Response)=>{
  try {
    const { userIds } = req.body;
    const {groupId}=req.params
    if (!mongoose.Types.ObjectId.isValid(groupId)||userIds.length==0) {
      return res.status(400).json({ error: 'Incomplete Data' });
    }
    const group = await GroupModel.findById(groupId);
    if(!group){
      return res.status(404).send("The Group does not exist")
    }
    const canAdd=await canAddMember(group,req.user.id)
    if(!canAdd){
      return res.status(400).send("You are not the admin")
    }
    //ACTUAL Process
    const updatedGroup=await removeMembersFromGroups(group,userIds)
    return res.status(201).send(updatedGroup)
  } catch (error) {
    return res.status(400).send(error)
  }
})


export default router;