import Blog from "../models/blog.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteImageFromCloudinary } from "../utils/deleteFromCloudinary.js";

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
    // Parse content from string if it comes as JSON string (common in FormData)
    let { title, slug, description, content, category, seo } = req.body;

    if (typeof content === "string") {
        try {
            content = JSON.parse(content);
        } catch (e) {
            // keep as is if parsing fails, might be handled by validation or is simpler structure
        }
    }

    if (typeof seo === "string") {
        try {
            seo = JSON.parse(seo);
        } catch (e) {
            // keep as is
        }
    }

    if (!req.file) {
        res.status(400);
        throw new Error("Cover image is required");
    }

    // Check slug uniqueness
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
        res.status(400);
        throw new Error("Blog with this slug already exists");
    }

    // Upload to Cloudinary
    const upload = await uploadBufferToCloudinary(req.file.buffer, "blogs");

    const blog = await Blog.create({
        title,
        slug,
        description,
        content,
        category,
        coverImage: upload.secure_url,
        coverImageId: upload.public_id,
        seo
    });

    res.status(201).json({
        success: true,
        data: blog,
    });
});

// @desc    Get all blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;

    const query = {};
    if (category) {
        query.category = category;
    }

    const count = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    res.status(200).json({
        success: true,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        data: blogs,
    });
});

// @desc    Get single blog by slug or ID
// @route   GET /api/blogs/:idOrSlug
// @access  Public
export const getSingleBlog = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;

    let blog = null;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        blog = await Blog.findById(idOrSlug).lean();
    }

    if (!blog) {
        blog = await Blog.findOne({ slug: idOrSlug }).lean();
    }

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    res.status(200).json({
        success: true,
        data: blog,
    });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    let { title, slug, description, content, category, seo } = req.body;

    // Handle JSON parsing for complex fields from FormData
    if (typeof content === "string") {
        try { content = JSON.parse(content); } catch (e) { }
    }
    if (typeof seo === "string") {
        try { seo = JSON.parse(seo); } catch (e) { }
    }

    // Handle Image Update
    if (req.file) {
        // Upload new image
        const upload = await uploadBufferToCloudinary(req.file.buffer, "blogs");

        // Delete old image
        if (blog.coverImageId) {
            await deleteImageFromCloudinary(blog.coverImageId);
        }

        blog.coverImage = upload.secure_url;
        blog.coverImageId = upload.public_id;
    }

    // Update fields if provided
    if (title) blog.title = title;
    if (slug) {
        // Check uniqueness if slug changed
        if (slug !== blog.slug) {
            const existingSlug = await Blog.findOne({ slug });
            if (existingSlug) {
                res.status(400);
                throw new Error("Slug is already taken");
            }
        }
        blog.slug = slug;
    }
    if (description !== undefined) blog.description = description;
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;
    if (seo !== undefined) blog.seo = seo;

    const updatedBlog = await blog.save();

    res.status(200).json({
        success: true,
        data: updatedBlog,
    });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Delete image from Cloudinary
    if (blog.coverImageId) {
        await deleteImageFromCloudinary(blog.coverImageId);
    }

    await blog.deleteOne();

    res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
    });
});