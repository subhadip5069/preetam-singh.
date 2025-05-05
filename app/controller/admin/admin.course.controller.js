const Course = require("../../models/courses");
const fs = require("fs");
const path = require("path");

class CourseController {
  // Create a new course
  async createCourse(req, res) {
    // Check if the user is authenticated and has the right role
    const user = req.user?.id;
    try {
      const {
        title,
        description,
        features,
        price,
        discount,
        validated,
        categoryId
      
      } = req.body;


      const image = req.file ? req.file.path : null;

      const course = new Course({
        title,
        description,
        features: Array.isArray(features) ? features : [features],
        image,
        price,
        discount,
        validated,
        categoryId,
        userId: req.user?.id,
        
      });

      await course.save();
      res.redirect("/admin/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      res.redirect("/admin/courses");
    }
  }

  // Update a course by ID
  async updateCourse(req, res) {
    try {
      const user = req.user?.id;
      const { id } = req.params;
      const {
        title,
        description,
        features,
        price,
        discount,
        validated,
        categoryId
    
      } = req.body;

      const course = await Course.findById(id);
      if (!course) return res.status(404).send("Course not found");

      // Image update
      const image = req.file ? req.file.path : null;
      if (image) {
        if (course.image && fs.existsSync(course.image)) {
          fs.unlinkSync(course.image);
        }
        course.image = image;
      }

      // Update fields
      course.title = title;
      course.description = description;
      course.price = price;
      course.discount = discount;
      course.validated = validated;
      course.categoryId = categoryId;

      // Features
      course.features = Array.isArray(features) ? features : [features];

      await course.save();
      res.redirect("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      res.redirect("/admin/courses");
    }
  }

  // Delete a course by ID
  async deleteCourse(req, res) {
    try {
      const user = req.user?.id;
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) return res.redirect("/admin/courses");

      if (course.image && fs.existsSync(course.image)) {
        fs.unlinkSync(course.image);
      }

      await Course.findByIdAndDelete(id);
      res.redirect("/admin/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      res.redirect("/admin/courses");
    }
  }
  async updateCourseStatus(req, res) {
    // Check if the user is authenticated and has the right role
    const user = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      await Course.findByIdAndUpdate(id, { status });
      res.redirect("/admin/allcourses");
    } catch (error) {
      console.error("Failed to update course status:", error);
      res.redirect("/admin/allcourses");
    }
  }
}

module.exports = new CourseController();
