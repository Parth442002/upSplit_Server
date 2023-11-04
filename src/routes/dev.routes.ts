import express,{ Response,Request } from 'express';
require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import UserModel,{UserDocument} from '../models/userModel';
import ExpenseModel from '../models/expenseModels';

const router = express.Router();

//All Users View View
router.get("/",async(req:Request,res:Response)=>{
  try {
    const users=await UserModel.find({})
    return res.status(200).send(users)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error");
  }
})

router.delete("/",async(req:Request,res:Response)=>{
  try {
    const expenses=await ExpenseModel.deleteMany({})
    return res.status(200).send(expenses)
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error");
  }
})

type DebtMapType = Map<String, number>;

// Factory function to create the default DebtMap
function createDefaultDebtMap() {
  return new Map<string, number>();
}

router.delete("/debt", async (req: Request, res: Response) => {
  try {
    // Reset the debtMap for all users to default
    const users = await UserModel.find({});
    for (const user of users) {
      user.debtMap = createDefaultDebtMap();
      await user.save();
    }

    return res.status(200).send("DebtMap reset for all users");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router