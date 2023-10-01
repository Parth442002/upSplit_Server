import express,{ Response,Request } from 'express';
require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import UserModel,{UserDocument} from '../models/userModel';

const router = express.Router();

//User Register View
router.post("/register",async(req:Request,res:Response)=>{
  try {
    console.log(req.body)
    const { phoneNumber,password,username, } = req.body;
    //Fields which are neccesary for User Creation
    if (!(phoneNumber && password && username)) {
      res.status(400).send("Input Data missing");
      return;
    }
    const oldUser=await UserModel.findOne({phoneNumber})
    if (oldUser){
      return res.status(409).send("User Already Exists. Please Login");
    }
    //Creating a new User now
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData={
      phoneNumber: phoneNumber,
      profileUrl:req.body?.profileUrl,
      username:username,
      password: encryptedPassword,
    }
    const user=await UserModel.create(userData)
    const token = jwt.sign(
      { user_id: user._id, phoneNumber:user.phoneNumber,},
      "token",
      {
        expiresIn: "2400h",
      }
    );
    user.token = token;
    await user.save(); // Save the updated customer with the token
    return res.status(201).json(user);
  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error");
  }
})

//User Login Route
router.post("/login",async(req:Request,res:Response)=>{
  try {
    const {phoneNumber,password}=req.body;
    //Check if input is valid
    if (!(phoneNumber && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await UserModel.findOne({ phoneNumber });
    //If user is valid
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, phoneNumber:user.phoneNumber,},
        "token",
        {
          expiresIn: "2400h",
        }
      );
      user.token = token;
      await user.save(); // Save the updated customer with the token
      return res.status(201).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
})


router.get("/welcome", (req, res) => {
  console.log(req.body)
  return res.status(200).send("Welcome Admin 🙌 ");
});

export default router