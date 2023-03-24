require("dotenv").config();

const TournamentCategoryModel = require('../models/tournamentCategory');

// Create endpoint
exports.create = async (req, res) => {
    try {
        multer.uploadImage(req, res, async (error) => {

            if (error) {
                // console.log("error", error);
                return res.status(400).json({ "error": error });
            }
            else if (req.files === undefined) {
                // console.log("No such file selected");
                return res.status(500).json({
                    "status": 'fail',
                    "message": `Error: No File Selected`
                });
            }
            else {
                // If Success
                let fields = req.body

                let categoryFile = req.file;

                fields.file = categoryFile.location;

                const newCategory = new TournamentCategoryModel(
                    fields,
                );
                await newCategory.save();

                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    Testimony: newCategory
                });
            }

        })
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get all endpoint
exports.getAll = async (req, res) => {
    try {
        const category = await TournamentCategoryModel.find({});
        if (category.length === 0) {
            return res.status(400).json({ messgae: "No category found in Database!" });
        } else {
            return res.status(200).json({ category })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get tournament category by name
exports.gettournamentByName = async (req, res) => {
    try {
        const tournament = await TournamentCategoryModel.find({ tournamentCategoryName: req.params.tournamentCategoryName });
        if (tournament.error) {
            // console.log("error-log", error);
            return res.status(400).json({
                "message": error.message
            })
        }
        return res.status(200).json({
            tournament: tournament
        });
    } catch (err) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update Tournament Category
exports.update = async (req, res) => {
    try {
        multer.uploadImage(req, res, async (error) => {
            if (error) {
                console.log("error", error);
                return res.status(400).json({ "error": error });
            }
            else if (req.files === undefined) {
                console.log("No such file selected");
                return res.status(500).json({
                    "status": 'fail',
                    "message": `Error: No File Selected`
                });
            }
            else {

                const { id } = req.params;
                const category = await TournamentCategoryModel.findByIdAndUpdate(id);

                if (!category) {
                    return res.status(404).json({ message: "category Not Found" });
                } else if (category.error) {
                    // console.log("category-error:", category.error);
                    return res.status(400).json({ error: category.error.message });
                }

                // If Success
                let fields = req.body
                let categoryFile = req.file;
                fields.image = categoryFile.location;

                category.tournamentCategoryName = fields.tournamentCategoryName || category.tournamentCategoryName;
                category.image = fields.image || category.image;

                await category.save();

                // Save the file name into database
                return res.status(200).json({
                    message: 'updated successfully!',
                    category
                });
            }

        })
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
};



// Delete Specifi tournament By Id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await TournamentCategoryModel.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category Not Found" });
        } else if (category.error) {
            // console.log("category-error:", category.error);
            return res.status(400).json({ error: category.error.message });
        }
        return res.status(200).json({ message: "Category Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}