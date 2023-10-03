import mongoose,{Schema,Document,} from "mongoose";

export interface GroupParticipantDocument extends Document{
  user:String,
  isAdmin:Boolean,
  joinDate:Date
}

const GroupParticipantSchema=new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model (assuming you have a User model)
    required: true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  joinDate:{
    type:Date,
    default:Date.now
  }
})

const GroupParticipantModel = mongoose.model<GroupParticipantDocument>('GroupParticipant', GroupParticipantSchema);

export default GroupParticipantModel;
