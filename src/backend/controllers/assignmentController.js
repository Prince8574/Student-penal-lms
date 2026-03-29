const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { generateCertificate, generateCertificateId } = require("../services/certificateService");
const mongoose = require('mongoose');

// Raw collection access — same collection admin writes to
const rawAssignments = () => mongoose.connection.db.collection('assignments');

/**
 * GET /api/assignments
 * Get all assignments (for old route compatibility)
 */
exports.getAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const assignments = await rawAssignments()
      .find({ isActive: { $ne: false } })
      .sort({ createdAt: -1 })
      .toArray();

    const submissions = await Submission.find({ student: studentId });
    const submissionMap = {};
    submissions.forEach(sub => { submissionMap[sub.assignment.toString()] = sub; });

    const enriched = assignments.map(a => ({
      ...a,
      id: a._id,
      submission: submissionMap[a._id.toString()] || null,
      status: submissionMap[a._id.toString()]?.status || 'pending',
      points: a.points || a.maxScore || 100,
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/assignments/:id
 * Get single assignment (for old route compatibility)
 */
exports.getAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const { ObjectId } = require('mongodb');

    const assignment = await rawAssignments().findOne({ _id: new ObjectId(id) });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const submission = await Submission.findOne({ assignment: id, student: studentId });

    res.json({
      success: true,
      data: {
        ...assignment,
        id: assignment._id,
        submission: submission || null,
        status: submission?.status || 'pending',
        points: assignment.points || assignment.maxScore || 100,
      }
    });
  } catch (err) {
    console.error("Error fetching assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/assignments
 * Get all assignments for student — fetches from admin's collection directly
 */
exports.getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch ALL active assignments from the shared collection (admin creates here)
    const assignments = await rawAssignments()
      .find({ isActive: { $ne: false } })
      .sort({ createdAt: -1 })
      .toArray();

    // Get this student's submissions
    const submissions = await Submission.find({ student: studentId });
    const submissionMap = {};
    submissions.forEach(sub => {
      submissionMap[sub.assignment.toString()] = sub;
    });

    // Enrich with submission status
    const enriched = assignments.map(a => ({
      ...a,
      id: a._id,
      submission: submissionMap[a._id.toString()] || null,
      status: submissionMap[a._id.toString()]?.status || 'pending',
      // Normalize fields admin may store differently
      points: a.points || a.maxScore || 100,
      dueDate: a.dueDate || '',
      description: a.description || a.desc || '',
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    console.error("Error fetching student assignments:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/student/assignments/:id/submit
 * Submit assignment
 */
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const { submissionText, submissionUrl, files } = req.body;
    const { ObjectId } = require('mongodb');

    // Check assignment exists in shared collection
    let assignmentId;
    try { assignmentId = new ObjectId(id); } catch { return res.status(400).json({ success: false, message: "Invalid assignment ID" }); }

    const assignment = await rawAssignments().findOne({ _id: assignmentId });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    // Check if already submitted
    let submission = await Submission.findOne({ assignment: id, student: studentId });

    if (submission && submission.status === 'graded') {
      return res.status(400).json({ success: false, message: "Assignment already graded. Cannot resubmit." });
    }

    const submissionData = {
      assignment:     id,
      student:        studentId,
      // Store denormalized fields for admin grading view
      assignmentTitle: assignment.title || 'Untitled',
      courseName:      assignment.courseName || assignment.course || '',
      status:          "submitted",
      submittedAt:     new Date(),
      submissionText:  submissionText || "",
      submissionUrl:   submissionUrl  || "",
      files:           files || [],
    };

    if (submission) {
      Object.assign(submission, submissionData);
      await submission.save();
    } else {
      submission = await Submission.create(submissionData);
    }

    res.json({ success: true, message: "Assignment submitted successfully", data: submission });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/assignments/:id/grade
 * Grade student assignment and generate certificate
 */
exports.gradeAssignment = async (req, res) => {
  try {
    const { id } = req.params; // submission ID
    const { score, feedback, maxScore } = req.body;

    // Get submission
    const submission = await Submission.findById(id).populate('assignment student');
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const student = submission.student;
    const assignment = submission.assignment;
    const finalMaxScore = maxScore || assignment.points || 100;

    // Generate certificate
    const certificateId = generateCertificateId();
    const certificatePath = await generateCertificate({
      studentName: student.name,
      courseName: assignment.courseName,
      assignmentTitle: assignment.title,
      score: Number(score),
      maxScore: finalMaxScore,
      completionDate: new Date(),
      certificateId
    });

    // Update submission with grade and certificate
    submission.grade = Number(score);
    submission.maxScore = finalMaxScore;
    submission.feedback = feedback || "";
    submission.status = "graded";
    submission.gradedAt = new Date();
    submission.certificateId = certificateId;
    submission.certificatePath = certificatePath;
    
    await submission.save();

    // Update student's grades array (if not exists, create it)
    if (!student.grades) {
      student.grades = [];
    }
    
    student.grades.push({
      assignmentId: assignment._id,
      assignmentTitle: assignment.title,
      courseName: assignment.courseName,
      score: Number(score),
      maxScore: finalMaxScore,
      percentage: ((Number(score) / finalMaxScore) * 100).toFixed(2),
      certificateId,
      certificatePath,
      gradedAt: new Date()
    });
    
    await student.save();

    res.json({ 
      success: true, 
      message: "Assignment graded and certificate generated successfully",
      data: submission 
    });
  } catch (err) {
    console.error("Error grading assignment:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/grades
 * Get all grades and certificates for student
 */
exports.getStudentGrades = async (req, res) => {
  try {
    const studentId = req.user.id;

    const submissions = await Submission.find({
      student: studentId,
      status: "graded"
    }).sort({ gradedAt: -1 });

    // Use denormalized fields stored at submission time
    const grades = submissions.map(sub => ({
      _id:             sub._id,
      assignmentTitle: sub.assignmentTitle || 'Assignment',
      courseName:      sub.courseName      || '',
      score:           sub.score ?? sub.grade,
      maxScore:        sub.maxScore || 100,
      feedback:        sub.feedback,
      certificateId:   sub.certificateId,
      certificatePath: sub.certificatePath,
      gradedAt:        sub.gradedAt,
      submittedAt:     sub.submittedAt,
    }));

    res.json({ success: true, data: grades });
  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/certificates/:certificateId
 * Download certificate PDF
 */
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const path = require('path');
    const fs = require('fs');

    const filepath = path.join(__dirname, '../certificates', `certificate_${certificateId}.pdf`);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.download(filepath, `Certificate_${certificateId}.pdf`);
  } catch (err) {
    console.error("Error downloading certificate:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = exports;

/**
 * POST /api/assignments
 * Instructor creates assignment (stored in shared 'assignments' collection)
 */
exports.createAssignment = async (req, res) => {
  try {
    const doc = {
      ...req.body,
      dueDate:   req.body.dueDate ? new Date(req.body.dueDate) : null,
      maxScore:  Number(req.body.maxScore) || 100,
      isActive:  true,
      createdBy: req.user.id.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await rawAssignments().insertOne(doc);
    res.status(201).json({ success: true, data: { ...doc, _id: result.insertedId } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/assignments/:id
 * Instructor updates their assignment
 */
exports.updateAssignment = async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const update = { ...req.body, updatedAt: new Date() };
    if (update.dueDate) update.dueDate = new Date(update.dueDate);
    delete update._id;

    const result = await rawAssignments().findOneAndUpdate(
      { _id: new ObjectId(req.params.id), createdBy: req.user.id.toString() },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ success: false, message: 'Not found or not authorized' });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/assignments/:id
 * Instructor soft-deletes their assignment
 */
exports.deleteAssignment = async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    await rawAssignments().updateOne(
      { _id: new ObjectId(req.params.id), createdBy: req.user.id.toString() },
      { $set: { isActive: false, updatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
