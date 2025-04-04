// routes/student.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/MulterExcel");
const { protect } = require("../middlewares/auth.middleware");

const {
  uploadStudentsFromExcel,
  getAllStudents,
  addStudentManually,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");

// @route   POST /api/students/upload-excel
// @desc    Upload students from Excel
router.post(
  "/upload-excel",
  protect,
  upload.single("file"),
  uploadStudentsFromExcel
);

// @route   GET /api/students/
// @desc    Get all students
router.get("/", protect, getAllStudents);

// @route   POST /api/students/manual
// @desc    Manually add a student
router.post("/manual", protect, addStudentManually);

// @route   PUT /api/students/:id
// @desc    Update a student
router.put("/:id", protect, updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete a student
router.delete("/:id", protect, deleteStudent);

module.exports = router;
