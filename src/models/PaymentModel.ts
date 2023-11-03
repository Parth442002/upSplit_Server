import mongoose, { Schema, Document } from 'mongoose';

export interface PaymentDocument extends Document {
  payer: string; // The user who made the payment
  payee: string; // The user who received the payment
  amount: number;
  remarks?: string;
  date: Date;
  group?: string; // The group to which the payment belongs
}

const PaymentSchema: Schema = new mongoose.Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  remarks: {
    type: String,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group', // Reference the Group model
  },
},{
  timestamps: true, // Enable timestamps
});

const PaymentModel = mongoose.model<PaymentDocument>('Payment', PaymentSchema);

export default PaymentModel;
