import mongoose,{Schema,Document,} from "mongoose";
import GroupParticipantModel, { GroupParticipantDocument } from "./groupParticipants";

export interface GroupDocument extends Document{
  name:String,
  desc?:String,
  creator:String,
  participants:GroupParticipantDocument[],
  createdDate: Date,
}

const GroupSchema=new mongoose.Schema({
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
  participants:{
    type: [GroupParticipantModel.schema],
    default: [],
  },
  createdDate:{
    type:Date,
    default:Date.now
  }
})


const GroupModel = mongoose.model<GroupDocument>('Group', GroupSchema);

export default GroupModel;
