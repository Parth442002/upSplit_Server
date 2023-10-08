import mongoose from "mongoose";
import GroupModel, { GroupDocument } from "../models/groupModels";
import ExpenseModel, { ExpenseDocument } from "../models/expenseModels";

export async function createUpdateDebtMap(expense:ExpenseDocument,group:GroupDocument):Promise<void>
{
  const receiver=expense.payer.toString()
  expense.participants.forEach((participant)=>{
    const sender=participant.user.toString()
    const debtKey = `${receiver}-${sender}`;
    const reversedDebtKey=`${sender}-${receiver}`
    const expenseBalance=Number(participant.share)-Number(participant.paidBack)||0

    //If the same receiver,Sender RelationShip Exits
    if(receiver!=sender && group.DebtMap.has(debtKey)){
      const prevBalance=group.DebtMap.get(debtKey)||0
      group.DebtMap.set(debtKey,prevBalance+expenseBalance)
    }
    //If the reversed sender,receiver RelationShip Exits
    else if(receiver!=sender && group.DebtMap.has(reversedDebtKey)){
      const prevBalance=group.DebtMap.get(reversedDebtKey)||0
      group.DebtMap.set(reversedDebtKey,prevBalance-expenseBalance)
    }
    else if(receiver!=sender){
      group.DebtMap.set(debtKey,expenseBalance)
    }
    //If No relationShip Exists
  })
  console.log(group.DebtMap,"This should be it")
  group.save()
}