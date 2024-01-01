const {
  addCollection,
  getAllCollections,
  getCollectionById,
  updateCollectionById,
  deleteCollectionById,
  deleteAllCategories,
  getParentCategories,
  uploadCollectionImage,
} = require("./collections.service");
module.exports = {
  addCollection: (req, res) => {
    const body = req.body;
    console.log('bodyyy',req.body)
    var InsertedId = 0;
    
      addCollection(body, (err, results) => {
         InsertedId=results.insertId
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
                "Collection Added Successfully ",
              data: results,
              InsertedId:results.insertId
            });
    });
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





  getCollectionById: (req, res) => {
    const id = req.params.id;
      getCollectionById(id, (err, results) => {
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
  getAllCollections: (req, res) => {
    getAllCollections((err, results) => {
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
  updateCollectionById: (req, res) => {
    const body = req.body;
    console.log("body",body)
    const id = req.params.id;
    console.log("id of update"+id)
    updateCollectionById(id, body, (err, results) => {
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
          message: "collection updated successfully",
        });
      });
  },
  deleteCollectionById: (req, res) => {
    const id = req.params.id;
      deleteCollectionById(id, (err) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "Collection deleted successfully",
        });
      });
  },
  deleteAllCategories: (req, res) => {
      deleteAllCategories((err,result) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "deleted all categories successfully",
        });
      });
  },
};
