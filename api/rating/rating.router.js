const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
//getAllShippings,
//addShipping,
//deleteAllShippings,
addRating,
getRatingByProductId,
getRatingByOnlyProductId,
getRatingById,
updateRatingById,
deleteRatingById,
//getCategoryByProductId,
//getParentCategories

} = require("./rating.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
//router.get("/", use(getAllShippings));
//router.get("/getParentCategories", use(getParentCategories));
router.get("/product/:id",use(getRatingByProductId));
router.get("/onlyproduct/:id",use(getRatingByOnlyProductId));
router.get("/:id",use(getRatingById));
//By giving product id will give you the category assign to that product 
//router.get("/getCategoryOfProduct",use(getCategoryByProductId));
router.post("/", use(addRating));
//router.delete("/", use(deleteAllShippings));
router.put("/:id",use(updateRatingById));
router.delete("/:id",use(deleteRatingById));
module.exports = router;