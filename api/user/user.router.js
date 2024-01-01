const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
  signUp,
  login,
  getUserByUserId,
  getAllUsers,
  updateUserProfileByUserId,
  deleteUserByUserId,
  activateUserAccount,
  forgotPassword,
  resetPassword,
  updatePasswordByUserId, 
  deleteAllUsers,
  getAllUserProfiles,
  adminSignUp
} = require("./user.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
// checkToken,isAdmin
router.get("/", use(getAllUsers));
router.get("/access", use(getAllUsers));
router.get("/profile", use(getAllUserProfiles));
router.post("/", signUp);
router.post("/adminSignup", adminSignUp);
router.post("/login", login);
router.delete("/", use(deleteAllUsers));
router.get("/:id", use(getUserByUserId));
router.put("/:id", use(updateUserProfileByUserId));
router.delete("/:id", use(deleteUserByUserId));
router.post("account/activateAccount", use(activateUserAccount));
router.post("/account/forgotPassword", use(forgotPassword));
router.put("/account/updatePassword", use(updatePasswordByUserId));
router.put("/account/resetPassword", use(resetPassword));

module.exports = router;
// checkToken,isAdmin,