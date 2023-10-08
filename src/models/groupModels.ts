import mongoose,{Schema,Document,} from "mongoose";
import GroupMemberModel, { GroupMemberDocument } from "./groupMemberModel";
import ExpenseModel,{ExpenseDocument} from "./expenseModels";
import { debugPort } from "process";

type UserTuple = [string, string]; // Tuple of two strings
type DebtMap = Map<UserTuple, number>;
export interface GroupDocument extends Document{
  name:String,
  desc?:String,
  creator:String,
  members:GroupMemberDocument[],
  settled:Boolean,
  createdDate: Date,

  //Used to Store the Money relationships
  DebtMap?:DebtMap,
  //Virtual Properties
  totalExpensesAmount?:Number,
  //Methods
}

const GroupSchema:Schema=new mongoose.Schema({
  name:{
    type:String,
  },
  desc:{
    type:String,
  },
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  members:{
    type: [GroupMemberModel.schema],
    default: [],
  },
  createdDate:{
    type:Date,
    default:Date.now
  },
  debtMap: {
    type: Map,
    of: Number,
    default: new Map(),
  },
})

const GroupModel = mongoose.model<GroupDocument>('Group', GroupSchema);

export default GroupModel;
