import UserModel from "../../models/userModel";
import ExpenseModel,{ExpenseDocument} from "../../models/expenseModels";
export async function userDebtAddExpense(expense:ExpenseDocument){
  const payerId=expense.payer.toString()
  const payer=await UserModel.findById(payerId)
  if(!payer){
    return expense
  }
  expense.participants.forEach(async(participant)=>{
    const participantId=participant.user.toString()
    const participantUser=await UserModel.findById(participantId)
    if(participantUser && participantId!=payerId){
      const prevPayerAmount=Number(payer.debtMap.get(participantId)||0)
      const prevParticipantAmount=Number(participantUser.debtMap.get(payerId)||0)
      //Setting DebtMap
      const amount = Number(participant.share) - Number(participant.paidBack)
      payer.debtMap.set(participantId,prevPayerAmount+amount)
      participantUser.debtMap.set(payerId,prevParticipantAmount-amount)
      payer.save()
      participantUser.save()
    }
  })
}


export async function userDebtRemoveExpense(expense:ExpenseDocument){
  const payerId=expense.payer.toString()
  const payer=await UserModel.findById(payerId)
  if(!payer){
    return expense
  }
  expense.participants.forEach(async(participant)=>{
    const participantId=participant.user.toString()
    const participantUser=await UserModel.findById(participantId)
    if(participantUser && participantId!=payerId){
      const prevPayerAmount=Number(payer.debtMap.get(participantId)||0)
      const prevParticipantAmount=Number(participantUser.debtMap.get(payerId)||0)
      //Setting DebtMap
      const amount = Number(participant.share) - Number(participant.paidBack)
      payer.debtMap.set(participantId,prevPayerAmount-amount)
      participantUser.debtMap.set(payerId,prevParticipantAmount+amount)
      payer.save()
      participantUser.save()
    }
  })
}
