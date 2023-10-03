import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import ExpenseModel,{ExpenseDocument} from '../models/expenseModels';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
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
      desc:req.body?.desc
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

export default router