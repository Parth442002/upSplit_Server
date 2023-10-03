import express,{ Response} from 'express';
require("dotenv").config();
import ExpenseModel,{ExpenseDocument} from '../models/expenseModels';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
const router = express.Router();

//Get all Expense were you are a payer or participant
router.get("/",verifyToken,async(req:Request,res:Response)=>{
  try {
    const expenses = await ExpenseModel.find({
      $or: [
        { payer: req.user.user_id }, // User is the payer
        { 'participants.user': req.user.user_id }, // User is one of the participants
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


export default router