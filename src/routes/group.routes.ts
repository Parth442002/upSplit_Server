import express,{ Response} from 'express';
require("dotenv").config();
import GroupModel from '../models/groupModels';
import GroupMemberModel from '../models/groupMemberModel';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import { isMember } from '../permissions/isMember';
import {isGroupAdmin} from '../permissions/isGroupAdmin';
const router = express.Router();

//? Get all Groups of Current User
router.get("/",verifyToken,async (req:Request,res:Response)=>{
  try {
    const allGroups = await GroupModel.find().populate("members.user","username")
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
    const group=new GroupModel({
      ...req.body,
      creator:req.user.id,
    })
    // Create a new GroupMemberModel instance for the creator
    const creatorMember = new GroupMemberModel({
      user: req.user.id,
      isAdmin: true,
    });
    // Push the creator member into the members array
    group.members.push(creatorMember);
    await group.save()
    const newGrp=await GroupModel.findById(group.id).populate('creator', 'username');
    return res.status(201).send(newGrp)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Server Error")
  }
})

//? Get Group Info
router.get("/:groupId/",verifyToken,async (req:Request,res:Response)=>{
  try {
    const {groupId}=req.params;
    const isValidUser=await isMember(req.user.id,groupId)
    if(!isValidUser){
      return res.status(404).send({error:"You do not belong to this group"})
    }
    const group=await GroupModel.findById(groupId).populate("creator members.user","username")
    if(!group){
      return res.status(404).send({error:"Group Not found"})
    }
    return res.status(201).send({group:group})
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "An error occurred accessing group information" });
  }
})

//?Update Group Info
router.put("/:groupId/", verifyToken, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, desc } = req.body;
    if (! isGroupAdmin(groupId,req.user.id)) {
      return res.status(403).send({ error: "You do not have permission to update group info" });
    }
    // Find the group by its ID
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).send({ error: "Group Not found" });
    }
    if (name) {
      group.name = name;
    }
    if (desc) {
      group.desc = desc;
    }
    await group.save();
    return res.status(200).send({ message: "Group information updated successfully", group });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "An error occurred while updating group information" });
  }
});

//?Delete Group
router.delete("/:groupId/", verifyToken, async (req, res) => {
  try {
    const { groupId } = req.params;
    if (! isGroupAdmin(groupId,req.user.id)) {
      return res.status(403).send({ error: "You do not have permission to update group info" });
    }
    // Find the group by its ID
    const group = await GroupModel.findByIdAndDelete(groupId);
    if (!group) {
      return res.status(404).send({ error: "Group Not found" });
    }
    return res.status(200).send({ message: "Group Deleted successfully", group });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "An error occurred while Deleting group information" });
  }
});

export default router;
