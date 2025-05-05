const bannerSchema = require("../../models/banner");
const path = require("path");
const fs = require("fs");


class bannerController {

    create =async (req, res) => {
        try {
            const user = req.user?.id;
            const { title, description, link } = req.body;

            const image = req.file ? req.file.path : null; // Assuming you're using multer for file uploads
            const newBanner = new bannerSchema({ title, description, image, link });
            await newBanner.save();
            res.redirect("/admin/banner");
        } catch (error) {
            console.error("Error creating banner:", error);
            res.redirect("/admin/banner");
        }
    }
    
update = async (req, res) => {
    try {
      const user = req.user?.id;
      const { id } = req.params;
      const { title, description, link } = req.body;
  
      const image = req.file ? req.file.path : null; // multer stores relative file path
      const existingBanner = await bannerSchema.findById(id);
  
      if (image && existingBanner) {
        // Safely remove the old image
        const oldImagePath = existingBanner.image;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);

        }
       
  
        // Update the image path in the banner
        existingBanner.image = image;
        await existingBanner.save();
      }
  
      // Update other fields
      const updatedBanner = await bannerSchema.findByIdAndUpdate(
        id,
        { title, description, link },
        { new: true }
      );

  
      res.redirect("/admin/banner");
    } catch (error) {
      console.error("Error updating banner:", error);
      res.redirect("/admin/banner");
    }
  };
    delete = async (req, res) => {
  try {
    const user = req.user?.id;
    const { id } = req.params;

    // Step 1: Find the banner first
    const banner = await bannerSchema.findById(id);

    if (banner && banner.image) {
      // Step 2: Build the full image path and delete it
      const imagePath = banner.image;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Step 3: Delete banner from database
    await bannerSchema.findByIdAndDelete(id);

    res.redirect("/admin/banner");
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.redirect("/admin/banner");
  }
}
}
module.exports = new bannerController();