import mongoose from "mongoose";
require("dotenv").config();
import GroupModel,{GroupDocument} from "../models/groupModels";
import { group } from "console";

export async function isMember(userId:string,groupId:string):Promise<Boolean>{
  try {
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return false; // Expense not found
    }
    for (const member of group.members) {
      if (member.user.toString() === userId) {
        return true; // Found a match, userId is a member of the group
      }
    }
    return false
  } catch (error) {
    console.error(error);
    return false; // Error occurred
  }
}

