import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import GroupModel,{GroupDocument} from '../models/groupModels';
import GroupMemberModel,{GroupMemberDocument} from '../models/groupMemberModel';
import UserModel from '../models/userModel';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import { isMember } from '../permissions/isMember';
import {canAddMember} from "../permissions/canAddMember"

//Functions
import { addMembersToGroup } from '../functions/addMembersToGroup';
import { removeMembersFromGroups } from '../functions/removeMembersFromGroups';

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

//? Create Group
router.post("/",verifyToken,async(req:Request,res:Response)=>{
  try {
    const{name}=req.body
    if (!(name)) {
      return res.status(400).send("Essential Data Missing");
    }
    const group=new GroupModel({...req.body,creator:req.user.id})
    await group.save()
    return res.status(201).send(group)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Server Error")
  }
})

//? Add Member to Group
router.post("/:groupId/add_members",verifyToken,async (req:Request,res:Response)=>{
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

export default router