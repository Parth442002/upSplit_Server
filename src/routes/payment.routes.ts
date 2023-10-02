import express,{ Response} from 'express';
require("dotenv").config();
import PaymentModel,{PaymentDocument} from '../models/paymentModel';
import { Request } from '../types/Request';
import { verifyToken } from '../middleware/auth';
const router = express.Router();

//Get all Payments from the current user
router.get("/",verifyToken,async (req:Request, res:Response) => {
  try {
    const userId = req.user.id

    const payments: PaymentDocument[] = await PaymentModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });
    return res.status(200).send(payments);
  } catch (error) {
    return res.status(400).send("This is not working")
  }
});

//Make a payment
router.post("/",verifyToken,async (req:Request,res:Response)=>{
  try {
    if (!(req.body.sender && req.body.receiver && req.body.amount)) {
      return res.status(400).send("Please enter valid information");
    }
    const payment=await PaymentModel.create(req.body)
    return res.status(201).send(payment)
  } catch (error) {
    return res.status(400).send("Internal Server Error")
  }
})

export default router