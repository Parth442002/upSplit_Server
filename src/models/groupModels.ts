import mongoose,{Schema,Document,} from "mongoose";
import GroupMemberModel, { GroupMemberDocument } from "./groupMember";
import ExpenseModel,{ExpenseDocument} from "./expenseModels";

export interface GroupDocument extends Document{
  name:String,
  desc?:String,
  creator:String,
  members:GroupMemberDocument[],
  expenses:ExpenseDocument[],
  settled:Boolean,
  createdDate: Date,
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
  expenses:{
    type:[ExpenseModel.schema],
    default:[]
  },
  createdDate:{
    type:Date,
    default:Date.now
  }
})


const GroupModel = mongoose.model<GroupDocument>('Group', GroupSchema);

export default GroupModel;
