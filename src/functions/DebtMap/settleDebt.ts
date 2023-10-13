import GroupModel, { GroupDocument } from "../../models/groupModels";
import ExpenseModel, { ExpenseDocument } from "../../models/expenseModels";

export async function settleDebt(groupId:String,sender:String,receiver:String,amount:Number){
  if(!(sender && receiver && amount)){
    return;
  }
  const group=await GroupModel.findById(groupId)
  if(!group){
    return;
  }
  const debtKey=`${receiver}-${sender}`
  const reverseKey=`${sender}-${receiver}`
  if(group.DebtMap.has(debtKey)){
    const current=group.DebtMap.get(debtKey)||0;
    group.DebtMap.set(debtKey,current-Number(amount));
  }
  else if(group.DebtMap.has(reverseKey)){
    const current=group.DebtMap.get(reverseKey)||0;
    group.DebtMap.set(reverseKey,current+Number(amount));
  }
  else{
    group.DebtMap.set(debtKey,Number(amount));
  }
  return group;
}