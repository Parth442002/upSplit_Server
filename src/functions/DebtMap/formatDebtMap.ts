import GroupModel, { GroupDocument } from "../../models/groupModels";
import ExpenseModel, { ExpenseDocument } from "../../models/expenseModels";
import UserModel from "../../models/userModel";

// Define a function to format the debt map with user names and send as JSON
// Define a function to format the debt map with user names and send as JSON
export async function formatDebtMap(group: GroupDocument) {
  const formattedDebtMap = [];

  for (const [debtKey, amount] of group.DebtMap.entries()) {
    const [receiverId,senderId] = debtKey.split("-");
    const sender = await UserModel.findById(senderId);
    const receiver = await UserModel.findById(receiverId);

    if (sender && receiver) {
      const senderName = sender.username;
      const receiverName = receiver.username;

      const debtor = amount > 0 ? senderName : receiverName;
      const creditor = amount >= 0 ? receiverName : senderName;
      const absoluteAmount = Math.abs(amount);

      // Create a formatted description of the debt
      const debtDescription = `${debtor} owes ${creditor} $${absoluteAmount}`;
      if(absoluteAmount!=0){
        formattedDebtMap.push({
          debtor,creditor,debtDescription
        })
      }
    }
  }
  // Return the formattedDebtMap as JSON
  return JSON.stringify(formattedDebtMap, null, 2);
}

