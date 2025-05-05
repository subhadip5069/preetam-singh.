const Course = require("../../models/courses");
const fs = require("fs");
const path = require("path");

class CourseController {
  // Create a new course
  async createCourse(req, res) {
    try {
      const user = req.user?.id;
      if (!req.user || req.user.role !== "teacher") {
        return res.status(403).json({ error: "Access denied: Only teachers can create courses" });
      }

      const {

        title,
        description,
        features,
        price,
        discount,
        validated,
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
      });

      await course.save();
      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  }

  // Update a course by ID
  async updateCourse(req, res) {
    try {
      if (!req.user || req.user.role !== "teacher") {
        return res.status(403).json({ error: "Access denied: Only teachers can update courses" });
      }

      const { id } = req.params;
      const {
        title,
        description,
        features,
        price,
        discount,
        validated,
      } = req.body;

      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ error: "Course not found" });

      const image = req.file ? req.file.path : null;
      if (image) {
        if (course.image && fs.existsSync(course.image)) {
          fs.unlinkSync(course.image);
        }
        course.image = image;
      }

      course.title = title;
      course.description = description;
      course.price = price;
      course.discount = discount;
      course.validated = validated;
      course.features = Array.isArray(features) ? features : [features];

      await course.save();
      res.json({ message: "Course updated successfully", course });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Failed to update course" });
    }
  }

  // Delete a course by ID
  async deleteCourse(req, res) {
    try {
      if (!req.user || req.user.role !== "teacher") {
        return res.status(403).json({ error: "Access denied: Only teachers can delete courses" });
      }

      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ error: "Course not found" });

      if (course.image && fs.existsSync(course.image)) {
        fs.unlinkSync(course.image);
      }

      await Course.findByIdAndDelete(id);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ error: "Failed to delete course" });
    }
  }
}

module.exports = new CourseController();
