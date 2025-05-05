const aboutus = require("../../models/aboutus");
const banner = require("../../models/banner");
const category = require("../../models/category.model");
const contactus = require("../../models/contactus");
const coursedocuments = require("../../models/coursedocuments");
const courses = require("../../models/courses");
const Payment = require("../../models/payment");
const User = require("../../models/user");
const Withdrawal = require("../../models/withdrawl");

const shuffleArray = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
class AdminPagesController {
    login(req, res) {
        const message = req.session.message;
        req.session.message = null;
        res.render('admin/login', { message });
    }
    index(req, res) {
      const user = req.user?.id;
        res.render('admin/index', { user });
    }

    // banner page
    banner=async(req, res)=> {
      const user = req.user?.id;
        const banners =await banner.find({}).sort({ createdAt: -1 });
        res.render('admin/banner', { banners,user });
    }
    edtBanner=async(req, res)=> {
        const user = req.user?.id;
        const { id } = req.params;
        const banners = await banner.findById(id);
        res.render('admin/editbanner', { banners, user });
    }

    // about page
    about=async(req, res)=> {
        const user = req.user?.id;
              const aboutUs = await aboutus.findOne();
        
        res.render('admin/about', { aboutUs, user });
    }

    // contact page
    contact=async(req, res)=>{

        const user = req.user?.id;
        const contacts = await contactus.find();
        res.render('admin/contact',{contacts, user});
    }

    // user page
    user=async(req, res)=> {
          const user = req.user?.id;
          const users = await User.find({role:"student"})
        res.render('admin/users',{users,user})
    }
    Teachers=async(req, res)=>{
      const users = await User.find({role:"teacher"})
    res.render('admin/teachers',{users})
}
    // course page
    course=async(req, res)=> {
        const user = req.user?.id;
        const categories = await category.find({}) // Fetch categories for the dropdown
        const cours = await courses.find({}).populate('categoryId', 'name') // Populate category name
        res.render('admin/courses',{
            cours,
            categories, // Fetch categories for the dropdown
            user // Pass user to the view
        })
    }
    editcourse=async(req, res)=> {
        const user = req.user?.id;
        const { id } = req.params;
        const course = await courses.findById(id).
        populate('categoryId', 'name') // Populate category name
        const categories = await category.find({});
        res.render('admin/editCourse', { course, categories });
    }
    attachmentsfile=async(req, res)=> { 
        const user = req.user?.id; 
        const Courses = await courses.findById(req.params.id);
        res.render('admin/courseDocuments', { Courses, user });
    }
    
      
      async  getCourseDocuments(req, res) {
        try {
          const { id } = req.params;
          const user = req.user?.id;
          // Fetch course document by courseId
          const courseDocument = await coursedocuments.findOne({ courseId: id });
      
          // If courseDocument not found, render with no data
          if (!courseDocument) {
            return res.render('admin/viewQues', { courseDocument: null });
          }
      
          // Shuffle assignments and answers
          courseDocument.assignments = courseDocument.assignments.map(assignment => ({
            ...assignment,
            answers: shuffleArray(assignment.answers),
          }));
      
          courseDocument.assignments = shuffleArray(courseDocument.assignments);
      
          // Render with shuffled data
          res.render('admin/viewQues', { courseDocument , user });
      
        } catch (error) {
          console.error('Error fetching course document:', error);
          res.redirect('/admin/courses');
        }
      }

      payments=async(req, res)=> {
        const user = req.user?.id;
        const payments = await Payment.find()
        .populate('userId', 'name email') // Fetch name and email from User
        .populate('courseId', 'title price') // Fetch title and price from Course
        .sort({ createdAt: -1 })
        res.render('admin/payments',{
            payments,
            user
        })
    }

    allcourses=async(req, res)=> {
        const user = req.user?.id;
        const course = await courses.find({}).populate('categoryId', 'name')
        res.render('admin/allcourses',{
            courses: course,
            user
        })
    }
    getWithdrawalsPage = async (req, res) => {
      try {
        const user = req.user?.id;
        const withdrawals = await Withdrawal.find({})
          .populate('userId')
          .sort({ requestedAt: -1 })
          .lean();
    
        res.render('admin/withdrawal', { withdrawals, user });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    };
    
    
  
    // Update withdrawal status and handle deduction of bonus for approved requests
    updateWithdrawalStatus = async (req, res) => {
      try {
        const user = req.user?.id;
        const { id } = req.params;
        const { status, transactionId, notes } = req.body;
  
        // Validate status
        if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status.' });
        }
  
        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
          return res.status(404).json({ message: 'Withdrawal not found.' });
        }
  
        // If approving and not already processed, deduct from user's bonus
        if (status === 'approved' && withdrawal.status !== 'approved') {
          const user = await User.findById(withdrawal.userId);
          if (user.myBonus < withdrawal.amount) {
            return res.status(400).json({ message: 'User does not have sufficient bonus.' });
          }
  
          user.myBonus -= withdrawal.amount;
          await user.save();
  
          withdrawal.processedAt = new Date();
        }
  
        // Update withdrawal status and other fields
        withdrawal.status = status;
        if (transactionId) withdrawal.transactionId = transactionId;
        if (notes) withdrawal.notes = notes;
        if (status === 'completed' || status === 'rejected') {
          withdrawal.processedAt = new Date();
        }
  
        await withdrawal.save();
  
        res.redirect('/admin/withdrawl');  // Redirect after updating
      } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ message: 'Server error.' });
      }
    }

    category=async(req, res)=> {
        const user = req.user?.id;
        const categories = await category.find({})
        res.render('admin/category',{
          categories
          , user
        })
    }
    editcategory=async(req, res)=> {
        const user = req.user?.id;
        const { id } = req.params;
        const categories = await category.findById(id);
        res.render('admin/editCategory', { categories, user });
    }
}

module.exports = new AdminPagesController();