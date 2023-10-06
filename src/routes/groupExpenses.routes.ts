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

//? Get All Group Expenses
router.get('/:groupId/expenses', verifyToken,async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    // Validate the groupId (ensure it's a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'Invalid groupId' });
    }
    const validMember=await isMember(req.user.id,groupId)
    if(!validMember){
      return res.status(404).send("User/Group mismatch error")
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


//? Add expense to the group
router.post("/:groupId/add_expense", verifyToken, async (req: Request, res: Response) => {
  try {
    const { payer, totalAmount, title, desc, participants } = req.body;
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

    // Check if all participants are members of the group
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
      payer,
      totalAmount,
      title,
      desc,
      participants,
      groupId,
    });

    // Push the new expense to the group's expenses attribute
    if (group.expenses) {
      group.expenses.push(newExpense);
    } else {
      group.expenses = [newExpense];
    }

    // Save the updated group and the new expense
    await group.save();
    newExpense.updateMeta();
    await newExpense.save();

    return res.status(201).json({ message: 'Expense added to the group successfully', expense: newExpense });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//? Delete Expense
router.delete("/:groupId/:expenseId", verifyToken, async (req:Request, res:Response) => {
  try {
    const { groupId, expenseId } = req.params;
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    const isExpenseInGroup = group.expenses.some(expense => expense.id.toString() === expenseId);
    if (!isExpenseInGroup) {
      return res.status(403).json({ error: 'Expense does not belong to the group' });
    }
    const canUpdateDelete=await canUserUpdateOrDeleteExpense(req.user.id,groupId,expenseId)
    if (!canUpdateDelete) {
      return res.status(403).json({ error: 'Permission denied: User cannot delete the expense' });
    }
    // Delete the expense here
    group.expenses = group.expenses.filter(exp => exp.toString() !== expenseId);
    // Save the updated group
    await group.save();
    // Delete the expense
    await ExpenseModel.findByIdAndDelete(expenseId);

    return res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;