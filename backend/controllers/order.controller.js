import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { logAdminActivity } from "../utils/adminLogger.js";

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { gameId, productId, qty, userInputs } = req.body;

        // Basic validations
        if (!gameId || !productId || !qty || !Array.isArray(userInputs)) {
            return res.status(400).json({ success: false, message: "Invalid request data" });
        }

        if (qty <= 0 || !Number.isInteger(qty)) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }

        // Validate user inputs early
        for (const input of userInputs) {
            if (!input.label || typeof input.value === "undefined") {
                return res.status(400).json({
                    success: false,
                    message: "Each input must contain label and value"
                });
            }
        }

        const sanitizedInputs = userInputs.map(input => ({
            label: input.label,
            value: input.value
        }));

        // Now hit the DB
        const product = await Product.findOne({ _id: productId, gameId });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found for this game" });
        }

        const unitPrice = product.discountedPrice ?? product.price;
        const amount = unitPrice * qty;

        let order;
        for (let i = 0; i < 3; i++) {
            try {
                const timestamp = Date.now().toString().slice(-6);
                const random = Math.random().toString(36).substring(2, 5).toUpperCase();
                const orderId = `ORD-${timestamp}-${random}`;

                order = await Order.create({
                    orderId,
                    user: req.user.id,
                    game: gameId,
                    product: productId,
                    amount,
                    userInputs: sanitizedInputs,
                    productSnapshot: {
                        name: product.name,
                        price: product.price,
                        discountedPrice: product.discountedPrice,
                        deliveryTime: product.deliveryTime || "24-48 Hours",
                    },
                    tracking: [{
                        status: "pending",
                        message: "Order placed successfully. Awaiting payment/verification."
                    }]
                });
                break;
            } catch (err) {
                if (err.code !== 11000) throw err;
            }
        }

        if (!order) {
            return res.status(500).json({ success: false, message: "Failed to generate unique order ID" });
        }

        res.status(201).json({
            success: true,
            data: order,
            message: "Order created successfully"
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user._id })
            .populate("game", "name imageUrl")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get order details
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("game", "name imageUrl")
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if user is owner or admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to view this order" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/admin/all
 * @access  Private/Admin
 */
export const adminGetOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { status, search } = req.query;

        const query = {};
        if (status) query.orderStatus = status;
        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { "userInputs.value": { $regex: search, $options: "i" } }
            ];
        }

        const orders = await Order.find(query)
            .populate("user", "name email")
            .populate("game", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update order status (Admin only)
 * @route   PATCH /api/orders/admin/:id
 * @access  Private/Admin
 */
export const adminUpdateOrder = async (req, res) => {
    try {
        const { orderStatus, paymentStatus, adminNote, completionProof } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const oldStatus = order.orderStatus;

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (adminNote) order.adminNote = adminNote;
        if (completionProof) order.completionProof = completionProof;

        // If status changed, add to tracking
        if (orderStatus && orderStatus !== oldStatus) {
            order.tracking.push({
                status: orderStatus,
                message: `Order status updated to ${orderStatus}` + (adminNote ? `: ${adminNote}` : ""),
            });
        }

        await order.save();

        // Log admin activity
        await logAdminActivity({
            req,
            action: "UPDATE",
            module: "ORDER",
            targetId: order._id,
            targetModel: "Order",
            description: `Updated order ${order.orderId} status from ${oldStatus} to ${orderStatus || oldStatus}`,
            changes: { oldStatus, newStatus: orderStatus || oldStatus }
        });

        res.status(200).json({ success: true, data: order, message: "Order updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
