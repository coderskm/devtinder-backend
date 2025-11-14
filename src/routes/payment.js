const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");

paymentRouter.post("/payment/create", userAuth, async(req, res) =>{
    try {
        const order = await razorpayInstance.orders.create({
          "amount": 50000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": "INR",
            "receipt": "order_rcptid_11",
            "notes": {
                "firstName": "coderskm",
                "lastName": "tmkc",
                "membershipType": "silver"
          }
        });

        return res.status(201).json({ order });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });

    }
})

module.exports = paymentRouter;

/*
1. create order
2. save it in database
3. return back order details to frontend
*/