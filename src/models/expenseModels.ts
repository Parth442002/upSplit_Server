import mongoose, { Schema, Document, mongo } from 'mongoose';
import ExpenseParticipantModel,{ ExpenseParticipantDocument } from './expenseParticipantModel';

export interface ExpenseDocument extends Document{
  payer:String,
  totaAmount:Number,
  amountPayed:Number,
  participants: ExpenseParticipantDocument[];
  //Meta Data
  title:String,
  desc:String,
  settled:Boolean,
  settleDate:Date
}

const ExpenseSchema=new mongoose.Schema({
  payer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  totalAmount:{
    type:Number,
    required:true,
    min:0,
  },
  amountPayed:{
    type:Number,
  },
  participants: {
    type: [ExpenseParticipantModel.schema],
    default: [],
  },
  title:{
    type:String,
    maxLength:150,
  },
  desc:{
    type:String}
  ,
  settled:{
    type:Boolean
  },
  settleDate:{
    type:Date
  }
})

//Virtual Functions
// Calculate total amountPayed
ExpenseSchema.virtual('amountPayed').get(function () {
  // Calculate the 'amountPayed' by summing up the 'paidBack' values of all participants
  return this.participants.reduce((total, participant) => total + (participant.paidBack.valueOf() || 0), 0);
});

//Figure out Settled
ExpenseSchema.virtual('settled').get(function () {
  return this.totalAmount==this.amountPayed;
});

const ExpenseModel = mongoose.model<ExpenseDocument>('Expense', ExpenseSchema);

export default ExpenseModel;
