const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllTags,
addTag,
deleteAllTags,
getTagById,
updateTagById,
deleteTagById,
//getTagByProductId,
//getProductsProvidedBySupplierUsingSupplierId

} = require("./tag.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
router.get("/", use(getAllTags));
//router.get("/getProductProvidedBySupplier/:id",use(getProductsProvidedBySupplierUsingSupplierId));

router.get("/:id",use(getTagById));
//router.get("/:id",use(getSupplierById));
//By giving product id will give you the Supplier assign to that product 

router.post("/", use(addTag));
router.delete("/", use(deleteAllTags));
router.put("/:id",use(updateTagById));
router.delete("/:id",use(deleteTagById));
module.exports = router;