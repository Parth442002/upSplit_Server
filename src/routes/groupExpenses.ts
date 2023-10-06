import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import GroupModel,{GroupDocument} from '../models/groupModels';
import GroupMemberModel,{GroupMemberDocument} from '../models/groupMemberModel';
import ExpenseModel,{ExpenseDocument} from '../models/expenseModels';
import UserModel from '../models/userModel';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import { isMember } from '../permissions/isMember';
import { canUserUpdateOrDeleteExpense } from '../permissions/canUpdateDeleteGroupExpense';


const router = express.Router();

//? Get All Expenses of Current Group
router.get('/:groupId/expenses', verifyToken,async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    // Validate the groupId (ensure it's a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'Invalid groupId' });
    }
    const validMember=await isMember(req.user.id,groupId)
    if(!validMember){
      return res.status(404).send({error:"Either the User is not a member of the group, or the group does not exist"})
    }
    // Find all expenses that belong to the specified groupId
    const expenses: ExpenseDocument[] = await ExpenseModel.find({ groupId });
    // Return the list of expenses as JSON
    return res.json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//? Create Expense For Group
router.post("/:groupId/expenses/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { payer, totalAmount, title, participants } = req.body;
    const { groupId } = req.params;

    // Validate the groupId (ensure it's a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'Invalid groupId' });
    }
    // Check if the group exists
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    // Check if the user is a member of the group
    const isUserMember = isMember(req.user.id, groupId);
    if (!isUserMember) {
      return res.status(403).json({ error: 'Permission Denied' });
    }
    // Check if all participants of the expense are members of the group
    const groupMembers = group.members.map(member => member.user.toString());
    const participantUserIds = participants.map((participant: { user: any; }) => participant.user);
    if (!participantUserIds.every((userId: string) => groupMembers.includes(userId))) {
      return res.status(400).json({ error: 'Not all participants are members of the group' });
    }
    // Check for duplicate participants by comparing user IDs
    const uniqueParticipants = Array.from(new Set(participantUserIds));
    if (uniqueParticipants.length !== participantUserIds.length) {
      return res.status(400).json({ error: 'Duplicate participants are not allowed' });
    }

    // Create the expense
    const newExpense = new ExpenseModel({
      payer:payer,
      totalAmount:totalAmount,
      title:title,
      desc:req.body?.desc,
      participants:participants,
      groupId:groupId,
    });
    // Save the updated group and the new expense
    newExpense.updateMeta();
    await newExpense.save();
    return res.status(201).json({ message: 'Expense added to the group successfully', expense: newExpense });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router