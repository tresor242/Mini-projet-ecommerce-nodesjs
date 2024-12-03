const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const router = express.Router();

// Configuration Multer pour gérer les uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Répertoire pour enregistrer les fichiers
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname); // Nom unique
    }
});
const upload = multer({ storage });

// Route pour le tableau de bord admin
router.get('/', adminController.getDashboard);

// Routes pour la gestion des utilisateurs
router.get('/users', userController.getUsers);
router.get('/users/add', userController.showAddUserForm);
router.post('/users/add', upload.single('image'), userController.addUser);
router.get('/users/edit/:id', userController.showEditUserForm); // Formulaire de modification
router.post('/users/edit/:id', upload.single('image'), userController.updateUser); // Soumission de modification
router.post('/users/delete/:id', userController.deleteUser);

// Routes pour la gestion des produits
router.get("/products", productController.getProducts);
router.get("/products/add", productController.showAddProductForm);
router.post("/products/add", upload.single("image"), productController.addProduct);
router.get("/products/edit/:id", productController.showEditProductForm);
router.post("/products/edit/:id", upload.single("image"), productController.updateProduct);
router.post("/products/delete/:id", productController.deleteProduct);
module.exports = router;
