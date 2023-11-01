require('dotenv').config();
import express, { Express, Request, Response } from "express";
import connect from "./config/database"
//Route Files
import AuthRoutes from "./routes/authentication.routes"
import ExpenseRoutes from "./routes/expense.routes";
import GroupRoutes from "./routes/group.routes"
import GroupExpenseRoutes from "./routes/groupExpenses.routes";
import GroupPaymentRoutes from "./routes/groupPayments.routes";
//Config Files
const port:Number = Number(process.env.port)||8000
const app: Express = express();
app.use(express.json());
//Routes Information
app.use("/auth",AuthRoutes);
app.use("/expenses",ExpenseRoutes);
app.use("/groups",GroupRoutes);
app.use("/groups",GroupExpenseRoutes);
app.use("/groups",GroupPaymentRoutes);

//Connect to DB
connect();
app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
