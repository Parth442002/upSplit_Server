import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import ExpenseModel,{ExpenseDocument} from '../models/expenseModels';
import { ExpenseParticipantDocument } from '../models/expenseParticipantModel';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import {isPayer} from "../permissions/isGroupParticipant"

const router = express.Router();

//Get User Stats
router.get("stats",verifyToken,async(req:Request,res:Response)=>{
  try {
    let debtMap={}
    const expenses = await ExpenseModel.find({
      'participants.user': req.user.id,settled: false});
  } catch (error) {

  }
})



export default router;