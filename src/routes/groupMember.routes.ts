import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import GroupModel from '../models/groupModels';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
//Functions
import { addMembersToGroup } from '../functions/addMembersToGroup';
import { removeMembersFromGroups } from '../functions/removeMembersFromGroups';
import { isGroupAdmin } from '../permissions/isGroupAdmin';

const router = express.Router();

//? Add Member to Group
router.post("/:groupId/members", verifyToken, async (req: Request, res: Response) => {
  try {
    const { memberDataList } = req.body;
    const { groupId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(groupId) || memberDataList.length === 0) {
      return res.status(400).json({ error: 'Incomplete Data' });
    }
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).send("The Group does not exist");
    }
    const isAdmin = await isGroupAdmin(groupId, req.user.id);
    if (!isAdmin) {
      return res.status(400).send("You are not the admin");
    }
    // ACTUAL Process
    const updatedGroup = await addMembersToGroup(group, memberDataList);
    return res.status(201).send(updatedGroup);

  } catch (error) {
    console.log(error)
    return res.status(400).send(error);
  }
});

//? Remove members from group
router.delete("/:groupId/members", verifyToken, async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    const { groupId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(groupId) || userIds.length === 0) {
      return res.status(400).json({ error: 'Incomplete Data' });
    }
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).send("The Group does not exist");
    }
    const isAdmin = await isGroupAdmin(groupId, req.user.id);
    if (!isAdmin) {
      return res.status(400).send("You are not the admin");
    }
    // ACTUAL Process
    const updatedGroup = await removeMembersFromGroups(group, userIds);
    return res.status(201).send(updatedGroup);

  } catch (error) {
    return res.status(400).send(error);
  }
});

//? Make Member admin
router.put("/:groupId/members/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { groupId} = req.params;
    const {userId}=req.body;
    if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid Group or User ID' });
    }
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).send({message:"The Group does not exist"});
    }
    const isAdmin = await isGroupAdmin(groupId, req.user.id);
    if (!isAdmin) {
      return res.status(400).send({message:"You are not the admin"});
    }
    const member = group.members.find((member) => member.user.toString() === userId);
    if (!member) {
      return res.status(404).send("The member does not exist in the group");
    }
    member.isAdmin = true;
    await group.save();
    return res.status(200).send("Member is now an admin");
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
