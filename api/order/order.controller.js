var easyinvoice = require("easyinvoice");
const {
  addUserOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  deleteAllOrders,
  addOrderDetails,
  updateOrderDetailsByOrderId,
  getAllOrdersByUserId,
  addGuestUser,
  updateUserAddressByAddressId,
  addUserAddress,
  getOrderByMonth,
  getOrderByPrevMonth,
  getOrderBycurrWeek,
  getOrderByYear,
  sendMail,
} = require("./order.service");
const { addUser, getUserByUserEmail } = require("../user/user.service");
const jwt = require("jsonwebtoken");
const fs = require('fs')
const parsePhoneNumber = require("libphonenumber-js/min");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const accountSid = 'AC462b71788efb0f7e26748a020059e75c';
const authToken = 'c0bebc7134ef9661c388a8b572d815b1';
const twilioClient = require("twilio")(accountSid, authToken);
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rajaareeb009@gmail.com',
    pass: 'rajag@123'
  }
});
(sendInvoice = async (ps) => {
  console.log("ps", ps)
  let products = [];
  ps.forEach((product) => {
    products.push({
      description: product.product_name,
      quantity: product.quantity,
      price: product.price,
    });
  });

  var data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    //"locale": "de-DE", //Defaults to en-US, used for number formatting (see docs)
    currency: "PKR", //See documentation 'Locales and Currency' for more info
    // taxNotation: "vat", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: "http://95.111.240.143/CXS-logo-150.png",
    // logo: "C:/Users/SSSS/Desktop/Ecommerce API 2/images/CXS-logo-150.png", //or base64
    background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
    sender: {
      company: "CSX",
      address: "Sample Street 123",
      zip: "1234 AB",
      city: "Sampletown",
      country: "Samplecountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    client: {
      company: "Client Corp",
      address: "Clientstreet 456",
      zip: "4567 CD",
      city: "Clientcity",
      country: "Clientcountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: "2021.0001",
    invoiceDate: "1.1.2021",
    products: products,
    bottomNotice: "Kindly pay your invoice within 15 days.",
    //Used for translating the headers to your preferred language
    //Defaults to English. Below example is translated to Dutch
    // "translate": {
    //     "invoiceNumber": "Factuurnummer",
    //     "invoiceDate": "Factuurdatum",
    //     "products": "Producten",
    //     "quantity": "Aantal",
    //     "price": "Prijs",
    //     "subtotal": "Subtotaal",
    //     "total": "Totaal"
    // }
  };

  const result = await easyinvoice.createInvoice(data);
  // console.log("the error in send incoice", err);
  // fs .writeFileSync("invoice.pdf",result.pdf,"base64")

  return sendMail(result.pdf)
}),
  (addOrderAndItsDetails = (order_info, products) => {
    console.log("order_info", order_info);
    console.log("products", products);
    return new Promise((resolve, reject) => {
      addUserOrder(order_info)
        .then((order) => {
          return addOrderDetails(products, order.insertId);
        })
        .then((details) => {
          console.log("order details addded", details);

          return resolve(details);
        })
        .catch((err) => {
          console.log("error is", err);
          return reject(err);
        });
    });
  });
