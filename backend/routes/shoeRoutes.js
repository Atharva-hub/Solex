import express from "express";
import {getShoes,createShoe,updateShoe,deleteShoe} from "../controllers/shoeController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/',getShoes);

router.post('/',protect,admin, upload.single('image'), createShoe);

router.put('/:id',protect,admin , updateShoe);

router.delete('/:id',protect,admin,  deleteShoe);

export default router;


