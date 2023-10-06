import mongoose, { Schema, Document } from 'mongoose';
import ExpenseParticipantModel,{ ExpenseParticipantDocument } from './expenseParticipantModel';
export interface ExpenseDocument extends Document{
  payer:String,
  totaAmount:Number,
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
  //Updating the status of the payer
  const payer: ExpenseParticipantDocument | undefined = this.participants.find(
    (participant: ExpenseParticipantDocument) => participant.isPayer
  );
  if (payer) {
    payer.paidBack = payer.share;
    payer.updateMeta();
  }

  return this.settled
};

const ExpenseModel = mongoose.model<ExpenseDocument>('Expense', ExpenseSchema);

export default ExpenseModel;
