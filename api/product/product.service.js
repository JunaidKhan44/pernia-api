const { getConnection } = require("../../config/database");
const pool = require("../../config/database");
// const path =require('path')
addProductVariantDetails = (id, valueId) => {
  console.log("in add product cariants");
  return new Promise((resolve, reject) => {
    let sql =
      "INSERT INTO pernia_db.product_variant_details set product_variant_id= ?,variant_value_id=? ";
    pool.query(sql, [id, valueId], (error, results, fields) => {
      if (error) {
        console.log("adding details error",error);
        return reject(error);
      }
      console.log("adding details result", results);
      return resolve(results);
    });
  });
};
addVariantValue= (variant_id, variant_value) => {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO pernia_db.variant_values set variant_id=?,value=? ";
    pool.query(sql, [variant_id,variant_value], (error, results, fields) => {
      if (error) {
        console.log("error adding variant value added",error)
        return reject(error);
      }
      console.log("variant value added",results)
      return resolve(results);
    });
  });
};
searchProductVariantValue = (variant_value) => {
  console.log("in add product cariants");
  return new Promise((resolve, reject) => {
    sql = `SELECT id FROM pernia_db.variant_values as varval where varval.value like '${variant_value}'`;
    pool.query(sql, [], (error, results, fields) => {
      if (error) {
        console.log("the errrror is", error);
        return reject(error);
      }
      console.log("result in searching variant value is", results);
      resolve(results);
    });
  });
};
module.exports = {
  addProduct: (data) => {
    return new Promise((resolve, reject) => {
      if (data.variants) {
        console.log('areeb datta',data)
        pool.query(
          `insert into pernia_db.product set name=?,  product_description=?,,price=?,collection_id=? has_variant=1`,
          [
            data.name,
            
            data.product_description,
           
            data.price,
            data.collection_id,
          ],
          (error, results, fields) => {
            console.log('my reslt',results)
            if (error) {
              console.log('heloo',error)
              return reject(error);
            }
            resolve(results);
          }
        );
      } else {
        console.log("in addd",data);
        let iid=Math.floor(Math.random() * 10)
        pool.query(
          `insert into pernia_db.product set id=?,name=?,collection_id=?, product_description=?,sku=?,regular_price=?,stock_quantity=?,low_stock_threshold=?,discount_price=?`,
          [
            iid,
            data.name,
          
            data.collection_id,
            data.product_description,
           
            data.sku,
            data.price,
           
            data.quantity,
            data.stock_status,
            data.low_stock_threshold,
            data.discounted_price,
          ],
          (error, results, fields) => {
            if (error) {
              console.log(error)
              return reject(error);
            }
            resolve(results);
          }
        );
      }
    });
  },
  getProductBySKU: (sku, variant) => {
    return new Promise((resolve, reject) => {
      var table = "";
      if (variant) table = "product_variants";
      else table = "product";
      console.log("var", variant, table);

      pool.query(
        `select id from pernia_db.${table} where sku=?`,
        [sku],
        (error, result, fields) => {
          console.log("sku", result, error);
          if (error) {
            console.log(error);
            return reject(error);
          }
          if (result.id) {
            console.log("sku duplicate", result, sku);
            return reject(0);
          } else console.log("sku not duplicate", result, error, sku);
          resolve(result);
        }
      );
    });
  },
  addVariant: (name) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into pernia_db.variant set name= ?`,
        [name],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  },

  addVariantValues: (id, values) => {
    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO pernia_db.variant_values (variant_id,value) values ";
      values.forEach((value) => {
        sql += '("' + id + '","' + value + '"),';
      });
      sql = sql.slice(0, -1);
      pool.query(sql, [], (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    });
  },
  searchAndAddVariantValue: (variant_id, variant_values) => {
    console.log("in saerch")
    console.log("variant values are")
    const promises=[];
    return new Promise((resolve, reject) => {
      variant_values.forEach((value) => {
        promises.push(
        searchProductVariantValue(value).then((result)=>
        {
          console.log("search results",result)
          if(result.length)
          {
            return result
          }
          else
          {
            console.log("not found",result)
            return addVariantValue(variant_id,value)
          }
        })
        )
        
      })
      console.log("searcg and promises",promises)

      Promise.all(promises).then((result)=>
      {
       return resolve(result)
      })
      .catch((err)=>
      {
        return reject(err)
      })
    })
  },
  addProductVariants: (id, combinations) => {
    console.log("fafafafa");
    return new Promise((resolve, reject) => {
      let sql =
        "INSERT IGNORE INTO pernia_db.product_variants (product_id,product_variant_name,sku,regular_price) values ";
      combinations.forEach((combination) => {
        sql +=
          '("' +
          id +
          '","' +
          combination.product_variant_name +
          '","' +
          combination.sku +
          '","' +
          combination.regular_price +
          '"),';
      });
      sql = sql.slice(0, -1);
      pool.query(sql, [], (error, results, fields) => {
        if (error) {
          console.log("error", error);
          return reject(error);
        }
        console.log("data", results);
        resolve(results);
      });
    });
  },

  searchProductVariant: (start, end, combinations) => {
    const prmises = [];
    const pm = [];
    console.log(start, " hh ", end);
    for (let i = start; i < start + end; i++) {
      vv = combinations[i - start].product_variant_name.split("_");
      console.log("kk", vv.length);

      for (var j = 0; j < vv.length; j++) {
        console.log("variant value split ",vv[j])

        pm.push(
          searchProductVariantValue(vv[j]).then((re) => {
            // console.log(results);
            console.log("i is ", i);
            // let preturn = addProductVariantDetails(i, results[0].id);
            // console.log(typeof(preturn));
            // console.log(preturn);
            console.log("re", re);
            return addProductVariantDetails(i, re[0].id);
            // addProductVariantDetails(i, results[0].id);
            // console.log('promises', prmises);
            // pm = prmises;
          })
        );
      }
    }

    console.log("pm", pm);
    console.log("promises array is", pm); //it prints null
    return Promise.all(pm);
  },
  countProducts: (callBack) => {
    pool.query(
      `SELECT COUNT(*) AS count FROM pernia_db.product`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results[0].count);
      }
    );
  },
  getProductsPerPage: (data, callBack) => {
    pool.query(
      `SELECT *from (select p.id,p.name,p.category_id, p.price,pi.path from pernia_db.product as p left join pernia_db.product_images as pi on p.id=pi.product_id GROUP BY p.id)as Sub limit ${data.skip},${data.limit}`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },
  getAllProducts: (callBack) => {
    pool.query(
      `select p.id,p.name,p.collection_id, p.price,pi.path from pernia_db.product as p left join pernia_db.product_images as pi on p.id=pi.product_id `,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },
  getAllVariantsAndItsValues: (callBack) => {
    pool.query(
      `SELECT v.id, v.name as variants, 
      (SELECT group_concat(CONCAT(vv.value)) FROM pernia_db.variant_values as vv WHERE v.id = vv.variant_id GROUP BY (v.name)) AS variant_value
      FROM pernia_db.variant as v`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },
  getProductandVariantsById: (id, callBack) => {
    // group by v.name
    pool.query(
      `SELECT p.name as product_name,p.price,p.product_description,p.quantity,p.sku, group_concat(distinct pi.path) as image_paths,p.collection_id,pv.id, pv.product_id,group_concat(distinct (concat("'id':'",pv.id,"','product_variant_name':'",pv.product_variant_name,"','sku':'",pv.sku,"','regular_price':",pv.regular_price)) SEPARATOR ' ') as combinations,v.name as variant_name,
      group_concat(distinct  vv.value) as variant_values,
       pv.regular_price,pv.stock_quantity,pv.sku,v.id as variant_id FROM pernia_db.product as p
      inner join pernia_db.product_variants as pv on p.id=pv.product_id
	    left outer join pernia_db.product_images as pi on p.id=pi.product_id
      inner join pernia_db.product_variant_details as pvd on pv.id=pvd.product_variant_id 
      inner join pernia_db.variant_values as vv on pvd.variant_value_id=vv.id 
      inner join pernia_db.variant as v on vv.variant_id=v.id where p.id=? group by v.name `,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },
  getProductWithoutVariantsById: (id, callBack) => {
    pool.query(
      `SELECT  p.name as product_name,p.price ,p.product_description,p.quantity,p.sku,p.collection_id, group_concat(distinct pi.path) as image_paths from pernia_db.product as p
      left outer join pernia_db.product_images as pi on p.id=pi.product_id where p.id=? group by p.id `,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },
  uploadProductImages: (id, files, callBack) => {
    return new Promise((resolve,reject)=>
    {
      let sql = "INSERT INTO pernia_db.product_images (product_id, path) values ";
      files.forEach((file) => {
        file.path = file.path.replace("\\", "//");
        // file.path = path.join(__dirname,file.path)
  
        sql += '("' + id + '","' + file.path + '"),';
      });
      sql = sql.slice(0, -1);
      pool.query(sql, [], (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        console.log("image uploaded",results)
        return resolve(results);
      });
    })
    
 
  },
  getProductsByCategoryId: (id, callBack) => {
    pool.query(
      `select * from pernia_db.product where category_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },

  getProductsByCollectionId: (id, callBack) => {
    pool.query(
      `select * from pernia_db.product where collection_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },
  isProductHasVariants: (id, callBack) => {
    pool.query(
      `select has_variant from pernia_db.product where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  searchProduct: (query, callBack) => {
    pool.query(
      `select * from pernia_db.product where name LIKE %${query}%`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        return callBack(null, results);
      }
    );
  },

  updateProductById: (id, data) => {
    return new Promise((resolve,reject)=>
    {
    pool.query(
          `update pernia_db.product set name=?, category_id=?, product_description=?,supplier_id=?,sku=?,price=?,stock_status=?,quantity=?,low_stock_threshold=?,discounted_price=? where id=${id}`,
          [
            data.name,
            data.category_id,
            data.product_description,
            data.supplier_id,
            data.sku,
            data.price,
            data.stock_status,
            data.quantity,
            data.stock_status,
            data.low_stock_threshold,
            data.discounted_price
          ],
          (error, results, fields) => {
            if (error) {
              console.log("update rerror",error)
              return reject(error);
            }
            console.log("update results",results)
              resolve(results);
          }
        );
      })
  },
  deleteProductById: (id, callBack) => {
    pool.query(
      `delete from pernia_db.product where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error, null);
        }
        console.log("results are " + results[0]);
        return callBack(null, results);
      }
    );
  },
  deleteAllProducts: (callBack) => {
    pool.query(`delete from product`, [], (error, results, fields) => {
      if (error) {
        console.log("error occured " + err);
        return callBack(error, null);
      }
      console.log("results are " + results[0]);
      return callBack(null, results);
    });
  },
  deleteVariantsByProductId: (id) => {
    return new Promise((resolve,reject)=>{
    pool.query(
      `DELETE vv.*,pvd.*,pv.* FROM pernia_db.product_variants as pv
    inner join pernia_db.product_variant_details as pvd on pv.id=pvd.product_variant_id 
    inner join pernia_db.variant_values as vv on pvd.variant_value_id=vv.id  where pv.product_id=${id}
    `,

      [],
      (error, results, fields) => {
        if (error) {
          console.log("error occured in deleting " ,err);
          return reject(error);
        }
        console.log("deleting results are " ,results);
              resolve(results);
      }
    );
  });
  },
};


