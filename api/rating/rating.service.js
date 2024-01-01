const pool = require("../../config/database");

module.exports = {
  addRating: (data, callBack) => {
    pool.query(
      `insert into pernia_db.rating set rating_id=? , product_id=?,  total_count=?`,
        [
        data.rating_id,
        data.product_id,
        data.total_count
      
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null,results);
      }
    );
  },
//   getAllShippings: (callBack) => {
//     pool.query(
//       `select * from shipper`,
//       [],
//       (error, results, fields) => {
//         if (error) {
//           return callBack(error,null);
//         }
//         return callBack(null, results);
//       }
//     );
//   },
//   getParentCategories: (callBack) => {
//     pool.query(
//       `select * from category where category.parent is null`,
//       [],
//       (error, results, fields) => {
//         if (error) {
//           return callBack(error,null);
//         }
//         return callBack(null, results);
//       }
//     );
//   },
  getRatingById: (id, callBack) => {
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

  getRatingByProductId: (id,pid,callBack) => {
    pool.query(
      `select  * from pernia_db.rating where rating_id= ? AND product_id=?`,
      [id,pid],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getRatingByProductId: (id,callBack) => {
    pool.query(
      `select  * from pernia_db.rating where product_id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },






//   getCategoryByProductId: (id, callBack) => {
//     pool.query(
//       `select * from category inner join product on category.id = product.category_id where product.id = ?`,
//       [id],
//       (error, results, fields) => {
//         if (error) {
//           return callBack(error,null);
//         }
//         return callBack(null, results);
//       }
//     );
//   },
// `+Object.keys(data).map(key => `${key} = ?`).join(", ") +"
  updateRatingById: (id,rid,pid,data, callBack) => {
    pool.query(
      `update pernia_db.rating set total_count=?  where id=? AND(rating_id =? AND product_id=?)`,
        [
          data,
          id,
          rid,
          pid
      ],
      (error, result, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, result);
      }
    );
  },
  deleteRatingById: (id, callBack) => {
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
//   deleteAllShippings: (callBack) => {
//     pool.query(
//       `delete from shipper`,
//       [],
//       (error, results, fields) => {
//         if (error) {
//           console.log("error occured "+err)
//           return callBack(error,null);
//         }
//         console.log("results are "+results[0])
//         return callBack(null,results);
//       }
//     );
//   },

};