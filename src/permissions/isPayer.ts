import express,{ Response} from 'express';
import mongoose from "mongoose";
require("dotenv").config();
import ExpenseModel,{ExpenseDocument} from '../models/expenseModels';


// Function to check if userId is the payer of the expense with expenseId
export async function isPayer(userId:String, expenseId:string):Promise<Boolean> {
  try {
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return false; // Invalid expenseId
    }
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return false; // Expense not found
    }
    // Check if userId matches the payer's ID
    return expense.payer.toString() === userId.toString();
  } catch (error) {
    console.error(error);
    return false; // Error occurred
  }
}




