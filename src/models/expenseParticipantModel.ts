import mongoose, { Schema, Document } from 'mongoose';

export interface ExpenseParticipantDocument extends Document{
  user:String,
  share:Number,
  paidBack:Number,
  settled:Boolean,
  settleDate:Date,
  isPayer:Boolean
}
const ExpenseParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  share:{
    type:Number,
    required:true,
    min:0,
  },
  paidBack:{
    type:Number,
    default:0,
    min:0,
  },
  settled:{
    type:Boolean
  },
  settlementDate:{
    type:Date,
    required:false
  },
  isPayer:{
    type:Boolean,
  }
});
//Figure out Settled
ExpenseParticipantSchema.virtual('settled').get(function () {
  return this.paidBack >= this.share;
});
// Update
ExpenseParticipantSchema.virtual('settlementDate').get(function () {
  if (this.paidBack==this.share) {
    return new Date();
  }
});

const ExpenseParticipantModel = mongoose.model<ExpenseParticipantDocument>('ExpenseParticipant', ExpenseParticipantSchema);

export default ExpenseParticipantModel;