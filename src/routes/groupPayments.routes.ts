import express,{ Response} from 'express';
require("dotenv").config();
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
import PaymentModel from '../models/PaymentModel';
import { addRepaymentDebtMap } from '../functions/DebtMap/addPaymentDebtMap';
import { removePaymentDebtMap } from '../functions/DebtMap/removePaymentDebtMap';

const router = express.Router();

//? Get All Group Payments
router.get("/:groupId/payments", verifyToken, async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const payments = await PaymentModel.find({ group: groupId });
    return res.status(200).send({ payments }); // Use res.json to send JSON response
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'An error occurred while retrieving the payments' }); // Correct the error message
  }
});


//? Create new Group Payment
router.post('/:groupId/payments/', verifyToken, async (req:Request, res:Response) => {
  try {
    console.log("this should work")
    const {groupId}=req.params;
    const { payer, payee, amount } = req.body;
    if (!(payer && payee  && amount)) {
      res.status(400).send("Essential Data Missing");
      return;
    }

    // Create a new Payment document
    const payment = new PaymentModel({
      payer:payer,
      payee:payee,
      amount:amount,
      description:req.body?.description,
      date:new Date(),
      group: groupId, // Assign the group ID to the payment
    });
    // Save the payment to the database
    await payment.save();
    await addRepaymentDebtMap(payment)
    // Respond with a success message or the saved payment data
    return res.status(201).send({ message: 'Payment created successfully', payment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'An error occurred while creating the payment' });
  }
});

//? Updating Payment
router.put('/:groupId/payments/:paymentId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { groupId, paymentId } = req.params;
    const { payer, payee, amount, } = req.body;

    if (!(payer && payee && amount)) {
      res.status(400).send("Essential Data Missing");
      return;
    }
    const oldPayment=await PaymentModel.findById(paymentId)
    // Find and update the payment
    const updatedPayment = await PaymentModel.findOneAndUpdate(
      { _id: paymentId, group: groupId },
      {
        payer: payer,
        payee: payee,
        amount: amount,
        description: req.body?.description,
        date:new Date(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).send("Payment not found");
    }
    if (updatedPayment && oldPayment){
      await removePaymentDebtMap(oldPayment);
      await addRepaymentDebtMap(updatedPayment)
    }

    return res.status(200).send({ message: 'Payment updated successfully', payment: updatedPayment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'An error occurred while updating the payment' });
  }
});

//? Delete Payments
router.delete('/:groupId/payments/:paymentId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { groupId, paymentId } = req.params;

    // Find and delete the payment
    const deletedPayment = await PaymentModel.findOneAndDelete({ _id: paymentId, group: groupId });

    if (!deletedPayment) {
      return res.status(404).send("Payment not found");
    }

    await removePaymentDebtMap(deletedPayment);

    return res.status(200).send({ message: 'Payment deleted successfully', payment: deletedPayment });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'An error occurred while deleting the payment' });
  }
});

export default router;


