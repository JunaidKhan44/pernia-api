// const {
//     addShipping,
//     getAllShippings,
//     getShippingById,
//     updateShippingById,
//     deleteShippingById,
//     deleteAllShippings,
//     getParentCategories
//   } = require("./shipping.service");
require("dotenv").config()
const braintree = require("braintree");
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "scy957xh2xrqfbd2",
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});
const stripe = require('stripe')('sk_test_51KDmTcF2qtCPGsPVCKmY8zAeKi5rJAO547zjxJotuYIeMbe2IVMYi9pICpB86j27B3uuIqqlTHoViAIQXZWdXs4y00hVO8i3xm');
const { v4: uuidv4 } = require('uuid');
  module.exports = {
    
    generatetoken: (req, res) => {
      gateway.clientToken.generate({
       // customerId: aCustomerId
       }).then((response)=>{
         res.status(200).send(response)
       }).catch(err=>res.status(500).send(err))   //, //(err, response) => {
      //   // pass clientToken to your front-end
      //   const clientToken = response.clientToken
      // });
    },
   
    processPayment: (req, res) => {
      const nonceFromTheClient = req.body.payment_method_nonce;
      const {amount}=req.body;
      gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
       // deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }).then(response=>{
        res.status(200).send(response)
      }).catch(err=>res.status(500).send(err));
    },


    creditcardpayment: (req, res) => {
      const {itemss,token} = req.body;
      console.log('in body',req.body)
      const idempotencyKey=uuidv4()
      stripe.customers
  .create({
    email: token.email,
    source:token.id
  })
  .then((customer) => {
   
    
    stripe.charges.create({
        amount:'100',
        currency:'usd',
        customer:customer.id,
        receipt_email:token.email,
        description:'ahsksisuisis'
    },{idempotencyKey})
.then(result=>res.status(200).json(result))
    .catch((err) => {
       console.log(error)
      });

    }).catch(err=>console.log(err))
  
    },
    
  };
  