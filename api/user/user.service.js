const pool = require("../../config/database");

module.exports = {
  addUser: (data, callBack) => {
    pool.query(
      `insert into pernia_db.user set  email=?, password=? , type='user' , created_at = now()`,
        [
        data.email,
        data.password
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        delete data.email;
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
            return callBack(null,  result);
          }
        );
      }
    );
  },
  addAdminByAdmin: (data, callBack) => {
    let type='user'
    if(data.type!='admin')
    type='admin'
    pool.query(
      `insert into pernia_db.user set  email=?, password=? , type='${type}' , created_at = now()`,
        [
        data.email,
        data.password
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        delete data.email;
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
            return callBack(null,  result);
          }
        );
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from pernia_db.user as u inner join pernia_db.profile as p on u.id=p.user_id where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserName: (username, callBack) => {
    pool.query(
      `select * from pernia_db.user where user_name = ?`,
      [username],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      `select * from pernia_db.user inner join pernia_db.profile on pernia_db.user.id=pernia_db.profile.user_id where pernia_db.user.id = ? `,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getAllUsers: (callBack) => {
       pool.query(
      `select * from pernia_db.user inner join pernia_db.profile on pernia_db.user.id=pernia_db.profile.user_id`,
        [],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null, results);
      }
    );
  },
  getAllUserProfiles: (callBack) => {
    pool.query(
   `select * from pernia_db.profile`,
     [],
   (error, results, fields) => {
     if (error) {
       return callBack(error,null);
     }
     return callBack(null, results);
   }
 );
},
  updateUserNameByUserId: (id,username, callBack) => {
    pool.query(
      `update pernia_db.user set user_name=? where id =?`,
        [
          username,
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
  updatePasswordByUserId: (data, callBack) => {
    pool.query(
      `update pernia_db.user set password=? where id = ?`,
      [
        data.password,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteUserByUserId: (id, callBack) => {
    pool.query(
      `delete from pernia_db.user where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          console.log("error occured "+err)
          return callBack(error,null);
        }
        console.log("results are "+results[0])
        return callBack(null,results[0]);
      }
    );
  },
  updateLoginStatus: (login,status,rememberToken, callBack) => {
    if(login)
    {
    pool.query(
      `update pernia_db.user set last_login=now(),isActive=?,remember_token=? where id = ?`,
      [
        status,
        rememberToken,
        id

      ],
      (error, results, fields) => {
        if (error) {
          console.log("error occured "+err)
          return callBack(error);
        }
        console.log("results are "+results[0])
        return callBack(null);
      }
    );
    }
    else{
      pool.query(
        `insert into pernia_db.user set isActive=?,remember_token=? where id = ?`,
        [
          status,
          rememberToken,
          id
  
        ],
        (error, results, fields) => {
          if (error) {
            console.log("error occured "+err)
            return callBack(error);
          }
          console.log("results are "+results[0])
          return callBack(null);
        }
      );
    }
  },
  sendMail:(msg,token,callBack)=>
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
      html: `<h2>${msg.message}</h2>
      <a>${token}</a>`,
    };
    mg.messages().send(data, (err,result)=> {
      if (err) {
        return callBack(err,null)
      }
      return callBack(null,result)
      
    });
  },
  activateUserAccount: (id, callBack) => {
    console.log("in activate account")
    pool.query(
      `update pernia_db.user set isVerified=1 where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error,null);
        }
        return callBack(null,results);
      }
    );
  },

updateUserProfileByUserId: (id,data, callBack) => {
  pool.query(
    `update pernia_db.profile set `+Object.keys(data).map(key => `${key} = ?`).join(", ") +" where id =?",
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
deleteAllUsers: (callBack) => {
  pool.query(
    `delete from pernia_db.user`,
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
updatelastlogin: (date,id,callBack) => {
  pool.query(
    `update pernia_db.user set last_login=? where id=?` ,
    [date,id],
    (error, results, fields) => {
      if (error) {
        console.log("error occured "+error)
        return callBack(error,null);
      }
      console.log("results are "+results)
      return callBack(null,results);
    }
  );
}
};