signUp = (data, callback) => {
  const body = data;
  getUserByUserEmail(body.email, (err, result) => {
    if (err) {
      console.log(err);
      return callback(err, null);
    }
    if (result) {
      // console.log("duplicate email")
      m = {
        success: 0,
        message: "email already exists",
      };
      return callback(m, null);
    } else {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      body.type = "user";
      addUser(body, (err, results) => {
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        const msg = {
          message: "Click The Link To Activate Your Account",
          email: body.email,
        };
        const token = jwt.sign(
          { result: results.insertId },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );
        sendMail(msg, token, (err, result) => {
          if (err) {
            return callback(err, null);
          }
          console.log("results are", results);
          return callback(null, results.user_id);
        });
      });
    }
  });
};
addGuestUserForOrder = (data, callback) => {
  const body = data;
  getUserByUserEmail(body.email, (err, result) => {
    if (err) {
      console.log(err);

      return callback(err, null);
    }
    if (result) {
      // console.log("duplicate email")
      const m = {
        success: 0,
        message: "email already exists",
      };
      return callback(m, null);
    } else {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      body.type = "user";
      addGuestUser(body, (err, results) => {
        if (err) {
          console.log(err);
          return callback(err, null);
        }
        console.log("results are", results);
        return callback(null, results.user_id);
      });
    }
  });
};
module.exports = {
  addOrder: (req, res) => {
    // console.log("iiiii");
    const data = req.body;
    console.log('hello,above if',data)
    const userInfo = data.userInfo;
    // console.log(data);
    
    const promises = [];
    const order_info = data.orderInfo;
    const products = data.products;
    const billing_info = data.billing_info;
    const shipping_info = data.shipping_info;
    if (!data.userId) {
      if (data.createUserAccount) {
        signUp(userInfo, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error: err,
            });
          }
          if (!result) {
            return res.status(404).json({
              success: 0,
              message: "Not Found",
              error: result,
            });
          }
          const promises = [];
          console.log("billung info", billing_info);
          console.log("shipping info", shipping_info);
          if (billing_info) {
            promises.push(addUserAddress(result, billing_info, "billing"));
            promises.push(addUserAddress(result, shipping_info, "shipping"));
          } else {
            promises.push(addUserAddress(result, shipping_info, "billing"));
            promises.push(addUserAddress(result, shipping_info, "shipping"));
          }
          Promise.all(promises)
            .then((address) => {
              let order_info_temp = order_info;
              order_info_temp["user_id"] = result;
              order_info_temp["billing_id"] = address[0].insertId;
              order_info_temp["shipping_id"] = address[1].insertId;
              return addOrderAndItsDetails(order_info_temp, products);
            })
            .then((order) => {
              return res.status(200).json({
                success: 1,
                message: "order Added Successfully",
                order: order,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: 0,
                message: "Something went erong",
                error: err,
              });
            });
        });
      } else {
        addGuestUserForOrder(userInfo, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error: err,
            });
          }
          if (!result) {
            return res.status(404).json({
              success: 0,
              message: "Empty result",
              error: result,
            });
          }
          if (billing_info) {
            promises.push(addUserAddress(result, billing_info, "billing"));
            promises.push(addUserAddress(result, shipping_info, "shipping"));
          } else {
            promises.push(addUserAddress(result, shipping_info, "billing"));
            promises.push(addUserAddress(result, shipping_info, "shipping"));
          }
          Promise.all(promises)
            .then((address) => {
              let order_info_temp = data.orderInfo;
              order_info_temp["user_id"] = result;
              order_info_temp["billing_id"] = address[0].insertId;
              order_info_temp["shipping_id"] = address[1].insertId;
              return addOrderAndItsDetails(orderInfo_temp, products);
            })
            .then((order) => {
              return res.status(200).json({
                success: 1,
                message: "order Added Successfully",
                order: order,
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: 0,
                message: "Something went wrong",
                error: err,
              });
            });
        });
      }
    } else {
      const promises = [];
      console.log("in else")
      let order_info_temp = data.orderInfo;
      order_info_temp["user_id"] = data.userId;
      if (billing_info) {
        order_info_temp["billing_id"] = billing_info.id;
        order_info_temp["shipping_id"] = shipping_info.id;
        promises.push(updateUserAddressByAddressId(billing_info.id));
        promises.push(updateUserAddressByAddressId(shipping_info.id));
      } else {
        order_info_temp["billing_id"] = shipping_info.id;
        order_info_temp["shipping_id"] = shipping_info.id;
        promises.push(updateUserAddressByAddressId(shipping_info.id));
      }
      promises.push(addOrderAndItsDetails(order_info_temp, products));

      Promise.all(promises)
        .then((order) => {
          sendInvoice(products)
            .then((result) => {
              console.log('after promise',result,'  and',products)
             
              // parsePhoneNumber(user.phoneNo).format("E.164")
                  twilioClient.messages.create({
                    from: "+923319282772",
                    to: '+923315633071',
                    body: `${result} 'Shipping at' ,${shipping_info}`,
                  });
                 // const maillist=emails
                  var mailOptions = {
                    from: 'rajaareeb009@gmail.com',
                    to: 'areebraja000@gmail.com',
                    subject: 'Order Delivery',
                    text: 'Your Order details are'+ result.map(it=>it.name)+
                    ' Shipping Address :' + shipping_info.user_address 
                    +'Shipping To :'  +data.userInfo.first_name
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
              return res.status(200).json({
                success: 1,
                message: "invoice send Added Successfully",
                data: result
              })
            })
            .catch((er) => {
              return res.status(500).json({
                success: 0,
                message: "Error send invoice Order ",
                error: er,
              });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            success: 0,
            message: "Error Adding Order ",
            error: err,
          });
        });
    }
    // data.user_id=req.decoded.result.id
    // addOrder(data, (err, results) => {
    //   if (err) {
    //     console.log(err);
    //     return res.status(500).json({
    //       success: 0,
    //       message: "Database connection errror",
    //       error: err,
    //     });
    //   }
    //   data.order_id = results.insertId;
    //   addOrderDetails(data, (err, results) => {
    //     if (err) {
    //       console.log(err);
    //       return res.status(500).json({
    //         success: 0,
    //         message: "Database connection errror",
    //         error: err,
    //       });
    //     }
    //     return res.status(200).json({
    //       success: 1,
    //       message: "Order Added Successfully ",
    //       data: results,
    //     });
    //   });
    // });
  },
  getOrderById: (req, res) => {
    const id = req.params.id;
    getOrderById(id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Record not Found",
        });
      }
      let tt = results;
      results = results[0];
    
      let products = [];
      let ship_details={
        "user_address":results.user_address,
        "country":results.country,
        "city":results.city,
        "postal_code":results.postal_code
      }
      // let bill_details={
      //   "user_address":results.user_address,
      //   "country":results.country,
      //   "city":results.city,
      //   "postal_code":results.postal_code
      // }
      let product_json_arr = [];
      console.log("new products",results.products)
      if (results.products) {
       
        products = results.products.split(":");
      }
      products.forEach((product) => {
        let temp = product.split(",");
        product_json_arr.push({
          product_variant_id: temp[0],
          product_id:temp[1],
          product_name: temp[2],
          product_variant_name: temp[3],
          price: temp[4],
          quantity: temp[5],
          path:temp[6]
        });
      });
      delete results.products;
      results["products"] = product_json_arr;
      results['ship_details']=ship_details
      //results['bill_details']=bill_details
      
      results={
        id:results.id,
        user_id:results.user_id,
        total_amount:results.total_amount,
        total_items:results.total_items, 
        shipping_id:results.shipping_id ,
        billing_id: results.billing_id,
        date: results.date,
        payment_status: results.payment_status,
        fulfillment_status: results.fulfillment_status,
        delivery_method: results.delivery_method,
        payment_method:results.payment_method,
        products:results.products,
        ship_details:results.ship_details

      }

      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getAllOrders: (req, res) => {
    getAllOrders((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getAllOrdersByUserId: (req, res) => {
    // if (
    //   req.decoded.result.type == "admin" ||
    //   req.decoded.result.id == req.params.id
    // ) {
      getAllOrdersByUserId(req.params.id, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
            error: err,
          });
        }
        console.log('orders',results)
        return res.status(200).json({
          
          success: 1,
          data: results,
        });
      });
   // }
  },
  getOrderByMonth: (req, res) => {
    
      getOrderByMonth((err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
            error: err,
          });
        }
        return res.status(200).json({
          success: 1,
          data: results,
        });
      });
   // }
  },
  getOrderByPrevMonth: (req, res) => {
    
    getOrderByPrevMonth((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error: err,
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
 // }
},
getOrderBycurrWeek: (req, res) => {
    
  getOrderBycurrWeek((err, results) => {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
        error: err,
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
// }
},

getOrderByYear: (req, res) => {
    
  getOrderByYear((err, results) => {
    if (err) {
      return res.status(500).json({
        success: 0,
        message: "Database connection errror",
        error: err,
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
// }
},


  updateOrderById: (req, res) => {
    const id = req.params.id;
    console.log("id of update" + id);
    deleteOrderById(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "something went wrong",
          error: err

        })
      }
      else {
        // console.log("iiiii");
        const data = req.body;
        const userInfo = data.userInfo;
        // console.log(data);
        const promises = [];
        const order_info = data.orderInfo;
        const products = data.products;
        const billing_info = data.billing_info;
        const shipping_info = data.shipping_info;
        if (!data.userId) {
          if (data.createUserAccount) {
            signUp(userInfo, (err, result) => {
              if (err) {
                return res.status(500).json({
                  success: 0,
                  message: "Database connection errror",
                  error: err,
                });
              }
              if (!result) {
                return res.status(404).json({
                  success: 0,
                  message: "Not Found",
                  error: result,
                });
              }
              const promises = [];
              console.log("billung info", billing_info);
              console.log("shipping info", shipping_info);
              if (billing_info) {
                promises.push(addUserAddress(result, billing_info, "billing"));
                promises.push(addUserAddress(result, shipping_info, "shipping"));
              } else {
                promises.push(addUserAddress(result, shipping_info, "billing"));
                promises.push(addUserAddress(result, shipping_info, "shipping"));
              }
              Promise.all(promises)
                .then((address) => {
                  let order_info_temp = order_info;
                  order_info_temp["user_id"] = result;
                  order_info_temp["billing_id"] = address[0].insertId;
                  order_info_temp["shipping_id"] = address[1].insertId;
                  return addOrderAndItsDetails(order_info_temp, products);
                })
                .then((order) => {
                  return res.status(200).json({
                    success: 1,
                    message: "order Added Successfully",
                    order: order,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    success: 0,
                    message: "Something went erong",
                    error: err,
                  });
                });
            });
          } else {
            addGuestUserForOrder(userInfo, (err, result) => {
              if (err) {
                return res.status(500).json({
                  success: 0,
                  message: "Database connection errror",
                  error: err,
                });
              }
              if (!result) {
                return res.status(404).json({
                  success: 0,
                  message: "Empty result",
                  error: result,
                });
              }
              if (billing_info) {
                promises.push(addUserAddress(result, billing_info, "billing"));
                promises.push(addUserAddress(result, shipping_info, "shipping"));
              } else {
                promises.push(addUserAddress(result, shipping_info, "billing"));
                promises.push(addUserAddress(result, shipping_info, "shipping"));
              }
              Promise.all(promises)
                .then((address) => {
                  let order_info_temp = data.orderInfo;
                  order_info_temp["user_id"] = result;
                  order_info_temp["billing_id"] = address[0].insertId;
                  order_info_temp["shipping_id"] = address[1].insertId;
                  return addOrderAndItsDetails(orderInfo_temp, products);
                })
                .then((order) => {
                  return res.status(200).json({
                    success: 1,
                    message: "order Added Successfully",
                    order: order,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    success: 0,
                    message: "Something went wrong",
                    error: err,
                  });
                });
            });
          }
        } else {
          const promises = [];
          let order_info_temp = data.orderInfo;
          order_info_temp["user_id"] = data.userId;
          if (billing_info) {
            order_info_temp["billing_id"] = billing_info.id;
            order_info_temp["shipping_id"] = shipping_info.id;
            promises.push(updateUserAddressByAddressId(billing_info.id));
            promises.push(updateUserAddressByAddressId(shipping_info.id));
          } else {
            order_info_temp["billing_id"] = shipping_info.id;
            order_info_temp["shipping_id"] = shipping_info.id;
            promises.push(updateUserAddressByAddressId(shipping_info.id));
          }
          promises.push(addOrderAndItsDetails(order_info_temp, products));

          Promise.all(promises)
            .then((order) => {
              sendInvoice(products)
                .then((result) => {
                  return res.status(200).json({
                    success: 1,
                    message: "invoice send Added Successfully",
                    data: result
                  })
                })
                .catch((er) => {
                  return res.status(500).json({
                    success: 0,
                    message: "Error send invoice Order ",
                    error: er,
                  });
                });
            })
            .catch((err) => {
              return res.status(500).json({
                success: 0,
                message: "Error Adding Order ",
                error: err,
              });
            });
        }
      }
    })

  },
  updateOrderDetailsByOrderId: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log("id of update" + id);
    updateOrderDetailsByOrderId(id, body, (err, results) => {
      if (err) {
        console.status(500).log(err);
        return res.json({
          success: 0,
          message: "database connection error",
          error: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "order updated successfully",
      });
    });
  },
  deleteOrderById: (req, res) => {
    const id = req.params.id;
    deleteOrderById(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database conection error",
          error: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "order deleted successfully",
        data: result,
      });
    });
  },
  deleteAllOrders: (req, res) => {
    deleteAllOrders((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database conection error",
          error: err,
        });
        f;
      }
      return res.status(200).json({
        success: 1,
        message: "order updated successfully",
        data: result,
      });
    });
  },
};
