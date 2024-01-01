const pool = require("../../config/database");

module.exports = {
  addSupplier: (data) => {
    return new Promise((resolve,reject)=>
    {
      pool.query(
        `insert into pernia_db.supplier set name=?,email=?,phone=?,address=?,description=?,featured=?`,
          [
          data.name,
          data.email,
          data.phone,
          data.address,
          data.description,
          data.featured
        ],
        (error, results, fields) => {
          if (error) {
            reject ({err:error})
          }
          resolve ({results:results})
        }
      );

    })
  },
  uploadCollectionImage: (id, files, callBack) => {
    console.log('our files',files,id)
    return new Promise((resolve,reject)=>
    {
      let sql = "UPDATE pernia_db.supplier set logo=? where id=?";
      
        files.path = files.path.replace("\\", "/");
        //sql += '("' + id + '","' + files.path + '"),';
     // sql = sql.slice(0, -1);
      pool.query(sql, [files.path,id], 
        (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        console.log("image uploaded",results)
        return resolve(results);
      });
    })
  },

  uploadHeadImage: (id, files, callBack) => {
    console.log('our files',files,id)
    return new Promise((resolve,reject)=>
    {
      let sql = "UPDATE pernia_db.supplier set header=? where id=?";
      
        files.path = files.path.replace("\\", "/");
        //sql += '("' + id + '","' + files.path + '"),';
     // sql = sql.slice(0, -1);
      pool.query(sql, [files.path,id], 
        (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        console.log("image uploaded",results)
        return resolve(results);
      });
    })
  },

  
  getAllSuppliers: (callBack) => {
    pool.query(
      `select * from pernia_db.supplier`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getSupplierById: (id, callBack) => {
    pool.query(
      `select id , name,address,email,phone,description from pernia_db.supplier where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getSuppliersByProductId: (id, callBack) => {
    pool.query(
      `select s.id , s.name from pernia_db.supplier as s inner join pernia_db.product as p on p.supplier_id=s.id where p.id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getProductsProvidedBySupplierUsingSupplierId: (id, callBack) => {
    pool.query(
      `select p.id , p.name from pernia_db.product as p inner join pernia_db.supplier as s on p.supplier_id = s.id where s.id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },


  updateSupplierById: (id,data, callBack) => {
    pool.query(
      `update pernia_db.supplier set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" where id =?",
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
  deleteSupplierById: (id, callBack) => {
    pool.query(
      `delete from pernia_db.supplier where id = ?`,
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
  deleteAllSuppliers: (callBack) => {
    pool.query(
      `delete from pernia_db.supplier`,
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