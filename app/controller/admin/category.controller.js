const Category = require("../../models/category.model");


class CategoryController {
    async createCategory(req, res) {
        try {
            const user = req.user?.id;
            const { name } = req.body;
            const newCategory = new Category({ name });
            await newCategory.save();
            return res.redirect("/admin/category");
        } catch (error) {
            console.error(error);
            return res.redirect("/admin/category")
        }
    }
    updateCategory = async (req, res) => {
        try {
            const user = req.user?.id;
            const { id } = req.params;
            const { name } = req.body;
            await Category.findByIdAndUpdate(id, { name });
            return res.redirect("/admin/category");
        } catch (error) {
            console.error(error);
            return res.redirect("/admin/category");
        }
    }
    deleteCategory = async (req, res) => {
        try {
            const user = req.user?.id;
            const { id } = req.params;
            await Category.findByIdAndDelete(id);
            return res.redirect("/admin/category");
        } catch (error) {
            console.error(error);
            return res.redirect("/admin/category");
        }
    }
}

module.exports = new CategoryController();