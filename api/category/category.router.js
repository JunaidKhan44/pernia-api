const router = require("express").Router();
const multer = require('multer');
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllCategories,
addCategory,
deleteAllCategories,
getCategoryById,
updateCategoryById,
deleteCategoryById,
getCategoryByProductId,
getParentCategories,
uploadCategoryImage

} = require("./category.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
  
    filename: (req, file, cb) => {
        console.log('file',file)
        cb(null, Date.now()+"-"+file.originalname)
    }
  });
  
  const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
  };

const upload = multer({ storage: storage, fileFilter: imageFileFilter,limits:{fileSize:1000000}});



const use = fn => (req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next)
}
router.get("/", use(getAllCategories));
router.get("/getParentCategories", use(getParentCategories));
router.get("/:id",use(getCategoryById));
router.get("/getCategoryOfProduct",use(getCategoryByProductId));
router.post("/", use(addCategory));
router.delete("/", use(deleteAllCategories));
router.put("/:id",use(updateCategoryById));
router.delete("/:id",use(deleteCategoryById));
router.post("/uploadCategoryImage/:id",  upload.single('imageFile'),use(uploadCategoryImage));
module.exports = router;