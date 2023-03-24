require("dotenv").config();

const ReportedProblemsModel = require('../models/reportedProblems');

const timeline = require('../utils/timestamp');
const upload = require('../utils/multer');

// Create endpoint
exports.report = async (req, res) => {
    try {

        upload.uploadDocs(req, res, async (error) => {
            // console.log("fields", req.body);
            // console.log('file', req.file);
            if (error) {
                console.log("error", error);
                return res.status(400).json({ "error": error });
            }
            else if (req.file === undefined) {
                console.log("No such file selected");
                return res.status(500).json({
                    "status": 'fail',
                    "message": `Error: No File Selected`
                });
            }
            else {
                // If Success
                let fields = req.body
                // console.log("bannerFields:", fields);
                let docFile = req.file;
                // let fileLocation;
                // let images = [];
                fields.attachment = docFile.location;
                // for (let i = 0; i < bannerFileArray.length; i++) {
                //     fileLocation = bannerFileArray[i].location;
                //     // console.log('filename:', fileLocation);
                //     images.push(fileLocation)
                // }
                const newProblemReported = new ReportedProblemsModel(
                    fields,
                    // fields.banner_image = images
                );
                await newProblemReported.save();
                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    problemReported: newProblemReported
                });
            }
        });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get all endpoint
exports.getAll = async (req, res) => {
    try {
        const problems = await ReportedProblemsModel.find({});
        if (problems.length === 0) {
            return res.status(400).json({ messgae: "No problems found in Database!" });
        } else {
            return res.status(200).json({ problems })
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get reported problems by name
exports.getReportProbByName = async (req, res) => {
    try {
        const reportedProblem = await ReportedProblemsModel.findOne({ contactName: req.params.name });
        if (!reportedProblem) {
            return res.status(400).json({ message: "no reportedProblems found!" })
        } else if (reportedProblem.error) {
            // console.log("game-error:", reportedProblems.error);
            return res.status(400).json({ error: reportedProblem.error.message });
        } else {
            return res.status(200).json({ reportedProblem });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// get reported problems by email
exports.getReportProbByEmail = async (req, res) => {
    try {
        const reportedProblem = await ReportedProblemsModel.findOne({ email: req.params.email });
        if (!reportedProblem) {
            return res.status(400).json({ message: "no reportedProblems found!" })
        } else if (reportedProblem.error) {
            // console.log("game-error:", reportedProblems.error);
            return res.status(400).json({ error: reportedProblem.error.message });
        } else {
            return res.status(200).json({ reportedProblem });
        }
    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Update Reported Problems
exports.update = async (req, res) => {
    try {
        const { id } = req.body;
        const { reportedPlayer, email, typeOfIssue, attachment, contactName, status, message } = req.body;
        const date_time = timeline.timestamp();

        const problemReported = await ReportedProblemsModel.findByIdAndUpdate(id);

        if (!problemReported) {
            return res.status(404).json({ message: "Not Found" });
        } else if (problemReported.error) {
            // console.log("problemReported-error:", problemReported.error);
            return res.status(400).json({ error: problemReported.error.message });
        }

        problemReported.reportedPlayer = reportedPlayer || problemReported.reportedPlayer;
        problemReported.email = email || problemReported.email;
        problemReported.typeOfIssue = typeOfIssue || problemReported.typeOfIssue;
        problemReported.attachment = attachment || problemReported.attachment;
        problemReported.contactName = contactName || problemReported.contactName;
        problemReported.status = status || problemReported.status;
        problemReported.message = message || problemReported.message;
        problemReported.updatedAt = date_time;

        await problemReported.save();

        return res.status(200).json({ message: "updated", problemReported });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}

// Delete Specific reported Problem By Id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await ReportedProblemsModel.findByIdAndDelete(id);
        if (!problem) {
            return res.status(404).json({ message: "Not Found" });
        } else if (problem.error) {
            // console.log("problem-error:", problem.error);
            return res.status(400).json({ error: problem.error.message });
        }
        return res.status(200).json({ message: "Deleted Successfully!" });

    } catch (error) {
        // console.log("error:", error);
        return res.status(500).json({ error: error.message });
    }
}