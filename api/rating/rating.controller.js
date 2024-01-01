const {
    //addShipping,
    //getAllShippings,
    addRating,
    getRatingByProductId,
    getRatingByOnlyProductId,
    getRatingById,
    updateRatingById,
    deleteRatingById,
   // deleteAllShippings,
   // getParentCategories
  } = require("./rating.service");
  module.exports = {
    addRating: (req, res) => {
      const body = req.body;
        addRating(body, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection errror",
                error:err
              });
            }
              return res.status(200).json({
                success: 1,
                message:
                  "Rating Added Successfully ",
                data: results
              });
      });
    },
    getRatingById: (req, res) => {
      const id = req.params.id;
        getRatingById(id, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror",
              error:err
            });
          }
          if (!results) {
            return res.status(404).json({
              success: 0,
              message: "Record not Found",
            });
          }
          results.password = undefined;
          return res.json({
            success: 1,
            data: results,
          });
        });
    },
    
    getRatingByProductId: (req, res) => {
        const id = req.params.id;
        
          getRatingByProductId(id, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection errror",
                error:err
              });
            }
            if (!results) {
              return res.status(404).json({
                success: 0,
                message: "Record not Found",
              });
            }
            return res.json({
              success: 1,
              data: results,
            });
          });
      },

      getRatingByOnlyProductId: (req, res) => {
        const id = req.params.id;
        console.log('dddd',id)
        
          getRatingByProductId(id, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection errror",
                error:err
              });
            }
            if (!results) {
              return res.status(404).json({
                success: 0,
                message: "Record not Found",
              });
            }
            return res.json({
              success: 1,
              data: results,
            });
          });
      },






    // getAllShippings: (req, res) => {
    //   getAllShippings((err, results) => {
    //     if (err) {
    //       return res.status(500).json({
    //         success: 0,
    //         message: "Database connection errror",
    //         error:err
    //       });
    //     }
    //     return res.json({
    //       success: 1,
    //       data: results,
    //     });
    //   });
    // },
    // getParentCategories: (req, res) => {
    //   getParentCategories((err, results) => {
    //     if (err) {
    //       return res.status(500).json({
    //         success: 0,
    //         message: "Database connection errror",
    //         error:err
    //       });
    //     }
    //     return res.json({
    //       success: 1,
    //       data: results,
    //     });
    //   });
    // },
    // getCategoryByProductId: (req, res) => {
    //   const id = req.params.id;
    //   getCategoryByProductId(id,(err, results) => {
    //     if (err) {
    //       return res.status(500).json({
    //         success: 0,
    //         message: "Database connection errror",
    //         error:err
    //       });
    //     }
    //     return res.json({
    //       success: 1,
    //       data: results,
    //     });
    //   });
    // },
    updateRatingById: (req, res) => {
      const body = req.body.total_count;
      const rid=req.body.rating_id;
      const pid=req.body.product_id;
      const id = req.params.id;
      console.log("id of update"+body)
      updateRatingById(id,rid,pid, body, (err, results) => {
          if (err) {
            console.log(err);
            return res.json({
              success: 0,
              message: "database connection error",
              error:err
            });
          }
          return res.json({
            success: 1,
            message: "rating updated successfully",
          });
        });
    },
    deleteRatingById: (req, res) => {
      const id = req.params.id;
        deleteRatingById(id, (err) => {
          if (err) {
            return res.json({
              success: 0,
              message: "Database conection error",
              error:err
            });
          }
          return res.json({
            success: 1,
            message: "Rating deleted successfully",
          });
        });
    },
    // deleteAllShippings: (req, res) => {
    //     deleteAllShippings((err,result) => {
    //       if (err) {
    //         return res.json({
    //           success: 0,
    //           message: "Database conection error",
    //           error:err
    //         });
    //       }
    //       return res.json({
    //         success: 1,
    //         message: "deleted all Shippers successfully",
    //       });
    //     });
    // },
  };
  