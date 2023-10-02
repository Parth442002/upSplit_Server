import mongoose, { Schema, Document } from 'mongoose';

// Define the User document interface
export interface PaymentDocument extends Document {
  sender:String,
  receiver:String,
  amount:Number,
  remarks?:String,
  isCompleted:Boolean,
}
// Create the User schema
const paymentSchema = new Schema<PaymentDocument>({
  sender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount:{
    type:Number,
    required:true,
    min:0,
    max:10000000
  },
  remarks:{
    type:String,
    required:false,
    maxlength:150
  },
  isCompleted:{
    type:Boolean,
    default:false,
  }
},{timestamps:true});

// Create the User model
const PaymentModel = mongoose.model<PaymentDocument>('Payment', paymentSchema);

export default PaymentModel;
