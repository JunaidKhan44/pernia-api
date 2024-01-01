const {
  addUser,
  getUserByUserEmail,
  getUserByUserId,
  getAllUsers,
  updateUserProfileByUserId,
  deleteUserByUserId,
  activateUserAccount,
  updatePasswordByUserId,
  sendMail,
  updateUserNameByUserId,
  deleteAllUsers,
  getAllUserProfiles,
  addAdminByAdmin,
  updatelastlogin
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
  signUp: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          error:err
        });
      }
      if (result) {
        // console.log("duplicate email")
        return res.status(500).json({
          success: 0,
          message: "email already exists",
        });
      } else {
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.type = "user";
        addUser(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error:err
            });
          }
          const msg = {
           "message": "Click The Link To Activate Your Account",
           "email":body.email
          }
          const token = jwt.sign(
            { result: results.insertId },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          sendMail(msg, token, (err, result) => {
            if (err) {
              return res.json({
                status: 0,
                error: err,
                message: "Cant Send Confirmation mail",
              });
            }
            return res.status(200).json({
              success: 1,
              message:
                "User Created Successfully Please Check Your Email to Verify Your Account",
              data: results,
              mail: result,
            });
          });
        });
      }
    });
  },
  adminSignUp: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          error:err
        });
      }
      if (result) {
        // console.log("duplicate email")
        return res.status(500).json({
          success: 0,
          message: "email already exists",
        });
      } else {
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.type = "user";
        addAdminByAdmin(body, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error:err
            });
          }
          const msg = {
           "message": "Click The Link To Activate Your Account",
           "email":body.email
          }
          const token = jwt.sign(
            { result: results.insertId },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          sendMail(msg, token, (err, result) => {
            if (err) {
              return res.json({
                status: 0,
                error: err,
                message: "Cant Send Confirmation mail",
              });
            }
            return res.status(200).json({
              success: 1,
              message:
                "User Created Successfully Please Check Your Email to Verify Your Account",
              data: results,
              mail: result,
            });
          });
        });
      }
    });
  },
  activateUserAccount: (req, res) => {
    const { token } = req.body;
    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            status: 0,
            message: "Invalid or expired token",
          });
        }
        activateUserAccount(decoded.result, (err, result) => {
          if (err) {
            return res.json({
              status: 0,
              message: "cant activate account",
              error: err,
            });
          }
          return res.json({
            status: 1,
            message: "Account Verified Successfully",
          });
        });
      });
    } else {
      return res.json({
        status: 0,
        message: "Cant Receive token",
      });
    }
  },
  login: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Account not exist",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        let date=new Date();
        updatelastlogin(date,results.user_id,(err,result) =>  {  
          if (err) {
            return res.json({
              success: 0,
              error: err,
            });
          }
          // return res.json({
          //   success: 1,
          //   result:result
          // });
        

        })



        console.log("in result");
        results.password = undefined;
       const token_payload={
          id:results.user_id,
          first_name:results.first_name,
          last_name:results.last_name,
          type:results.type,
          isActive:results.active,
          isVerified:results.isVerified

        }
        res.locals.currentUser = token_payload;
        if(result.savePassword)
        {
        const jsontoken = jwt.sign({ result:token_payload }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        res.locals.currentUser = token_payload;
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      }
      else{
        const jsontoken = jwt.sign({ result:token_payload }, process.env.JWT_KEY, {
          expiresIn: "121334456h",
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      }
   

      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
  forgotPassword: (req, res) => {
    const { email } = req.body;
    if (email) {
      getUserByUserEmail(email, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
            error: err,
          });
        }
        if (result) {
          const token_payload={
            id:results.id,
            type:results.type,
            isActive:results.active,
            isVerified:results.isVerified
  
          }
          const msg="Click on the Following link to access to your account"
          const sendtoken = jwt.sign({ result: token_payload }, process.env.JWT_KEY, {
            expiresIn: "1h",
          });
          sendMail(msg, sendtoken, (err, body) => {
            if (err) {
              return res.json({
                status: 0,
                error: err,
                message: "Cant Send Confirmation mail",
              });
            }
            return res.status(200).json({
              success: 1,
              message: "Email has been sent to the user",
              data: result,
              mail: body,
            });
          });
        }
        else
        {
        return res.status(500).json({
          success: 0,
          message: "Something bad happens",
          error: err,
        });
      }
      });
    }
    else{
      return res.status(404).json({
        success: 0,
        message: "email not present in the body"
      });
    }
  },
  updatePasswordByUserId: (req, res) => {
    console.log("in update password");
    let { password } = req.body;
    const salt = genSaltSync(10);
    password = hashSync(password, salt);
    const obj = {
      id: req.decoded.result.id,
      password: password,
    };
    updatePasswordByUserId(obj, (err, result) => {
      if (err) {
        return res.json({
          status: 0,
          message: "Error occured while updating user",
          error: err,
        });
      }
      return res.json({
        status: 1,
        message: "password updated successfully",
        data: result,
      });
    });
  },
  resetPassword: (req, res) => {
    console.log("in reset password controller")
    let { oldPassword, newPassword } = req.body;
    const salt = genSaltSync(10);
    newPassword = hashSync(newPassword, salt);
    const obj = {
      id: req.decoded.result.id,
      password: newPassword,
    };
    console.log("obj.id is "+obj.id)
    getUserByUserId(obj.id, (err, result) => {
      if (err) {
        return res.json({
          status: 0,
          message: "Error occured while getting user by user id",
          error: err,
        });
      }
      if (result) {
        let flag = compareSync(oldPassword, result.password);
        if (flag) {
          updatePassword(obj, (err, result) => {
            if (err) {
              return res.json({
                status: 0,
                message: "Error occured while updating user",
                error: err,
              });
            }
            return res.json({
              status: 1,
              message: "password updated successfully",
              data: result,
            });
          });
        } else {
          return res.json({
            status: 0,
            message: "Your Old password is not correct",
          });
        }
      } else {
        return res.json({
          status: 0,
          message: "Result not available from update user api",
          data: result,
        });
      }
    });
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    // console.log("decoded id",req.decoded.result,req.decoded.result.type,req.decoded.result.id)
    // if (id == req.decoded.result.id || req.decoded.result.type == "admin") {
      getUserByUserId(id, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!results) {
          return res.json({
            success: 0,
            message: "Record not Found",
          });
        }
        results.password = undefined;
        return res.json({
          success: 1,
          data: results,
        });
      });
    // } else {
    //   return res.json({
    //     success: 0,
    //     message: "your are not allowed to perform this operation",
    //   });
    // }
  },
  getAllUsers: (req, res) => {
    getAllUsers((err, results) => {
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
  getAllUserProfiles: (req, res) => {
    getAllUserProfiles((err, results) => {
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
  
  updateUserProfileByUserId: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log("id of update"+id)
    if (id == req.decoded.result.id||req.decoded.result.type=="admin") {
      updateUserProfileByUserId(id, body, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.json({
          success: 1,
          message: "User updated successfully",
        });
      });
    } else {
      return res.json({
        success: 0,
        message: "Unauthorized",
      });
    }
  },
  updateUserNameByUserId: (req, res) => {
    const { username } = req.body;
    const id = req.params.id;
    if (id == req.decoded.result.id) {
      getUserByUserNameByUserId(username, (err, result) => {
        if (err) {
          return res.json({
            success: 0,
            message: "username already exists",
          });
        }
        updateUserNameByUserId(id, username, (err, result) => {
          if (err) {
            return res.json({
              success: 0,
              message: "username name updation fails",
              error: err,
            });
          }
          return res.json({
            success: 1,
            message: "username updated successfully",
            data: result,
          });
        });
      });
    } else {
      return res.json({
        success: 0,
        message: "You are not allowed to perform this operation",
      });
    }
  },
  deleteUserByUserId: (req, res) => {
    const id = req.params.id;

    if (req.decoded.result.id == req.params.id || req.decoded.result.type=='admin') {
      deleteUserByUserId(id, (err) => {
        if (err) {
          return res.json({
            success: 0,
            message: "database connection error",
            error: err,
          });
        }
        return res.json({
          success: 1,
          message: "user deleted successfully",
        });
      });
    } else {
      return res.json({
        success: 0,
        message: "you are not allowed to perform this operation",
      });
    }
  },
  deleteAllUsers: (req, res) => {
  
      deleteAllUsers((err,result) => {
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
          data:result
        });
      });
    },
  updateUserProfileByUserId: (req, res) => {
    const id = req.params.id;
    const data = req.body;

    if (req.decoded.result.id == req.params.id) {
      updateUserProfileByUserId(id, data, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.json({
          success: 1,
          message: "user profile updated successfully",
        });
      });
    } else {
      return res.json({
        success: 0,
        message: "you are not allowed to perform this operation",
      });
    }
  },
};
