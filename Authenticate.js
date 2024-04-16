
export const authenticate = async (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
  } else {
    res.status(400).json({ success: false, message: "User not authenticated" });
  }
};
