const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      console.log("token is", token);
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token...",
          });
        } else {
          console.log("req decoded is initiated");
          req.decoded = decoded;
          res.locals.currentUser = decoded;
          next();
        }
      });
    } else {
      res.locals.currentUser = null;
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User",
      });
    }
  },
  checkUser: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      console.log("token is", token);
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          res.locals.currentUser = null;
          next();
        } else {
          console.log("res.currentUser is initiated", decoded);
          res.locals.currentUser = decoded;
          next();
        }
      });
    } else {
      res.locals.currentUser = null;
      next();
    }
  },
  isAdmin: (req, res, next) => {
    if (req.decoded.result.type != "admin") {
      return res.json({
        success: 0,
        message: "Only admin is authorized to perform this operation",
      });
    } else {
      next();
    }
  },
};
