import mongoose, { Schema, Document } from 'mongoose';

type DebtMapType = Map<String, number>;

// Factory function to create the default DebtMap
function createDefaultDebtMap() {
  return new Map<string, number>();
}

export interface UserDocument extends Document {
  phoneNumber: string;
  password: string;
  profileUrl?: string;
  username:String;
  token?:String,
  debtMap:DebtMapType,
}
// Create the User schema
const userSchema = new Schema<UserDocument>({
  username:{
    type:String,
    required:true
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    required:true,
    validate: {
      validator: (value: string) => {
        // Validate phone number format using a regular expression
        return /^\d{10}$/.test(value);
      },
      message: 'Invalid phone number format',
    },
  },
  password: {
    type: String,
    required: true,
  },
  profileUrl: {
    type: String,
    trim: true,
  },
  token: { type: String },
  debtMap: {
    type: Map,
    of: Number,
    default: createDefaultDebtMap,
  },
},{
  timestamps: true,
});

// Create the User model
const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
