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
    default:0
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


//Update Functions
ExpenseSchema.methods.updateMeta = function () {
  this.amountPayed = this.participants.reduce((total: number, participant: ExpenseParticipantDocument) => {
    // Ensure both 'total' and 'participant.paidBack' are of type 'number'
    return total + (participant.paidBack.valueOf() || 0);
  }, 0);
  this.settled=this.amountPayed==this.totalAmount
  if (this.settled){
    this.settleDate=new Date();
  }
  return this.settled
};

const ExpenseModel = mongoose.model<ExpenseDocument>('Expense', ExpenseSchema);

export default ExpenseModel;
