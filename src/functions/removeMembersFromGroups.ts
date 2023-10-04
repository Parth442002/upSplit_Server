import GroupMemberModel,{  GroupMemberDocument } from '../models/groupMemberModel'
import { GroupDocument } from '../models/groupModels';


export async function removeMembersFromGroups(group: GroupDocument, userIds: Array<string>): Promise<GroupDocument> {
  //Remove GroupMember Instances
  await GroupMemberModel.deleteMany({ user: { $in: userIds }, groupId: group.id });
  //Remove from Groups Members
  group.members = group.members.filter((member: GroupMemberDocument) => !userIds.includes(member.user.toString()));

  await group.save();
  return group
}
