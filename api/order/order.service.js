const pool = require("../../config/database");

module.exports = {
  addGuestUser: (data, callBack) => {
    pool.query(
      `insert into pernia_db.user set email=?, type='guest' , created_at = now()`,
        [
        data.email
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        delete data.email;
        delete data.user_name;
        delete data.password;
        delete data.type;
        console.log("results  are ",results)
        pool.query(
          `insert into pernia_db.profile set user_id=${results.insertId}, `+Object.keys(data).map(key => `${key} = ?`).join(", ") +"",
            [
              ...Object.values(data)
          ],
          (error, result, fields) => {
            if (error) {
              return callBack(error,null);
            }
            result['user_id']=results.insertId
            return callBack(null, result);
          }
        );
      }
    );
  },
  sendMail:(invoice)=>
  {
    console.log("sending mail");
    return new Promise((resolve, reject)=>
    {
      const mailgun = require("mailgun-js");
      const DOMAIN = "sandbox4c656a09d3e34e0db52944f28a922d5f.mailgun.org";
      const mg = mailgun({
        apiKey: "cb29bdfc53d33a8895033abb2c1ea31b-45f7aa85-25443ef7",
        domain: DOMAIN,
      });
      const data = {
        from: "noreply@ecommerce.pk",
        to: 'faizanafridibwp@gmail.com',
        subject: "Email Verification",
        html:`<h1>sggsgsy</h1>`,
        attachment:new mg.Attachment({data: Buffer.from(invoice,'base64'),filename:"invoice.pdf"})
      };
      mg.messages().send(data, (err,result)=> {
        if (err) {
          console.log("error",err)
          return reject(err)
        }
        return resolve(result)
        
      });
    })
  },
  addUserOrder: (data) => {
    return new Promise((resolve,reject)=>
    {
    pool.query(
      `insert into pernia_db.order set user_id=?, total_amount=? , shipping_id=? , billing_id=?, date = now(),total_items=?,delivery_method=?, payment_method=?, fulfillment_status='unfulfilled',payment_status='pending'`,
        [
        data.user_id,
        data.total_amount,
        data.shipping_id,
        data.billing_id,
        data.total_items,
        data.delivery_method,
        data.payment_method
      ],
      (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  })
  },
  addUserAddress: (user_id,data,type) => {
    return new Promise((resolve,reject)=>
    {
    pool.query(
      `insert into pernia_db.address set user_id=${user_id}, user_address=?, type='${type.toString()}', name=?, city=?, used_at = now(), province=?, postal_code=?, country=?`,
        [
        data.user_address,
        data.name,
        data.city,
        data.province,
        data.postal_code,
        data.country
      ],
      (error, results, fields) => {
        if (error) {
          console.log("error",error)
          return reject(error);
        }
        return resolve(results);
      }
    );
  })
  },
  updateUserAddressByAddressId: (id) => {
    return new Promise((resolve,reject)=>
    {
      pool.query(
        `update pernia_db.address set used_at=now() where id =?`,
          [
            id
        ],
        (error, result, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );

    })
  },
  addOrderDetails: (products,order_id) => {
    return new Promise((resolve ,reject)=>
    {

    let sql = 'INSERT INTO pernia_db.order_details (order_id,product_id,product_variant_id,quantity,price,product_name,product_variant_name,path) values '
    products.forEach(product => {
      sql += `(${order_id} ,${product.product_id}, ${product.product_variant_id} , ${product.quantity} , ${product.price}, "${product.product_name}", "${product.product_variant_name}" , "${product.path}" ),`
    })
    sql = sql.slice(0,-1)
    pool.query(
      sql,
      (error, results, fields) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  })
  },
  getAllOrders: (callBack) => {
    
    pool.query(
      'SELECT * FROM pernia_db.order',
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getAllOrdersByUserId: (id,callBack) => {
    
    pool.query(
      'SELECT * from pernia_db.order where user_id =?',
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  
  getOrderById: (id, callBack) => {
    pool.query(
`select o.*,s.*,
 GROUP_CONCAT( distinct 
   CONCAT(COALESCE( od.product_variant_id,"null"),",",od.product_id,",",od.product_name,",",COALESCE( od.product_variant_name,"null"),",",od.price,",",od.quantity,",",od.path)
   SEPARATOR ":" ) AS products from pernia_db.order_details as od
left outer join pernia_db.order as o on od.order_id=o.id
inner join pernia_db.address as s on o.shipping_id=s.id
where o.id = ? GROUP BY o.id`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getOrderByMonth: (callBack) => {
    pool.query(
`SELECT date,id,total_items FROM pernia_db.order where  date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`,
      
      (error, results) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getOrderByPrevMonth: (callBack) => {
    pool.query(
`SELECT * FROM  pernia_db.order WHERE MONTH( DATE ) = MONTH( DATE_SUB(CURDATE(),INTERVAL 1 MONTH )) 
AND 
YEAR( DATE ) = YEAR( DATE_SUB(CURDATE( ),INTERVAL 1 MONTH ))`,
      
      (error, results) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getOrderBycurrWeek: (callBack) => {
    pool.query(
`SELECT * FROM pernia_db.order WHERE WEEKOFYEAR(date)=WEEKOFYEAR(CURDATE())`,
      
      (error, results) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getOrderByYear: (callBack) => {
    pool.query(
`select year(date),month(date),sum(total_items)
from pernia_db.order
group by year(date),month(date)
order by year(date),month(date);`,
      
      (error, results) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  updateOrderById: (id,data, callBack) => {
    pool.query(
      `update pernia_db.order set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" where id =?",
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
  updateOrderDetailsByOrderId: (id,data, callBack) => {
    pool.query(
      `update pernia_db.order_details set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" where order_id =?",
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
  deleteOrderById: (id, callBack) => {
    id = parseInt(id)
    pool.query(
      `delete  from pernia_db.order where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log("error occured "+error)
          return callBack(error,null);
        }
        console.log("results are "+results[0])
        return callBack(null,results);
      }
    );
  },
  deleteAllOrders: (callBack) => {
    pool.query(
      `delete from pernia_db.order`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        console.log("results are "+results[0])
        return callBack(null,results);
      }
    );
  },

};