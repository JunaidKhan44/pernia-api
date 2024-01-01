const pool = require("../../config/database");

module.exports = {
  addShipping: (data, callBack) => {
    pool.query(
      `insert into pernia_db.shipper set name=? , price=?, category=?, cartlimit=?`,
        [
        data.name,
        data.price,
        data.category,
        data.cartlimit
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null,results);
      }
    );
  },
  getAllShippings: (callBack) => {
    pool.query(
      `select * from pernia_db.shipper`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getParentCategories: (callBack) => {
    pool.query(
      `select * from pernia_db.category where pernia_db.category.parent is null`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getShippingById: (id, callBack) => {
    pool.query(
      `select * from pernia_db.shipper where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getCategoryByProductId: (id, callBack) => {
    pool.query(
      `select * from pernia_db.category inner join pernia_db.product on pernia_db.category.id = pernia_db.product.category_id where pernia_db.product.id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },

  updateShippingById: (id,data, callBack) => {
    pool.query(
      `update pernia_db.shipper set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" where id =?",
        [
          ...Object.values(data),
          id
      ],
      (error, result, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, result);
      }
    );
  },
  deleteShippingById: (id, callBack) => {
    pool.query(
      `delete from pernia_db.shipper where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log("error occured "+err)
          return callBack(error,null);
        }
        console.log("results are "+results[0])
        return callBack(null,results);
      }
    );
  },
  deleteAllShippings: (callBack) => {
    pool.query(
      `delete from pernia_db.shipper`,
      [],
      (error, results, fields) => {
        if (error) {
          console.log("error occured "+err)
          return callBack(error,null);
        }
        console.log("results are "+results[0])
        return callBack(null,results);
      }
    );
  },

};