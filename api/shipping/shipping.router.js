const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllShippings,
addShipping,
deleteAllShippings,
getShippingById,
updateShippingById,
deleteShippingById,
getCategoryByProductId,
getParentCategories

} = require("./shipping.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
router.get("/", use(getAllShippings));
//router.get("/getParentCategories", use(getParentCategories));
router.get("/:id",use(getShippingById));
//By giving product id will give you the category assign to that product 
//router.get("/getCategoryOfProduct",use(getCategoryByProductId));
router.post("/", use(addShipping));
router.delete("/", use(deleteAllShippings));
router.put("/:id",use(updateShippingById));
router.delete("/:id",use(deleteShippingById));
module.exports = router;