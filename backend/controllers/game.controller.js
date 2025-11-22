import Game from "../models/game.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import slugify from "slugify";

const getGames = asyncHandler(async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @desc    Create a new game
// @route   POST /api/games
// @access  Admin
const createGame = asyncHandler(async (req, res) => {
    const { name, description, requiredFields } = req.body;

    // Validation: name required
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Game name is required",
        });
    }

    // Create slug
    const slug = slugify(name, { lower: true, strict: true });

    // Check duplicate
    const existing = await Game.findOne({ slug });
    if (existing) {
        return res.status(409).json({
            success: false,
            message: "Game already exists",
        });
    }

    // Validate requiredFields if passed
    if (requiredFields && !Array.isArray(requiredFields)) {
        return res.status(400).json({
            success: false,
            message: "requiredFields must be an array",
        });
    }

    const newGame = await Game.create({
        name,
        slug,
        image,
        description,
        requiredFields: requiredFields || [],
    });

    return res.status(201).json({
        success: true,
        message: "Game created successfully",
        data: newGame,
    });
});

const updateGame = asyncHandler(async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const deleteGame = asyncHandler(async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export {
    getGames,
    createGame,
    updateGame,
    deleteGame,
};