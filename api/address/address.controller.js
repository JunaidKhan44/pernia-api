const {
  getUserAddressesByUserId,
  addUserAddressByUserId,
  updateUserAddressByAddressId,
  deleteAllAddresses,
  deleteAddressByAddressId,
  getAllAddresses
} = require("./address.service");
// const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
  
  getAllAddresses: (req, res) => {
    getAllAddresses((err, results) => {
      if (err) {
        console.log("the error is " + err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
 
  // getUserAddressById: (req, res) => {
  //   console.log(res.locals.currentUser)
  //   if((res.locals.currentUser))
  //   {
  //   getUserAddressById(res.locals.currentUser.result.id,(err, results) => {
  //     if (err) {
  //       console.log("the error is " + err);
  //       return;
  //     }
  //     console.log("true ");
  //     return res.json({
  //       success: 1,
  //       data: results,
  //     });
  //   });
  // }
  // else
  // {
  //   console.log("else ");
  //   return res.json({
  //     success: 0,
  //     data: null,
  //   });
  // }
  // },
  getUserAddressesByUserId: (req, res) => {
   
    getUserAddressesByUserId(req.params.id,(err, results) => {
      if (err) {
        console.log("the error is " + err);
        return res.json({
          success: 0,
          data: err,
        });
      }
      console.log("true ");
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  addUserAddressByUserId: (req, res) => {
   console.log('req',req.body)
    addUserAddressByUserId(req.params.id,req.body,(err, results) => {
      if (err) {
        console.log("the error is " + err);
        return res.json({
          success: 0,
          data: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updateUserAddressByAddressId: (req, res) => {
   
    updateUserAddressByAddressId(req.params.id,req.body,(err,results) =>{ 

    if(err) {
        console.log("the error is " + err);
        return res.json({
          success: 0,
          data: err,
        });
      }
      
        console.log("result " + err);
        return res.json({
          success: 1,
          data: results,
        });
      })
  },
  deleteAddressByAddressId: (req, res) => {
   
    deleteAddressByAddressId(req.params.id,(err, results) => {
      if (err) {
        console.log("the error is " + err);
        return res.json({
          success: 0,
          data: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  deleteAllAddresses: (req, res) => {
  
      deleteAllAddresses((err,result) => {
        if (err) {
          return res.json({
            success: 0,
            message: "database connection error",
            error: err,
          });
        }
        return res.json({
          success: 1,
          message: "all users deleted successfully",
        });
      });
    },
  
};
