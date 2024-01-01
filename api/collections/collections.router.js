const router = require("express").Router();
const multer = require('multer');
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllCollections,
addCollection,
deleteAllCategories,
getCollectionById,
updateCollectionById,
deleteCollectionById,
getCategoryByProductId,
getParentCategories,
uploadCollectionImage

} = require("./collections.controller");

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
router.get("/", use(getAllCollections));
router.get("/getParentCategories", use(getParentCategories));
router.get("/:id",use(getCollectionById));
router.get("/getCategoryOfProduct",use(getCategoryByProductId));
router.post("/", use(addCollection));
router.delete("/", use(deleteAllCategories));
router.put("/:id",use(updateCollectionById));
router.delete("/:id",use(deleteCollectionById));
router.post("/uploadCollectionImage/:id",  upload.single('imageFile'),use(uploadCollectionImage));
module.exports = router;