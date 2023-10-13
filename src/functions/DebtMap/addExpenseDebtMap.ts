import { group } from 'console';
import GroupModel, { GroupDocument } from "../../models/groupModels";
import ExpenseModel, { ExpenseDocument } from "../../models/expenseModels";

export async function addExpenseDebtMap(expense:ExpenseDocument){
  if (!expense.groupId){
    return;
  }
  const group=await GroupModel.findById(expense.groupId)
  if(!group){
    return;
  }
  const receiver=expense.payer.toString()
  expense.participants.forEach((participant)=>{
    const debtKey=`${receiver}-${participant.user.toString()}`
    const reversedKey=`${participant.user.toString()}-${receiver}`
    const participantExpenseBalance=Number(participant.share)-Number(participant.paidBack)||0
    //We won't calculate anything for same iDs
    if (receiver==participant.user.toString()){
      return;
    }
    if(group.DebtMap.has(debtKey)){
      const prevBalance=group.DebtMap.get(debtKey)
      group.DebtMap.set(debtKey,Number(prevBalance)+participantExpenseBalance)
    }
    else if(group.DebtMap.has(reversedKey)){
      const prevBalance=group.DebtMap.get(reversedKey)
      group.DebtMap.set(reversedKey,Number(prevBalance)-participantExpenseBalance)
    }
    else{
      group.DebtMap.set(debtKey,participantExpenseBalance)
    }
  })
  await group.save();
}