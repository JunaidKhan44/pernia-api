const pool = require("../../config/database");

module.exports = {
  addCoupon: (data, callBack) => {
    pool.query(
      'insert into pernia_db.coupon set coupon_code=? , coupon_type=? ,coupon_description=?, expiry_date=str_to_date(?,"%Y-%m-%d") , usage_limit_per_coupon=? ,usage_limit_per_user=?, discount_value =? , discount_type=?',
        [
        data.coupon_code,
        data.coupon_type,
        data.coupon_description,
        data.expiry_date,
        data.usage_limit_per_coupon,
        data.usage_limit_per_user,
        data.discount_value,
        data.discount_type

      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null,results[0]);
      }
    );
  },
  getAllCoupons: (callBack) => {
    console.log("kkk")
    pool.query(
      'SELECT * FROM pernia_db.coupon',
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getCouponById: (id, callBack) => {
    pool.query(
      `select * from pernia_db.coupon where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getCouponByUserCouponId: (id, callBack) => {
    pool.query(
      `select * from pernia_db.coupon_details where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getCouponByCouponCode: (coupon_code, callBack) => {
    pool.query(
      `select * from pernia_db.coupon where code = ?`,
      [coupon_code],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getCouponAllocatedToUserByUserId: (id, callBack) => {
    pool.query(
      `select coupon_id , limit_per_user from pernia_db.user where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0])
      }
    );
  },
  allocateCoupontoUserByUserCouponId: (ucid, callBack) => {
    pool.query(
      // 'insert into ecommerce.coupon_details set id=? , limit=? ',
      //   [
      //   ucid,
      //   1
      // ],
      'insert into pernia_db.coupon_details values('+ucid+',"1")',
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  updateCouponById: (id,data, callBack) => {
    console.log('data',data)
    pool.query(
      `update pernia_db.coupon set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" where id =?",
        [
          ...Object.values(data),
          id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUserCouponById: (id,data, callBack) => {
    console.log('data',data,id)
    pool.query(
      `update pernia_db.coupon_details SET user_limit=? where id =?`,
      [
        data.limit,
        id
      ],
       
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },



  deleteCouponById: (id, callBack) => {
    pool.query(
      `delete from pernia_db.coupon where id = ?`,
      [id],
      (err, results, fields) => {
        if (err) {
          return callBack(err,null);
        }
        return callBack(null,results[0]);
      }
    );
  },
  deleteAllCoupons: (callBack) => {
    pool.query(
      `delete from pernia_db.coupon`,
      [],
      (error, results, fields) => {
        if (error) {
          console.log("error occured "+err)
          return callBack(error,null);
        }
        console.log("results are "+results)
        return callBack(null,results);
      }
    );
  },

};