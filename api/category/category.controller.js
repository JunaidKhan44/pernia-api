const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  deleteAllCategories,
  getParentCategories,
  uploadCategoryImage,
} = require("./category.service");
module.exports = {
  addCategory: (req, res) => {
    const body = req.body;
    console.log('bodyyy',req.body)
    var InsertedId = 0;
    
      addCategory(body, (err, results) => {
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
                "Category Added Successfully ",
              data: results,
              InsertedId:results.insertId
            });
    });
  },

  uploadCategoryImage: (req, res) => {
    console.log('files',req.file)
    uploadCategoryImage(req.params.id, req.file)
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





  getCategoryById: (req, res) => {
    const id = req.params.id;
      getCategoryById(id, (err, results) => {
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
  getAllCategories: (req, res) => {
    getAllCategories((err, results) => {
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
  updateCategoryById: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log("id of update"+id)
    updateCategoryById(id, body, (err, results) => {
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
          message: "category updated successfully",
        });
      });
  },
  deleteCategoryById: (req, res) => {
    const id = req.params.id;
      deleteCategoryById(id, (err) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "Category deleted successfully",
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
