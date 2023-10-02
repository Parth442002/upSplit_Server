import mongoose, { Schema, Document } from 'mongoose';

export interface ExpenseParticipantDocument extends Document{
  user:String,
  share:Number,
  paidBack:Number,
  settled:Boolean,
  isPayer:Boolean,
  settledDate:Date,
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
    type:Boolean,
    default:false,
  },
  settledDate:{
    type:Date,
    required:false
  },
  isPayer:{
    type:Boolean,
  }
},{timestamps:true});

ExpenseParticipantSchema.methods.updateMeta=function(){
  this.settled=this.share==this.paidBack
  if(this.settled==true){
    this.settledDate=new Date();
  }
  return this.settled
}

const ExpenseParticipantModel = mongoose.model<ExpenseParticipantDocument>('ExpenseParticipant', ExpenseParticipantSchema);

export default ExpenseParticipantModel;