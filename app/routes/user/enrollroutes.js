const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authMiddleware } = require('../../middleware/middleware');
const Course = require('../../models/courses');
const Payment = require('../../models/payment');
const User = require('../../models/User');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ------------------------
// CREATE ORDER
// ------------------------
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { courseId, useReferral } = req.body;

    // Fetch the course and user from the database
    const course = await Course.findById(courseId);
    const user = await User.findOne({ _id: req.user.id });

    // Ensure course and user are found
    if (!course || !user) {
      return res.status(404).json({ error: 'Course or User not found' });
    }

    // Calculate final course price after discount
    const discountedPrice = course.price - (course.price * course.discount / 100);
    const totalAmount = discountedPrice ;

    let bonusUsed = 0;
    let walletUsed = 0;
    let payableAmount = totalAmount;

    // Apply bonus if applicable
    if (useReferral && user.mybonus > 0) {
      bonusUsed = Math.min(user.mybonus, totalAmount);
      payableAmount -= bonusUsed;
    }

    // Apply wallet balance if any
    if (payableAmount > 0 && user.wallet > 0) {
      walletUsed = Math.min(user.wallet, payableAmount);
      payableAmount -= walletUsed;
    }

    // Update user wallet/bonus
    if (bonusUsed > 0) user.mybonus -= bonusUsed;
    if (walletUsed > 0) user.wallet -= walletUsed;
    await user.save();

    // Case 1: If the amount payable is 0, the payment is successful directly
    if (payableAmount === 0) {
      const payment = new Payment({
        courseId,
        userId: user._id,
        amount: totalAmount,
        bonusUsed,
        walletUsed,
        razorpayOrderId: null,
        status: 'success'
      });
      await payment.save();

      return res.json({
        success: true,
        message: 'Course enrolled successfully using bonus/wallet',
        paymentId: payment._id
      });
    }

    // Case 2: If the amount payable is > 0, create a Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(payableAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    });

    const payment = new Payment({
      courseId,
      userId: user._id,
      amount: totalAmount,
      bonusUsed,
      walletUsed,
      razorpayOrderId: order.id,
      status: 'pending'
    });
    await payment.save();

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID, // Send Razorpay key to frontend
      amount: payableAmount,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ------------------------
// VERIFY PAYMENT
// ------------------------
// ------------------------
// VERIFY PAYMENT
// ------------------------
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const userId = req.user.id;

    // Check if the Razorpay signature is provided (it won't be for bonus/wallet payments)
    if (!razorpaySignature) {
      const payment = await Payment.findOne({ razorpayOrderId, userId });
    
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
    
      // Manually generate a fake signature if payment was through bonus/wallet
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + (payment.razorpayPaymentId || 'FAKE_PAYMENT_ID'))
        .digest('hex');
    
      // Update payment status and save fake signature
      payment.status = 'success';
      payment.razorpaySignature = generatedSignature;
      await payment.save();
    
      return res.json({ success: true, message: 'Payment verified successfully (Bonus/Wallet)' });
    }    

    // If signature is provided, perform Razorpay verification
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // If the signature doesn't match, return error
    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Fetch the payment from the database using the orderId and userId
    const payment = await Payment.findOne({ razorpayOrderId, userId });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Update payment status and save Razorpay payment details
    payment.status = 'success';
    payment.razorpayPaymentId = razorpayPaymentId;  // Save Razorpay Payment ID
    payment.razorpaySignature = razorpaySignature;  // Save Razorpay Signature
    await payment.save();

    res.json({ success: true, message: 'Payment verified successfully' });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
});



module.exports = router;
