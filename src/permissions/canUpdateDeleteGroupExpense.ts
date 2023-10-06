import GroupModel from "../models/groupModels";
import ExpenseModel from "../models/expenseModels";

export async function canUserUpdateOrDeleteExpense(userId:String, groupId:String, expenseId:String):Promise<Boolean> {
  // Check if the user is an admin of the group
  const isAdmin = await GroupModel.findOne({
    _id: groupId,
    'members.user': userId,
    'members.isAdmin': true,
  });

  if (isAdmin) {
    return true; // User is an admin, so they can update/delete all the expenses the expense
  }

  // Check if the user is the payer of the expense
  const expense = await ExpenseModel.findById(expenseId);

  if (expense && expense.payer.toString() === userId) {
    return true; // User is the payer of the expense, so they can update/delete it
  }

  return false; // User does not meet any of the conditions
}
