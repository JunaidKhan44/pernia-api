const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllOrders,
addOrder,
deleteAllOrders,
getOrderById,
updateOrderById,
deleteOrderById,
updateOrderDetailsByOrderId,
getAllOrdersByUserId,
getOrderByMonth,
getOrderByPrevMonth,
getOrderBycurrWeek,
getOrderByYear,
addGuestUser
} = require("./order.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
// checkToken,isAdmin,
router.get("/", use(getAllOrders));
router.get("/user/:id", use(getAllOrdersByUserId));
router.get("/:id", use(getOrderById));
router.get("/month/month", use(getOrderByMonth));
router.get("/month/previousMonth", use(getOrderByPrevMonth));
router.get("/month/currentWeek", use(getOrderBycurrWeek));
router.get("/years/all", use(getOrderByYear));
router.post("/", use(addOrder));
// router.post("/addGuestUser", use(addGuestUser));
router.delete("/", use(deleteAllOrders));
router.put("/updateOrderDetails/:id",checkToken,isAdmin,  use(updateOrderDetailsByOrderId));
router.put("/:id",checkToken,isAdmin,  use(updateOrderById));
router.delete("/:id",checkToken,isAdmin, use(deleteOrderById));

module.exports = router;