import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  softDeleteOrders,
  cancelOrder,
  requestReturn,
  approveRefund,
} from "../controllers/orderController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser }  from "../middleware/attachUser.js";
import { checkAdmin }  from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, attachUser);

router.post(   "/",                   placeOrder);
router.get(    "/",                   getOrders);
router.delete( "/soft-delete",        softDeleteOrders);
router.patch(  "/:id/cancel",         cancelOrder);        
router.patch(  "/:id/return",         requestReturn);     

router.get(    "/all",                checkAdmin, getAllOrders);
router.patch(  "/:id/status",         checkAdmin, updateOrderStatus);
router.patch(  "/:id/refund/approve", checkAdmin, approveRefund);   

router.get(    "/:id",                getOrderById);

export default router;

