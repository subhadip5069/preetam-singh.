const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next(); // Let route decide if auth is required
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    req.user = null;
    return next();
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
