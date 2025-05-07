const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.cookies.token;

  // Support token from Authorization header too
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("token");
      req.session.message = "Session expired. Please log in again.";
    }

    req.user = null;
    next();
  }
};
const AdminauthMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Assuming you're storing the token in cookies
  
    if (!token) {
      
      res.redirect('/admin/'); // Redirect to the login page if no token
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded; // Attach user info to the request object
      res.locals.user = decoded; // Attach it to res.locals for global access in EJS
      next();
    } catch (error) {
      res.redirect('/admin/'); // Redirect if token is invalid or expired
    }
  };

module.exports = { authMiddleware, AdminauthMiddleware }; // Export authMiddleware;
