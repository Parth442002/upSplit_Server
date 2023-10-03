require('dotenv').config();
import express, { Express, Request, Response } from "express";
import connect from "./config/database"
//Route Files
import AuthRoutes from "./routes/authentication.routes"
import ExpenseRoutes from "./routes/expense.routes";
//Config Files
const port:Number = Number(process.env.port)||8000
const app: Express = express();
app.use(express.json());
//Routes Information
app.use("/auth",AuthRoutes);
app.use("/expenses",ExpenseRoutes);

//Connect to DB
connect();
app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});