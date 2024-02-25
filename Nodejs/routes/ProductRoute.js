import express  from "express";

import { getProducts,
     getProductById, 
     createProduct,
     updateProduct,
     deleteProduct
} from '../controllers/ProductController.js';

const router = express.Router();

import { auth } from '../middlewares/auth.js';

router.get('/products', auth, getProducts);
router.get('/products/:id', auth, getProductById);
router.post('/products', auth, createProduct);
router.patch('/products/:id', auth, updateProduct);
router.delete('/products/:id', auth, deleteProduct);


export default router;