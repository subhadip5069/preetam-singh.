const express = require('express');
const router = express.Router();


const AdminPagesController = require('../../controller/admin/admin.pagescontroller');
const User = require('../../models/User');
const Withdrawal = require('../../models/withdrawl');
 const { AdminauthMiddleware } = require("../../middleware/middleware")
// Admin Pages Routes
router.get('/', AdminPagesController.login);
router.get('/dashboard', AdminauthMiddleware, AdminPagesController.index);
router.get('/banner', AdminauthMiddleware, AdminPagesController.banner);
router.get('/editbanner/:id', AdminauthMiddleware, AdminPagesController.edtBanner);
router.get('/about', AdminauthMiddleware, AdminPagesController.about);
router.get('/contact', AdminauthMiddleware, AdminPagesController.contact);
router.get('/users', AdminauthMiddleware, AdminPagesController.user);
router.get('/teachers', AdminauthMiddleware, AdminPagesController.Teachers);
router.get('/payments', AdminauthMiddleware, AdminPagesController.payments);
router.get('/allcourses', AdminauthMiddleware, AdminPagesController.allcourses);

router.get('/courses', AdminauthMiddleware, AdminPagesController.course);
router.get('/editcourse/:id', AdminauthMiddleware, AdminPagesController.editcourse);
router.get('/courseDocuments/:id', AdminauthMiddleware, AdminPagesController.attachmentsfile);
router.get('/viewQue/:id', AdminauthMiddleware, AdminPagesController.getCourseDocuments); // Uncomment if needed
router.get('/withdrawl', AdminauthMiddleware, AdminPagesController.getWithdrawalsPage); // Uncomment if needed
router.post('/update/:id', AdminauthMiddleware, AdminPagesController.updateWithdrawalStatus); // Uncomment if needed
router.get('/category', AdminauthMiddleware, AdminPagesController.category);
router.get('/category/edit/:id', AdminauthMiddleware, AdminPagesController.editcategory); // Uncomment if needed


// AJAX user list with search and pagination
// Example Express route
router.get('/users', AdminauthMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
  
    const query = {
      $or: [
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    };
  
    const users = await User.find(search ? query : {}).skip((page - 1) * limit).limit(limit);
    const total = await User.countDocuments(search ? query : {});
    
    res.json({ users, total });
  });
  router.get('/searchWithdrawals', AdminauthMiddleware, async (req, res) => {
    try {
      const { userSearch, dateSearch } = req.query;
  
      const query = {};
  
      // Filter by user name or email
      if (userSearch) {
        const regex = new RegExp(userSearch, 'i');
        query['$or'] = [
          { 'userId.name': regex },
          { 'userId.email': regex }
        ];
      }
  
      // Filter by date
      if (dateSearch) {
        const date = new Date(dateSearch);
        query.requestedAt = { $gte: date.setHours(0, 0, 0, 0), $lt: date.setHours(23, 59, 59, 999) };
      }
  
      const withdrawals = await Withdrawal.find(query).populate('userId');
  
      res.json({ withdrawals });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;