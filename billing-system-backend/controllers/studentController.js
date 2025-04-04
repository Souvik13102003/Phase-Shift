const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');

// @desc    Get all billing history
// @route   GET /api/billing-history
// @access  Private/Admin
const getAllBillingHistory = asyncHandler(async (req, res) => {
  const students = await Student.find({}, 'name email phone billingHistory');

  const billingData = [];

  students.forEach((student) => {
    student.billingHistory.forEach((bill) => {
      billingData.push({
        name: student.name,
        email: student.email,
        phone: student.phone,
        ...bill.toObject()
      });
    });
  });

  res.json(billingData);
});

module.exports = {
  getAllStudents,
  getAllBillingHistory
};
