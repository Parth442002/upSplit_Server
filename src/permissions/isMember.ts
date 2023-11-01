require("dotenv").config();
import GroupModel,{GroupDocument} from "../models/groupModels";

export async function isMember(userId:string,groupId:string):Promise<Boolean>{
  try {
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return false;
    }
    for (const member of group.members) {
      if (member.user.toString() === userId) {
        return true;
      }
    }
    return false
  } catch (error) {
    console.error(error);
    return false;
  }
}


