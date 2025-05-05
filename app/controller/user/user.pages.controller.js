const User = require("../../models/user");
const ReferalBonus = require("../../models/refaralbouns")
const courses = require("../../models/courses");
const CourseDocument = require("../../models/coursedocuments");
const Payment = require("../../models/payment");
const moment = require("moment/moment");
const coursedocuments = require("../../models/coursedocuments");
const category = require("../../models/category.model");


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  // Helper to check answer and color
  function getAnswerColor(selected, correct, answer) {
    if (selected === correct && answer === selected) {
      return 'text-success'; // selected and correct → green
    }
    if (selected !== correct && answer === selected) {
      return 'text-danger'; // selected wrong → red
    }
    if (answer === correct) {
      return 'text-success'; // correct answer (even if user selected wrong) → green
    }
    return '';
  }
class userpagesController{

  index = async (req, res) => {
    try {
      const user = req.user?.id;
      const categories = await category.find();
  
      // For each category, find one course
      const coursePerCategory = await Promise.all(
        categories.map(async (cat) => {
          const course = await courses.findOne({ category: cat._id }); // or categoryId: cat._id
          return {
            category: cat.name,
            categoryId: cat._id,
            course: course || null,
          };
        })
      );
  
      const message = "Welcome to our course portal";
      res.json({ message, user, coursePerCategory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
    profile=async(req, res)=>{
        const user = req.user?.id || null;
        const refferalbonus = await ReferalBonus.findOne()
        const me = await User.findById(user);
        const payment = await Payment.find({userId:user})
        const course = await courses.find({_id:{$in:payment.map((p)=>p.courseId)}})
        const coursedocument = await CourseDocument.find({courseId:{$in:payment.map((p)=>p.courseId)}})
        const message = "Welcome to our course portal"
        res.json ({message,user,me,refferalbonus,rzpKey:process.env.RAZORPAY_KEY});
    }
    contact(req, res){
        const user = req.user?.id

        const message = "Welcome to our course portal";
        res.json({message,user});
    }
    about(req, res){
        const user = req.user?.id

        const message = "Welcome to our course portal";
        res.json({
            message,
            user
        });
    }
    courses=async(req, res)=>{
        const user = req.user?.id 
        const course = await courses.find()
        const message ="Welcome to our course portal"
        res.json({
            message,
            user,course
        });
    }

    getcoursesbycategory=async(req, res)=>{
        const user = req.user?.id
        const course = await courses.find({ categoryId: req.params.id });
        const message = "Welcome to our course portal"
        res.json({
            message,
            user,
            course
        })
    }

    paymentpage=async(req, res)=>{
        const user = req.user?.id
        const course = await courses.find()
        const message = "Welcome to our course portal"
        res.json({
            message,
            user,
            course
        });
    }

    enrollment = async (req, res) => {
        try {
          const course = await courses.findById(req.params.id);
          const user = await User.findById(req.user?.id.id);
      
          if (!course || !user) {
            return res.json({ error: 'Course or user not found' });
          }

          console.log(user.mybonus)
      
          const discountedPrice = course.price - (course.price * course.discount / 100);
          const total = discountedPrice ;
      const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
          const userBonus = user.mybonus || 0;
          const payableWithBonus = Math.max(total - userBonus, 0);
          const remainingBonus = Math.max(userBonus - total, 0);
      
          const message = req.session.message;
          req.session.message = null;
      
          res.json( {
            message,
            user,
            course,
            total,
            discountedPrice,
            userBonus,
            payableWithBonus,
            remainingBonus,
            RAZORPAY_KEY_ID,message:"Welcome to our course portal"
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };


      paymentHistory = async (req, res) => {
        try {
          const userId = req.user?.id;
          const page = parseInt(req.query.page) || 1; // Page number from query params
          const limit = 5; // How many payments per page
          const skip = (page - 1) * limit;
      
          const payments = await Payment.find({ userId })
            .populate('courseId', 'title validated price discount') // Populate relevant fields
            .sort({ createdAt: -1 });
      
        //   console.log(payments);
      
          const totalPayments = await Payment.countDocuments({ userId });
      
          // Calculate start and end dates for each course based on validity
          const processedPayments = [];
      
          for (let i = 0; i < payments.length; i++) {
            const payment = payments[i];
            const course = payment.courseId;
      
            let startDate = payment.createdAt; // Start date is when the payment was created
            let endDate;
            let validityDuration = course.validated; // This is a number, e.g. 30 days
      
            // Check if validity exists and is a number
            if (validityDuration && typeof validityDuration === 'number') {
              // Calculate the end date based on the validity in days
              endDate = moment(startDate).add(validityDuration, 'days').startOf('day').toDate();
            } else {
              endDate = moment(startDate).toDate(); // Default to start date if validity is invalid or missing
            }
      
            // Determine if the course is expired
            const isExpired = moment().isAfter(endDate) ? "Expired" : "Valid"; // Comparing only date, not time
      
            // Add the calculated dates and validity status to the payment object
            processedPayments.push({
              ...payment.toObject(),
              startDate,
              endDate,
              isExpired,
            });
          }
      
          res.json({
            payments: processedPayments,
            currentPage: page,
            totalPages: Math.ceil(totalPayments / limit),
          });
        } catch (err) {
          console.error('Error fetching payment history:', err.message);
          res.status(500).json({ message: 'Something went wrong while fetching payment history' });
        }
      };
      
   // Define shuffleArray at the top

  

  

      mycourses = async (req, res) => {
        try {
          const userId = req.user?.id;
          const payments = await Payment.find({ userId })
            .populate('courseId', 'title validated price') // Populate relevant fields from the Payment model
            .sort({ createdAt: -1 });
          
          const courseIds = payments.map(payment => payment.courseId);
          
          const course = await courses.find({ _id: { $in: courseIds } }); // Ensure model name 'Course' matches your model
          
          const message = req.session.message;
          req.session.message = null;
          
          res.json({ courses: course, message });
        } catch (error) {
          console.error(error);
          req.session.message = { type: 'error', text: 'Something went wrong. Please try again.' };
          res.json({ message: req.session.message });
        }
      };
      getCourseDocuments = async (req, res) => {
        try {
          const { id } = req.params;
          const user = req.user?.id;
          const message = req.session.message || null;
          req.session.message = null;
      
          const courseDocument = await CourseDocument.findOne({ courseId: id }).lean();
      
          if (!courseDocument) {
            return res.json( { courseDocument: null, user, message });
          }
      
          const shuffledAssignments = shuffleArray([...courseDocument.assignments]);
      
          // Store shuffled assignment order in session for review use
          req.session.shuffledAssignments = shuffledAssignments.map((item, index) => ({
            originalIndex: index,
            question: item.questions
          }));
      
          res.json( {
            courseDocument: {
              ...courseDocument,
              assignments: shuffledAssignments
            },
            user,
            message
          });
      
        } catch (error) {
          console.error('Error fetching course document:', error);
         res.json({ error: 'Failed to fetch course document' });
        }
      };
      // Submit Assignment Controller
      submitAssignment = async (req, res) => {
        const { selectedAnswers } = req.body;
        const courseId = req.params.id;
      
        try {
          const courseDoc = await CourseDocument.findById(courseId).lean();
      
          if (!courseDoc) return res.status(404).json({ error: 'Course not found' });
      
          const shuffledAssignments = req.session.shuffledAssignments || courseDoc.assignments;
          const originalAssignments = courseDoc.assignments;
      
          const feedback = shuffledAssignments.map((shuffledItem, index) => {
            const userAnswer = selectedAnswers[index];
            const originalItem = originalAssignments.find(
              item => item.questions === shuffledItem.question
            );
      
            const isCorrect = userAnswer === originalItem.correctAnswer;
            const marksAwarded = isCorrect ? originalItem.marks : 0;
      
            return {
              question: originalItem.questions,
              correctAnswer: originalItem.correctAnswer,
              selectedAnswer: userAnswer,
              isCorrect,
              marks: originalItem.marks,
              marksAwarded
            };
          });
      
          res.json({ feedback });
        } catch (err) {
          console.error('Submit Assignment Error:', err);
          res.status(500).json({ error: 'Server error' });
        }
      };
      
       
}

module.exports = new userpagesController();