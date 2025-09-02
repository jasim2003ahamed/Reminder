import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  purchaseDate: Date,
  reminderDate: Date,
  address: String, 
  dob: Date,
  reminderSent: { type: Boolean, default: false },
  note: {
    type: String,
    default: ''
  },
  preferredDelivery: [String],
   
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
