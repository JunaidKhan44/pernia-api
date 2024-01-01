const router = require("express").Router();
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
creditcardpayment,
generatetoken,
processPayment

} = require("./payment.controller");
const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
router.get("/", use(generatetoken));
//for stripe
//router.post("/", use(creditcardpayment));
//for brain tree
router.post("/", use(processPayment));

module.exports = router;