import mongoose,{Schema,Document,} from "mongoose";

export interface GroupMemberDocument extends Document{
  user:String,
  isAdmin:Boolean,
  groupId?:String,
  balance?:Number,
  settled?:Boolean,
  joinDate?:Date,
}

const GroupMemberSchema=new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  groupId:{
    type:mongoose.Schema.Types.ObjectId,
    required:false
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  joinDate:{
    type:Date,
    default:Date.now
  },
  balance:{
    type:Number,
    default:0,
  },
  settled:{
    type:Boolean,
  }
},{
  timestamps: true, // Enable timestamps
})

const GroupMemberModel = mongoose.model<GroupMemberDocument>('GroupMember', GroupMemberSchema);

export default GroupMemberModel;
