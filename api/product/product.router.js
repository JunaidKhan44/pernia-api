const router = require("express").Router();
const multer = require('multer');
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllProducts,

addProduct,
deleteAllProducts,
getProductById,
updateProductById,
deleteProductById,
getProductsByCategoryId,
getProductsByCollectionId,
getProductsPerPage,
uploadProductImages,
searchProduct,
getAllVariantsAndItsValues
} = require("./product.controller");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
  
    filename: (req, file, cb) => {
        console.log()
        cb(null, Date.now()+"-"+file.originalname)
    }
  });
  
  const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
  };
  const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
const upload = multer({ storage: storage, fileFilter: imageFileFilter});
router.get("/", use(getAllProducts));
router.get("/page/:id", use(getProductsPerPage));
router.get("/variants", use(getAllVariantsAndItsValues));
router.get("/:id", use(getProductById));
router.get("/category/:id", use(getProductsByCategoryId));
router.get("/collection/:id", use(getProductsByCollectionId));
router.post("/",use(addProduct));
router.delete("/",  use(deleteAllProducts));
router.put("/:id", use(updateProductById));
router.delete("/:id" , use(deleteProductById));
router.post("/uploadProductImages/:id", upload.array('imageFile',8),use(uploadProductImages));
router.post("/search",searchProduct);

module.exports = router;
// ,checkToken,isAdmin,