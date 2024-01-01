const router = require("express").Router();
const multer = require('multer');
const { checkToken, isAdmin } = require("../../auth/token_validation");
const {
getAllSuppliers,
addSupplier,
deleteAllSuppliers,
getSupplierById,
updateSupplierById,
deleteSupplierById,
getSuppliersByProductId,
getProductsProvidedBySupplierUsingSupplierId,
uploadCollectionImage,
uploadHeadImage,

} = require("./supplier.controller");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Brandimages');
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
router.get("/", use(getAllSuppliers));
router.get("/getProductProvidedBySupplier/:id",use(getProductsProvidedBySupplierUsingSupplierId));

router.get("/getSuppliersOfProduct/:id",use(getSuppliersByProductId));
router.get("/:id",use(getSupplierById));
//By giving product id will give you the Supplier assign to that product 

router.post("/", use(addSupplier));
router.delete("/", use(deleteAllSuppliers));
router.put("/:id",use(updateSupplierById));
router.delete("/:id",use(deleteSupplierById));
router.post("/uploadBrandLogo/:id",  upload.single('imageFile'),use(uploadCollectionImage));
router.post("/uploadBrandHead/:id",  upload.single('imageFile'),use(uploadHeadImage));
module.exports = router;