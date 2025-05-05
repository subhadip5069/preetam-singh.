const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  transactionId: String,
  notes: String,

  // New fields
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Bank'],
    required: true
  },
  upiId: {
    type: String,
    required: function () {
      return this.paymentMethod === 'UPI';
    }
  },
  bankDetails: {
    accountHolderName: {
      type: String,
      required: function () {
        return this.paymentMethod === 'Bank';
      }
    },
    accountNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === 'Bank';
      }
    },
    ifscCode: {
      type: String,
      required: function () {
        return this.paymentMethod === 'Bank';
      }
    },
    bankName: {
      type: String,
      required: function () {
        return this.paymentMethod === 'Bank';
      }
    }
  }
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
