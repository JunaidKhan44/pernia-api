
const userRouter = require("./api/user/user.router");
const productRouter = require("./api/product/product.router");
const categoryRouter = require("./api/category/category.router");
const orderRouter = require("./api/order/order.router");
const couponRouter = require("./api/coupon/coupon.router");
const addressRouter = require("./api/address/address.router");
const supplierRouter = require("./api/supplier/supplier.router");
const shippingRouter = require("./api/shipping/shipping.router");
const paymentRouter = require("./api/payment/payment.router");
const ratingRouter = require("./api/rating/rating.router");
const tagRouter = require("./api/tag/tag.router");
const collectionRouter = require("./api/collections/collections.router");

const routes = require("express").Router();
routes.use("/ecom-api/users", userRouter);
routes.use("/ecom-api/products", productRouter);
routes.use("/ecom-api/categories", categoryRouter);
routes.use("/ecom-api/orders", orderRouter);
routes.use("/ecom-api/coupons", couponRouter);
routes.use("/ecom-api/addresses", addressRouter);
routes.use("/ecom-api/suppliers", supplierRouter);
routes.use("/ecom-api/shipping", shippingRouter);
routes.use("/ecom-api/payment", paymentRouter);
routes.use("/ecom-api/rating", ratingRouter);
routes.use("/ecom-api/tag", tagRouter);
routes.use("/ecom-api/collections", collectionRouter);
module.exports = routes;