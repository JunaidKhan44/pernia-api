const pool = require("../../config/database");

module.exports = {
  addTag: (data) => {
    return new Promise((resolve,reject)=>
    {
      pool.query(
        `insert into pernia_db.tag set name=?`,
          [
          data.name,
          
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
  getAllTags: (callBack) => {
    pool.query(
      `select * from pernia_db.tag`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getTagById: (id, callBack) => {
    pool.query(
      `select * from pernia_db.tag where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },



  updateTagById: (id,data, callBack) => {
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
  deleteTagById: (id, callBack) => {
    pool.query(
      `delete from pernia_db.tag where id = ?`,
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
  deleteAllTags: (callBack) => {
    pool.query(
      `delete from pernia_db.tag`,
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