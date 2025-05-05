// controllers/PaymentController.js
const Razorpay = require('razorpay');
const Payment = require('../../models/payment');
const User = require('../../models/user');
const Course = require('../../models/courses');
const UserCourse = require('../../models/usercourse');
const { razorpay } = require('./paymentcontroller');

// Ensure environment variables are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay keys are not set in environment variables');
}

class PaymentController {
  constructor() {
    // Initialize Razorpay instance with keys
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(req, res) {
    try {
      // Check if razorpay instance is defined
      // if (!this.razorpay) {
      //   return res.status(500).json({ error: 'Razorpay is not initialized' });
      // }

      const { courseId, useReferral = 0 } = req.body;

      // Fetch course and user details
      const course = await Course.findById(courseId);
      const user = await User.findById(req.user.id);

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate price details
      const discountedPrice = course.price - (course.price * course.discount / 100);
      
      const total = discountedPrice 

      // Apply referral (bonus) if available
      const referralUsed = Math.min(user.myBonus, useReferral);
      const remaining = Math.max(total - referralUsed, 0);

      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: Math.round(remaining * 100), // in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1, // Automatically capture payment
      });

      if (!order) {
        return res.status(500).json({ error: 'Failed to create Razorpay order' });
      }

      // Save payment details in the database
      await Payment.create({
        userId: user._id,
        courseId: course._id,
        amount: total,
        paidUsingReferral: referralUsed,
        paidOnline: remaining,
        razorpayOrderId: order.id
      });

      // Update user's bonus balance
      user.myBonus -= referralUsed;
      await user.save();

      // Respond with order details
      res.json({ success: true, orderId: order.id, amount: remaining ,message: 'Order created successfully' });
    } catch (err) {
      console.error('Create Order Error:', err);
      res.status(500).json({ error: 'Internal server error during order creation' });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { razorpayOrderId, razorpayPaymentId } = req.body;

      // Find payment details by Razorpay order ID
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId, status: 'paid' },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }

      // Fetch course and user details
      const course = await Course.findById(payment.courseId);
      const user = await User.findById(payment.userId);

      // Set expiry date for the course
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + parseInt(course.validated));

      // Assign the course to the user
      await UserCourse.create({
        userId: user._id,
        courseId: course._id,
        expiryDate: expiry
      });

      // Handle referral bonus if user was referred
      if (user.referredBy) {
        const referrer = await User.findOne({ myReferralCode: user.referredBy });
        if (referrer) {
          referrer.myBonus += course.referalBonus || 0;
          await referrer.save();
        }
      }

      // Respond with success
      res.json({ success: true, message: 'Payment successful and course assigned.' });
    } catch (err) {
      console.error('Verify Payment Error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new PaymentController();
