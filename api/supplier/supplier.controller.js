const {
  addSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
  deleteAllSuppliers,
  getSuppliersByProductId,
  getProductsProvidedBySupplierUsingSupplierId,
  uploadCollectionImage,
  uploadHeadImage
} = require("./supplier.service");
module.exports = {
  addSupplier: (req, res) => {
    const body = req.body;
      addSupplier(body).then((results)=>
      {
        return res.status(200).json({
          success: 1,
          data:results
        });
      })
     .catch((err)=>
      {
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          error:err
        });
      }
     )
  },
  uploadCollectionImage: (req, res) => {
    console.log('files',req.file)
    uploadCollectionImage(req.params.id, req.file)
    .then((result)=>
    {
      return res.status(200).json({
        success: 1,
        data: result,
      });
        

    }).catch((err)=>
    {
      return res.status(500).json({
        success: 0,
        message: "database connection error",
        error: err,
      });
    })
  },

  uploadHeadImage: (req, res) => {
    console.log('files',req.file)
    uploadHeadImage(req.params.id, req.file)
    .then((result)=>
    {
      return res.status(200).json({
        success: 1,
        data: result,
      });
        

    }).catch((err)=>
    {
      return res.status(500).json({
        success: 0,
        message: "database connection error",
        error: err,
      });
    })
  },


  getSupplierById: (req, res) => {
    const id = req.params.id;
      getSupplierById(id, (err, results) => {
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
  getAllSuppliers: (req, res) => {
    getAllSuppliers((err, results) => {
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
  getProductsProvidedBySupplierUsingSupplierId: (req, res) => {
    const id = req.params.id;
    getProductsProvidedBySupplierUsingSupplierId(id,(err, results) => {
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
  getSuppliersByProductId: (req, res) => {
    const id = req.params.id;
    getSuppliersByProductId(id,(err, results) => {
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
  updateSupplierById: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log("id of update"+id)
    updateSupplierById(id, body, (err, results) => {
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
          message: "Supplier updated successfully",
        });
      });
  },
  deleteSupplierById: (req, res) => {
    const id = req.params.id;
      deleteSupplierById(id, (err) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "Supplier deleted successfully",
        });
      });
  },
  deleteAllSuppliers: (req, res) => {
      deleteAllSuppliers((err,result) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "deleted all Suppliers successfully",
        });
      });
  },
};
