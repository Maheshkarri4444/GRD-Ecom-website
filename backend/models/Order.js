const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Address schema
const addressSchema = new Schema(
  {
    doorNo: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true }
  },
  { _id: false } // Disable the _id field for the address subdocument
);

// Define the Order schema
const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    emailAddress: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      type: addressSchema, // Use the address schema
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    bill: {
      type: Number,
      required: true
    },
    amountPaid: {
      type: Number,
      default: 0 // Initially not required
    },
    transactionId: {
      type: String,
      default: null // Initially not required
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'done', 'verified', 'nopayment'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['delivered', 'not yet delivered', 'wrong order'],
      default: 'not yet delivered'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
