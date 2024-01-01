const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllCoupons,
addCoupon,
deleteAllCoupons,
getCouponById,
updateCouponById,
updateUserCouponById,
deleteCouponById,
getCouponAllocatedToUserByUserId,
allocateCoupontoUserByUserCouponId,
getCouponByUserCouponId,
verifyCoupon,
sendtoAll,

} = require("./coupon.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
// checkToken,isAdmin,
router.get("/", use(getAllCoupons));
router.get("/byuser", use(getAllCoupons));
router.get("/:id", use(getCouponById));
router.get("/user_coupon_id/:id", use(getCouponByUserCouponId));
router.get("/user/:id", use(getCouponAllocatedToUserByUserId));

router.post("/",checkToken,isAdmin, use(addCoupon));
router.delete("/",checkToken,isAdmin, use(deleteAllCoupons));
router.put("/:id",checkToken,isAdmin, use( updateCouponById));
router.put("/user_coupon_id/:id", use( updateUserCouponById));
router.delete("/:id", checkToken,isAdmin, use(deleteCouponById));
router.post("/verify", verifyCoupon);
router.post("/sendtoAll", sendtoAll);
router.post("/user_coupon_id", allocateCoupontoUserByUserCouponId);
module.exports = router;