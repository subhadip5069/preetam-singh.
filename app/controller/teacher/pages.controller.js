const courses = require("../../models/courses");
const User = require("../../models/user");



class PagesController {

    mycourses=async(req, res) => {
        try{
            const user = req.user?.id;

            // Fetch courses for the logged-in user
            const users = await User.findById(user);

            if (!users.role === "teacher") {
            const mycourses = await courses.find({}).populate("user", "name email role phone mybonus")

           res.render("teacher/mycourses", {
                title: "Courses",
                courses: mycourses,
                user: user,
            });
            }else{
                const mycourses = await courses.find({user: user}).populate("user", "name email role phone mybonus")
                res.render("teacher/mycourses", {
                    title: "Courses",
                    courses: mycourses,
                    user: user,
                });
            }

        }catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    }
    addcourses=async(req, res) => {
        try{
            const user = req.user?.id;
            res.render("teacher/addcourses", {
                title: "Add Courses",
                user: user,
            });
        }catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ error: "Failed to fetch courses" });
        }
    }
}

module.exports = new PagesController();