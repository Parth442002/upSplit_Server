import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import ExpenseModel,{ExpenseDocument} from '../models/expenseModels';
import { ExpenseParticipantDocument } from '../models/expenseParticipantModel';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import {isPayer} from "../permissions/isPayer"

const router = express.Router();

//Get all Expense were you are a payer or participant
router.get("/",verifyToken,async(req:Request,res:Response)=>{
  try {
    console.log(req.user.id)
    const expenses = await ExpenseModel.find({
      $or: [
        { payer: req.user.id }, // User is the payer
        { 'participants.user': req.user.id }, // User is one of the participants
      ],
    }).populate('payer participants.user', 'username');
    return res.status(200).send(expenses)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Server Error")
  }
})

//Create an expense
router.post("/",verifyToken,async(req:Request,res:Response)=>{
  try {
    const {payer,totalAmount,participants,title}=req.body
    if (!(payer && totalAmount  && participants && title)) {
      res.status(400).send("Essential Data Missing");
      return;
    }
    const expense=new ExpenseModel({
      payer:payer,
      totalAmount:totalAmount,
      participants:participants,
      title:title,
      desc:req.body?.desc,
    })
    expense.updateMeta();
    await expense.save()
    return res.status(201).send(expense)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Server Error")
  }
})

//Update an Expense
router.put("/:expenseId/",verifyToken,async(req:Request,res:Response)=>{
  try {
    const { expenseId } = req.params;
    const updates = req.body; // Updated expense data

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }

    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      expenseId,
      updates,
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    // Call the updateMeta function on each participant
    for (const participant of updatedExpense.participants) {
      participant.updateMeta();
  }

    updatedExpense.updateMeta();
    await updatedExpense.save()
    return res.status(201).send(updatedExpense)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Server Error")
  }
})
//Delete Expense only if Payer
router.delete('/:expenseId', verifyToken, async (req:Request, res:Response) => {
  try {
    const { expenseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }
    const userId = req.user.id;
    const userIsPayer = await isPayer(userId, expenseId);
    if (!userIsPayer) {
      return res.status(403).json({ error: 'You are not the payer of this expense' });
    }

    const deletedExpense = await ExpenseModel.findOneAndDelete({ _id: expenseId });

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    return res.json({ message: 'Expense deleted successfully', deletedExpense });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Settle an Expense
router.put("/settle/:expenseId/:userId/",verifyToken, async(req:Request,res:Response)=>{
  try {
    const {expenseId,userId}=req.params
    const {amount}=req.body
    //?Implement Checks for amount
    //Invalid Params
    if (!mongoose.Types.ObjectId.isValid(expenseId)||!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid expense ID' });
    }
    const expense=await ExpenseModel.findById(expenseId)
    if(!expense){
      return res.status(404).send("Expense not found")
    }
    const participant = expense.participants.find((participant: ExpenseParticipantDocument) =>
    participant.user.toString() === userId
    );
    if(!participant){
      return res.status(404).send("The given user is not a participant of the expense")
    }
    //Only if all the checks return true
    participant.paidBack=participant.paidBack+amount
    participant.updateMeta()
    participant.save()
    expense.updateMeta()
    expense.save()
    return res.status(200).send(expense)
  } catch (error) {
    console.log(error)
    return res.status(400).send("Internal Server Error")
  }
})

export default router