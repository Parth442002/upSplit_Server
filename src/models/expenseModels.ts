import mongoose, { Schema, Document } from 'mongoose';
import ExpenseParticipantModel,{ ExpenseParticipantDocument } from './expenseParticipantModel';
import GroupModel from './groupModels';
import { createUpdateDebtMap } from '../functions/createUpdateDebtMap';
import { addExpenseDebtMap } from '../functions/DebtMap/addExpenseDebtMap';
import { removeExpenseDebtMap } from '../functions/DebtMap/removeExpenseDebtMap';
export interface ExpenseDocument extends Document{
  payer:String,
  totalAmount:Number,
  amountPayed?:Number,
  participants: ExpenseParticipantDocument[];
  groupId?:String;
  //Meta Data
  title:String,
  desc?:String,
  settled?:Boolean,
  settleDate?:Date,


  //Functions
  updateMeta(): Boolean;
}

const ExpenseSchema:Schema=new mongoose.Schema({
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
    default:0,
    required:false
  },
  participants: {
    type: [ExpenseParticipantModel.schema],
    default: [],
  },
  groupId:{
    type:mongoose.Schema.Types.ObjectId,
    required:false,
  },
  title:{
    type:String,
    maxLength:150,
  },
  desc:{
    type:String,
    required:false
  },
  settled:{
    type:Boolean,
    required:false
  },
  settleDate:{
    type:Date,
    required:false
  }
},{
  timestamps: true, // Enable timestamps
})
//Update Functions
ExpenseSchema.methods.updateMeta = function () {
  const payerId = this.payer.toString();
  this.participants.forEach((participant: ExpenseParticipantDocument) => {
    if(participant.user.toString() === payerId){
      participant.isPayer=true
      participant.paidBack=participant.share
    }
    participant.updateMeta()
    participant.save()
  });
  //Calculate the amountPayed
  this.amountPayed = this.participants.reduce((total: number, participant: ExpenseParticipantDocument) => {
    // Ensure both 'total' and 'participant.paidBack' are of type 'number'
    return total + (participant.paidBack.valueOf() || 0);
  }, 0);
  this.settled = this.amountPayed === this.totalAmount;
  if(this.settled){
    this.settleDate = new Date();
  }
};


const ExpenseModel = mongoose.model<ExpenseDocument>('Expense', ExpenseSchema);

export default ExpenseModel;
