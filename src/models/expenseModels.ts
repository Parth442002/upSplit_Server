import mongoose, { Schema, Document } from 'mongoose';
import ExpenseParticipantModel,{ ExpenseParticipantDocument } from './expenseParticipantModel';
import GroupModel from './groupModels';
import { createUpdateDebtMap } from '../functions/createUpdateDebtMap';
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

// Update the dedbtMap if groupId
ExpenseSchema.post('save',async function (expense: ExpenseDocument, next) {
  // Check if the groupId is present in the input
  if (expense.groupId) {
    // Your post-save logic here
    const group=await GroupModel.findById(expense.groupId)
    if(!group){
      return
    }
    createUpdateDebtMap(expense,group,"save")
  }
  next(); // Continue with the save process
});

ExpenseSchema.post("findOneAndDelete",async function(expense:ExpenseDocument,next){
  if(expense.groupId){
    const group=await GroupModel.findById(expense.groupId)
    if(!group){
      return
    }
    createUpdateDebtMap(expense,group,"delete")
  }
  next();
})

// Define the post-update middleware for ExpenseModel
ExpenseSchema.post("findOneAndUpdate", async function (result: any) {
  const originalExpense = await ExpenseModel.findOne({ _id: result._id }); // Get the original expense data
  const updatedExpense = result._update.$set || {}; // Get the updated expense data

  if (originalExpense && updatedExpense && originalExpense.groupId) {
    const group = await GroupModel.findById(originalExpense.groupId);
    if (!group) {
      return;
    }

    // Remove the previous values associated with the original expense from the debt map
    await createUpdateDebtMap(originalExpense, group, "delete");

    // Update the debt map with the new values for the updated expense
    await createUpdateDebtMap(updatedExpense, group, "save");
  }
});

const ExpenseModel = mongoose.model<ExpenseDocument>('Expense', ExpenseSchema);

export default ExpenseModel;
