const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { protect } = require("../middleware/auth");

// Static routes MUST come before dynamic /:id routes
router.get("/grades", protect, assignmentController.getStudentGrades);
router.get("/certificates/:certificateId", protect, assignmentController.downloadCertificate);

// Dynamic routes
router.get("/", protect, assignmentController.getStudentAssignments);
router.post("/:id/submit", protect, assignmentController.submitAssignment);

module.exports = router;
