const Razorpay = require('razorpay');
const Payment = require('../../models/payment');
const User = require('../../models/user');
const Course = require('../../models/courses');
const UserCourse = require('../../models/usercourse');

class PaymentController {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  // Method to create an order
  async createOrder(req, res) {
    try {
      const { courseId, useReferral = 0 } = req.body;

      // Fetch course and user details
      const course = await Course.findById(courseId);
      const user = await User.findById(req.user.id);

      // Ensure course and user are found
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate the discounted price and total including GST
      const discountedPrice = course.price - (course.price * course.discount / 100);
     
      const total = discountedPrice ;

      // Calculate the referral amount that can be used
      const referralUsed = Math.min(user.myBonus, useReferral);
      const remaining = Math.max(total - referralUsed, 0); // Ensure remaining amount is >= 0

      // If remaining amount is 0 or negative, don't proceed with payment
      if (remaining <= 0) {
        return res.status(400).json({ error: 'Remaining amount is zero or invalid' });
      }

      // Create a Razorpay order
      const order = await this.razorpay.orders.create({
        amount: Math.round(remaining * 100), // Amount in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        payment_capture: 1,  // Ensure automatic payment capture
      });

      // Store the payment details in the database
      await Payment.create({
        userId: user._id,
        courseId: course._id,
        amount: total,
        paidUsingReferral: referralUsed,
        paidOnline: remaining,
        razorpayOrderId: order.id
      });

      // Update the user's bonus after using the referral
      user.myBonus -= referralUsed;
      await user.save();

      // Respond with the order ID and remaining amount
      res.json({ orderId: order.id, amount: remaining });
    } catch (err) {
      console.error('Create Order Error:', err);
      res.status(500).json({ error: err.message });
    }
  }

  // Method to verify payment
  async verifyPayment(req, res) {
    try {
      const { razorpayOrderId, razorpayPaymentId } = req.body;

      // Verify payment in the database using the Razorpay order ID
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { razorpayPaymentId, status: 'paid' },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }

      const course = await Course.findById(payment.courseId);
      const user = await User.findById(payment.userId);

      // Set the expiry date for the course
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + parseInt(course.validated));

      // Create a record for the user's course assignment
      await UserCourse.create({
        userId: user._id,
        courseId: course._id,
        expiryDate: expiry
      });

      // Handle referral bonus (if the user was referred by another user)
      if (user.referredBy) {
        const referrer = await User.findOne({ myReferralCode: user.referredBy });
        if (referrer) {
          referrer.myBonus += course.referalBonus || 0;
          await referrer.save();
        }
      }

      // Respond with success message
      res.json({ success: true, message: 'Payment successful and course assigned.' });
    } catch (err) {
      console.error('Verify Payment Error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new PaymentController();
