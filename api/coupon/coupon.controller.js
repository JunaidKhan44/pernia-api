const {
  addCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponById,
  updateUserCouponById,
  deleteCouponById,
  deleteAllCoupons,
  getCouponByCouponCode,
  getCouponByUserCouponId,
  allocateCoupontoUserByUserCouponId,
  getCouponAllocatedToUserByUserId,
} = require("./coupon.service");
const http = require('http');
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'areebraja000@gmail.com',
    pass: 'rajag123'
  }
});
module.exports = {
  addCoupon: (req, res) => {
    const data = req.body;
    addCoupon(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          error: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Coupon Added Successfully",
        data: results,
      });
    });
  },
  sendtoAll: (req, res) => {
    // const config = {
    //   headers: {
    //     Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   },
    // };

    
    const data = req.body;
    const emails=data.users
    const coupon=data.coupon
    console.log('emailsss',emails)
    let date=''
         const d = new Date(coupon.expiry_date);
         let dd=d.toString()
         for(let i=0; i<15;i++)
             date=date+dd[i]
             coupon.expiry_date= date
   // let result = '';
// http.get('http://localhost:8080/ecom-api/users/access', (resp) => {
//   let emails=[]
//   //  resp.data.map(em=>{
//   //    emails.push(em.email)
//   //  })
//   //  console.log('emailsss',emails)
//   // A chunk of data has been received.
//   resp.on('data', (chunk) => {
//     result+= chunk;
//     //console.log('data1',result)
//   });
//    result=result.data
//    console.log('data',result)
//   // // The whole response has been received. Print out the result.
//   // resp.on('end', () => {
//   //   console.log(JSON.parse(result).explanation);
//   //   console.log('data',result)
//   // });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });
    const maillist=emails
    var mailOptions = {
      from: 'areebraja000@gmail.com',
      to: maillist,
      subject: 'Offer Alert',
      text: 'Your Coupon Code is'+ coupon.coupon_code + ' Expiry Date is ' + coupon.expiry_date 
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: 0,
          message: "Null Data",
          error: 'null data',
        });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          success: 1,
          message: "Mail Sent",
          
        });
      }
    });
    
    
    
   
  },
  getCouponById: (req, res) => {
    const id = req.params.id;
    getCouponById(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getCouponByUserCouponId: (req, res) => {
    const id = req.params.id;
    getCouponByUserCouponId(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },




  getCouponAllocatedToUserByUserId: (req, res) => {
    const user_id = req.params.id;
    getCouponAllocatedToUserByUserId(user_id, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      if (!result) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },
  allocateCoupontoUserByUserCouponId: (req, res) => {
    const ucid = req.body.id;
    const cid=req.body.cid;
    let usage=req.body.usage
    allocateCoupontoUserByUserCouponId(ucid, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      else{
        console.log('in update')
        usage=usage+1;
        let body={total_usage:usage}
        console.log('cid',cid)
      updateCouponById(cid, body, (err, results) => {
        console.log('printing')
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
            error: err,
          });
        }
      return res.json({
        success: 1,
        message: "Coupon Allocated to User Successfully and total usage updated",
        data: result,
      });
    });
  }
    });
  },
  getAllCoupons: (req, res) => {
    console.log("iiiii");
    getAllCoupons((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  verifyCoupon: (req, res) => {
    const coupon_code = req.body.coupon_code;
    getCouponByCouponCode(coupon_code, (err, coupon) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      if (!coupon) {
        return res.json({
          success: 0,
          message: "Invalid Coupon Code",
        });
      }
      console.log("now " + new Date().getTime());
      console.log("expiry time  " + new Date(coupon.expiry_date).getTime());
      console.log("discount type  " + coupon.discount_type);
      console.log("coupon type  " + coupon.coupon_type);
      if (
        new Date().getTime() > new Date(coupon.expiry_date).getTime() ||
        coupon.usage_limit_per_coupon <= 0
      ) {
        // expirationTime data access from database
        deleteCouponById(coupon.id, (err, del) => {});
        return res.json({
          success: 0,
          message: "Coupon Expires",
        });
      }
      if (coupon.coupon_type == "user") {
        let token = req.get("authorization");
        if (token) {
          // Remove Bearer from string
          token = token.slice(7);
          console.log("token is", token);
          jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
              console.log("req decoded is not initiated");
              return res.json({
                success: 0,
                message: "Invalid Coupon",
              });
            } else {
              req.decoded=decoded
              console.log("req decoded is initiated");
              if (decoded) {
                console.log("decoded is",decoded);
                getCouponAllocatedToUserByUserId(
                  decoded.result.id,
                  (err, user_coupon) => {
                    if (err) {
                      return res.status(500).json({
                        success: 0,
                        message: "Database connection errror",
                        error: err,
                      });
                    }
                    if (!user_coupon) {
                      return res.json({
                        success: 0,
                        message: "Invalid Coupon",
                      });
                    }
                    if (user_coupon.limit_per_user == 0) {
                      return res.json({
                        success: 0,
                        message: "Usage Limit Completes",
                      });
                    }
                    console.log("user coupon id is", user_coupon);
                    console.log(" coupon id is", coupon.id);
                    if (user_coupon.coupon_id == coupon.id) {
                      if (coupon.discount_type == "percentage") {
                        console.log("uin per is", user_coupon);
      
                        return res.json({
                          success: 1,
                          total: req.body.total_amount - coupon.discount_value/100 * req.body.total_amount,
                        });
                      } else if (coupon.discount_type == "fixed") {
                        return res.json({
                          success: 1,
                          total: req.body.total_amount - coupon.discount_value,
                        });
                      }
                    }
                    else{
                      return res.json({
                        success: 0,
                        message:"invalid token"
                      });
                    }
                  }
                );
              }
              else{
                return res.json({
                  success: 0,
                  message: "Invalid Coupon..",
                });
              }
            }
          });
        }
        else{
          return res.json({
            success: 0,
            message: "Invalid Coupon..",
          });
        }

      }
      else if (coupon.coupon_type === "cart") {
        console.log("in cart");
        if (coupon.discount_type == "percentage") {
          return res.json({
            success: 1,
            total: req.body.total_amount - coupon.discount_value * 100,
          });
        } else if (coupon.discount_type === "fixed") {
          return res.json({
            success: 1,
            total: req.body.total_amount - coupon.discount_value,
          });
        }
      } else {
        return res.json({
          success: 1,
          message: "Invalid Coupon Code",
        });
      }
    });
  },
  updateCouponById: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    updateCouponById(id, body, (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "database connection error",
          error: err,
        });
      }
      return res.json({
        success: 1,
        message: "updated successfully",
      });
    });
  },
  updateUserCouponById: (req, res) => {
    const body = {limit:req.body.limit};
    const id = req.params.id;
    console.log('id,id')
    const cid=req.body.cid;
    let usage=req.body.usage
    updateUserCouponById(id, body, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: 0,
          message: "database connection error",
          error: err,
        });
      }
      else{
        console.log('in update')
        usage=usage+1;
        let body={total_usage:usage}
        console.log('cid',cid)
      updateCouponById(cid, body, (error, results) => {
        console.log('printing')
        if (error) {
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
            error: err,
          });
        }
      return res.json({
        success: 1,
        message: "CouponUser limit  updated Successfully and total usage updated",
        data: result,
      });
    });
  }
     
    });
  },



  deleteCouponById: (req, res) => {
    const id = req.params.id;
    deleteCouponById(id, (err, result) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Database conection error",
          error: err,
        });
      }
      return res.json({
        success: 1,
        message: "user deleted successfully",
        data: result,
      });
    });
  },
  deleteAllCoupons: (req, res) => {
    deleteAllCoupons((err, result) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Database conection error",
          error: err,
        });
        f;
      }
      return res.json({
        success: 1,
        message: "user profile updated successfully",
        data: result,
      });
    });
  },
};
