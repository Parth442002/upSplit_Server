import GroupModel, { GroupDocument } from "../models/groupModels";
import ExpenseModel, { ExpenseDocument } from "../models/expenseModels";

export async function createUpdateDebtMap(expense: ExpenseDocument, group: GroupDocument, type: string): Promise<void> {

  const receiver = expense.payer.toString();
  expense.participants.forEach((participant) => {
    // Sender will pay the money
    const sender = participant.user.toString();
    const debtKey = `${receiver}-${sender}`;
    const reversedDebtKey = `${sender}-${receiver}`;
    // Current Balance
    const expenseBalance = Number(participant.share) - Number(participant.paidBack) || 0;

    // If the same receiver,Sender RelationShip Exits
    if (receiver != sender && group.DebtMap.has(debtKey)) {
      const prevBalance = group.DebtMap.get(debtKey) || 0;
      if (type == "save") {
        group.DebtMap.set(debtKey, prevBalance + expenseBalance);
      } else {
        group.DebtMap.set(debtKey, prevBalance - expenseBalance);
      }
    }
    // If the reversed sender,receiver RelationShip Exits
    else if (receiver != sender && group.DebtMap.has(reversedDebtKey)) {
      const prevBalance = group.DebtMap.get(reversedDebtKey) || 0;
      if (type == "save") {
        group.DebtMap.set(reversedDebtKey, prevBalance - expenseBalance);
      } else {
        group.DebtMap.set(reversedDebtKey, prevBalance + expenseBalance);
      }
    } else if (receiver != sender) {
      if (type == "save") {
        group.DebtMap.set(debtKey, expenseBalance);
      } else {
        group.DebtMap.delete(debtKey);
      }
    }
    // If No relationship Exists
  });
  console.log(group.DebtMap, "This should be it");
  await group.save(); // Make sure to use await here to save the changes
}
