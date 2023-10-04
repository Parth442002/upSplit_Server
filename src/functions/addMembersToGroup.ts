import GroupMemberModel,{  GroupMemberDocument } from '../models/groupMemberModel'
import { GroupDocument } from '../models/groupModels';
import UserModel from '../models/userModel';

export async function addMembersToGroup(group: GroupDocument, usersData: Array<GroupMemberDocument>): Promise<GroupDocument> {
  // Iterate over the array of user data objects
  for (const userData of usersData) {
    const {user} = userData;
    // Check if the user already exists in the group members
    const existingMember = group.members.find((member: GroupMemberDocument) =>
      member.user.toString() === user
    );

    if (!existingMember) {
      // Create a new GroupMember document for the user
      const newMember: GroupMemberDocument = new GroupMemberModel({...userData,groupId:group.id});

      // Add the new member to the group's members attribute
      group.members.push(newMember);

      // Save the new member as an individual document
      await newMember.save();
    }
  }

  // Save the updated group document
  await group.save();
  return group
}