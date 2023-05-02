const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (token) {
    var decoded = jwt.verify(token, "masai");
    try {
      if (decoded) {
        console.log(decoded);
        req.body.authorID = decoded.authorID;
        next();
      } else {
        res.status(400).json({ msg: "Please login!!" });
      }
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  } else {
    res.status(400).json({ msg: "Please login!!" });
  }
};
module.exports = { auth };
