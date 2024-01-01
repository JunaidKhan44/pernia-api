const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
 
  getAllAddresses,
  deleteAddressByAddressId,
  deleteAllAddresses,
  getUserAddressesByUserId,
  addUserAddressByUserId,
  updateUserAddressByAddressId,
} = require("./address.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
router.get("/", use(getAllAddresses));
router.get("/:id", use(getUserAddressesByUserId));
router.post("/:id", use(addUserAddressByUserId));
router.put("/:id", use(updateUserAddressByAddressId));
router.delete("/", use(deleteAllAddresses));
router.delete("/:id", use(deleteAddressByAddressId));


module.exports = router;