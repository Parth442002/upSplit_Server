import GroupModel from "../../models/groupModels";
import { PaymentDocument } from "../../models/PaymentModel";

export async function removePaymentDebtMap(payment: PaymentDocument) {
  if (!payment.group) {
    return;
  }

  const group = await GroupModel.findById(payment.group);

  if (!group) {
    return;
  }

  const payer = payment.payer.toString();
  const payee = payment.payee.toString();
  const amount = payment.amount;

  // Update the group's DebtMap by undoing the previous payment
  const debtKey = `${payer}-${payee}`;
  const reversedKey = `${payee}-${payer}`;

  if (group.DebtMap.has(debtKey)) {
    const prevBalance = group.DebtMap.get(debtKey);
    group.DebtMap.set(debtKey, Number(prevBalance) + amount);
  } else if (group.DebtMap.has(reversedKey)) {
    const prevBalance = group.DebtMap.get(reversedKey);
    group.DebtMap.set(reversedKey, Number(prevBalance) - amount);
  }

  await group.save();
}

