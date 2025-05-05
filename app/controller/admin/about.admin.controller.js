const fs = require('fs');
const path = require('path');
const AboutUs = require('../../models/aboutus');

class AboutUsController {
  // GET About Us page
  create =async (req, res) => {
    try {
      const user = req.user?.id;
     const { title, description, link } = req.body;
        const image = req.file?.path; // Use optional chaining to avoid errors if req.file is undefined
    
        // Create a new About Us document
        const aboutUs = new AboutUs({
            title,
            description,
            link,
            image: image
        });
    
        await aboutUs.save();
        res.redirect('/admin/about');
    } catch (error) {
      console.error('Error fetching About Us page:', error);
      res.status(500).send('Server Error');
    }
  }
 
  // UPDATE About Us
   async updateAboutUsPage(req, res) {
    try {
      const user = req.user?.id;
      const { title, description, link } = req.body;
      const newImage = req.file?.path;

      let aboutUs = await AboutUs.findOne();

      // Delete old image if a new one is uploaded
      if (aboutUs && newImage && aboutUs.image) {
        const oldImagePath = aboutUs.image;
        fs.unlink(oldImagePath, (err) => {
          
        });
      }

      // Update the document
      const updatedData = {
        title,
        description,
        link,
        ...(newImage && { image: newImage })
      };

      aboutUs = await AboutUs.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true
      });

      res.redirect('/admin/about');
    } catch (error) {
      console.error('Update Error:', error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = new AboutUsController ();
