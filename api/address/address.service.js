const pool = require("../../config/database");

module.exports = {
  getUserAddressesByUserId: (id, callBack) => {
    pool.query(
      `select * from pernia_db.address where pernia_db.address.user_id=? ORDER BY used_at DESC `,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  addUserAddressByUserId: (user_id,data, callBack) => {
    pool.query(
      `insert into pernia_db.address set user_id=?,name=?, postal_code=? , city=? , province=? , country=?, user_address=?, type=?, used_at=now() `,
      [
        user_id,
        data.name,
        data.postal_code,
        data.city,
        data.province,
        data.country,
        data.user_address,
        data.type
        
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  updateUserAddressByAddressId: (id,data,callBack) => {
    // return new Promise((resolve,reject)=>
    // {
      console.log('datata',data)
      pool.query(
        `update pernia_db.address set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" , used_at=now() where id =?",
          [
            ...Object.values(data),
            id
        ],
        (error, result, fields) => {
          if (error) {
            return callBack(error);
          }
          return callBack(result);
        }
      );

   // })
  },
  getAllAddresses: (callBack) => {
       pool.query(
      `select * from pernia_db.address`,
        [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  deleteAddressByAddressId: (id, callBack) => {
    pool.query(
      `delete from pernia_db.address where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null,results);
      }
    );
  },
deleteAllAddresses: (callBack) => {
  pool.query(
    `delete from pernia_db.address`,
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
}
};