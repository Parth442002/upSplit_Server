import GroupModel from "../models/groupModels";

export async function isGroupAdmin(groupId: string, userId: string): Promise<Boolean> {
  const group = await GroupModel.findById(groupId);
  if (!group) {
    return false;
  }
  const isGroupMember = group.members.some((member) => member.user.toString() === userId);
  if (!isGroupMember) {
    return false;
  }
  const isAdmin = group.members.find((member) => member.user.toString() === userId)?.isAdmin || false;
  return isAdmin;
}

