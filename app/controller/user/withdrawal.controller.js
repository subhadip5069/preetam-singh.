const Withdrawal = require('../../models/withdrawl');
const User = require('../../models/User');

class WithdrawalController {

  // Create a withdrawal request and deduct from user's bonus
  createWithdrawalRequest = async (req, res) => {
    try {
      const { amount, userId, paymentMethod, upiId, bankDetails } = req.body;

      // Validate user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      // Validate amount
      if (amount < 100) {
        return res.status(400).json({ message: 'Minimum withdrawal amount is 100.' });
      }
      if (amount > user.mybonus) {
        return res.status(400).json({ message: 'Withdrawal amount exceeds your available bonus.' });
      }

      // Validate payment method details
      if (!paymentMethod || !['UPI', 'Bank'].includes(paymentMethod)) {
        return res.status(400).json({ message: 'Invalid or missing payment method.' });
      }

      if (paymentMethod === 'UPI') {
        if (!upiId) {
          return res.status(400).json({ message: 'UPI ID is required for UPI withdrawals.' });
        }
      } else if (paymentMethod === 'Bank') {
        const { accountHolderName, accountNumber, ifscCode, bankName } = bankDetails || {};
        if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
          return res.status(400).json({ message: 'All bank details are required for Bank withdrawals.' });
        }
      }

      // Deduct the amount from user's bonus
      user.mybonus -= amount;
      await user.save();

      // Create withdrawal object
      const withdrawalData = {
        userId,
        amount,
        status: 'pending',
        paymentMethod,
      };

      if (paymentMethod === 'UPI') {
        withdrawalData.upiId = upiId;
      } else if (paymentMethod === 'Bank') {
        withdrawalData.bankDetails = bankDetails;
      }

      const withdrawal = new Withdrawal(withdrawalData);
      await withdrawal.save();

      res.status(201).json({
        message: 'Withdrawal request submitted successfully.',
        withdrawal
      });

    } catch (error) {
      console.error('Withdrawal request error:', error);
      res.status(500).json({ message: 'Server error while processing withdrawal request.' });
    }
  };
}

module.exports = new WithdrawalController();
