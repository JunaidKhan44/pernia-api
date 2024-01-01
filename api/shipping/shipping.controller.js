const {
  addShipping,
  getAllShippings,
  getShippingById,
  updateShippingById,
  deleteShippingById,
  deleteAllShippings,
  getParentCategories
} = require("./shipping.service");
module.exports = {
  addShipping: (req, res) => {
    const body = req.body;
      addShipping(body, (err, results) => {
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
                "Shipper Added Successfully ",
              data: results
            });
    });
  },
  getShippingById: (req, res) => {
    const id = req.params.id;
      getShippingById(id, (err, results) => {
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
  getAllShippings: (req, res) => {
    getAllShippings((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error:err
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getParentCategories: (req, res) => {
    getParentCategories((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error:err
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getCategoryByProductId: (req, res) => {
    const id = req.params.id;
    getCategoryByProductId(id,(err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
          error:err
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updateShippingById: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log("id of update"+id)
    updateShippingById(id, body, (err, results) => {
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
          message: "Shipper updated successfully",
        });
      });
  },
  deleteShippingById: (req, res) => {
    const id = req.params.id;
      deleteShippingById(id, (err) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "Shipper deleted successfully",
        });
      });
  },
  deleteAllShippings: (req, res) => {
      deleteAllShippings((err,result) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "deleted all Shippers successfully",
        });
      });
  },
};
