const {
  addTag,
  getAllTags,
  getTagById,
  updateTagById,
  deleteTagById,
  deleteAllTags,
  //getSuppliersByProductId,
 // getProductsProvidedBySupplierUsingSupplierId
} = require("./tag.service");
module.exports = {
  addTag: (req, res) => {
    const body = req.body;
      addTag(body).then((results)=>
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
  getTagById: (req, res) => {
    const id = req.params.id;
      getTagById(id, (err, results) => {
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
  getAllTags: (req, res) => {
    getAllTags((err, results) => {
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
  
  
  updateTagById: (req, res) => {
    const body = req.body;
    const id = req.params.id;
    console.log("id of update"+id)
    updateTagById(id, body, (err, results) => {
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
          message: "Tag updated successfully",
        });
      });
  },
  deleteTagById: (req, res) => {
    const id = req.params.id;
      deleteTagById(id, (err) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "Tags deleted successfully",
        });
      });
  },
  deleteAllTags: (req, res) => {
      deleteAllTags((err,result) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Database conection error",
            error:err
          });
        }
        return res.json({
          success: 1,
          message: "deleted all Tags successfully",
        });
      });
  },
};
