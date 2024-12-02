const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');
const router = express.Router();

// Configuration Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes pour les produits
router.get('/', productController.getProducts);
router.get('/add', productController.showAddProductForm);
router.post('/add', upload.single('image'), productController.addProduct);
router.get('/edit/:id', productController.showEditProductForm);
router.post('/edit/:id', upload.single('image'), productController.updateProduct);
router.post('/delete/:id', productController.deleteProduct);

module.exports = router;
