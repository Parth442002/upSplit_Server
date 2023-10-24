require('dotenv').config();
import express, { Express, Request, Response } from "express";
import connect from "./config/database"
import cors from "cors"
//Route Files
import AuthRoutes from "./routes/authentication.routes"
import ExpenseRoutes from "./routes/expense.routes";
import GroupRoutes from "./routes/group.routes"
import GroupExpenseRoutes from "./routes/groupExpenses.routes";

//Config Files
const port:Number = Number(process.env.port)||8000
const app: Express = express();
app.use(express.json());
app.use(cors());
//Routes Information
app.get("",async(req:Request,res:Response)=>{
  try {
    return res.status(200).send({status:true,message:"Connected"})
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
})
app.use("/auth",AuthRoutes);
app.use("/expenses",ExpenseRoutes);
app.use("/groups",GroupRoutes);
app.use("/groups",GroupExpenseRoutes);

//Connect to DB
connect();
app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});