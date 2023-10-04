import mongoose from "mongoose";
import GroupModel,{GroupDocument} from "../models/groupModels";
import { GroupMemberDocument } from "../models/groupMemberModel";

export function canAddMember(group: GroupDocument, userId: string): boolean {
  // Check if the user is the creator of the group
  if (group.creator.toString() === userId) {
    return true;
  }
  // Check if the user is an admin member of the group
  const isAdminMember = group.members.some((member: GroupMemberDocument) =>
    member.user.toString() === userId && member.isAdmin==true
  );
  return isAdminMember;
}
