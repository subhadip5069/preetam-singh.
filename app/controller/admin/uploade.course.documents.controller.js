const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const CourseDocument = require('../../models/coursedocuments'); // Adjust path as needed

class coursedocumentController {
  async uploadCourseDocs(req, res) {
    try {
      const user = req.user?.id; // Get the user ID from the request
      const { courseId } = req.body;

      // Convert single or multiple video input(s) to array
      const videos = Array.isArray(req.body.videos)
        ? req.body.videos
        : req.body.videos
        ? [req.body.videos]
        : [];

      const notes = [];
      const assignments = [];

      // Handle PDF Notes
      if (req.files['notes']) {
        req.files['notes'].forEach(file => {
          notes.push(file.path); // Save file path
        });
      }

      // Handle Assignments from CSV
      if (req.files['assignments'] && req.files['assignments'][0]) {
        const assignmentCSVPath = req.files['assignments'][0].path;
        const results = [];

        await new Promise((resolve, reject) => {
          fs.createReadStream(assignmentCSVPath)
            .pipe(csvParser())
            .on('data', (data) => {
              results.push({
                questions: data.questions,
                answers: data.answers
                  ? data.answers.split(';').map(item => item.trim())
                  : [],
                correctAnswer: data.correctAnswer,
                marks: Number(data.marks),
              });
            })
            .on('end', resolve)
            .on('error', reject);
        });

        assignments.push(...results);

        // After processing the CSV, unlink (delete) the file
        fs.unlink(assignmentCSVPath, (err) => {
          if (err) {
            console.error('Error deleting the assignment CSV file:', err);
          } else {
            console.log('CSV file deleted successfully:', assignmentCSVPath);
          }
        });
      }

      // Update the existing course document
      const updatedDocument = await CourseDocument.updateOne(
        { courseId }, // Find document by courseId
        {
          $set: {
            notes, // Update notes
            videos, // Update videos
            assignments, // Update assignments
          },
        },
        { upsert: true } // Do not create a new document if it does not exist
      );

     res.redirect('/admin/courses')
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new coursedocumentController();
