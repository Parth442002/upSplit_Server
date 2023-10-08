import mongoose,{Schema,Document,} from "mongoose";
import GroupMemberModel, { GroupMemberDocument } from "./groupMemberModel";

type DebtMapType = Map<String, number>;

// Factory function to create the default DebtMap
function createDefaultDebtMap() {
  return new Map<string, number>();
}

export interface GroupDocument extends Document{
  name:String,
  desc?:String,
  creator:String,
  members:GroupMemberDocument[],
  settled:Boolean,
  createdDate: Date,

  //Used to Store the Money relationships
  DebtMap:DebtMapType,
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
  DebtMap: {
    type: Map,
    of: Number,
    default: createDefaultDebtMap, // Use the factory function as the default value
  },
})

const GroupModel = mongoose.model<GroupDocument>('Group', GroupSchema);

export default GroupModel;
