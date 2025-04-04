const Billing = require('../models/billing.model');
const Fund = require('../models/fund.model');
const Student = require('../models/student.model');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Function to generate bill PDF
const generateBillPDF = async (billing, student) => {
  const doc = new PDFDocument();
  const fileName = `bill-${student.universityRollNo}-${Date.now()}.pdf`;
  const filePath = path.join('public', 'bills', fileName);

  doc.pipe(fs.createWriteStream(filePath));

  // Bill layout
  doc.fontSize(18).text('Phase Shift - Technical Fest Bill', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`College: Techno Main Salt Lake`);
  doc.text(`Department: Electrical Engineering`);
  doc.text(`Fest: Phase Shift`);
  doc.text(`Date: ${new Date(billing.paymentDate).toLocaleDateString()}`);
  doc.moveDown();

  doc.text(`Student Name: ${student.name}`);
  doc.text(`University Roll No: ${student.universityRollNo}`);
  doc.text(`Year: ${student.year}`);
  doc.text(`Section: ${student.section}`);
  doc.moveDown();

  doc.text(`Food Coupon: ${billing.foodCoupon ? 'Yes' : 'No'}`);
  doc.text(`Payment Mode: ${billing.paymentMode}`);
  doc.text(`Transaction ID: ${billing.transactionId || 'N/A'}`);
  doc.text(`Amount Paid: ₹${billing.amount}`);
  doc.end();

  return filePath;
};

// Email bill to student
const sendBillEmail = async (email, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'souviksardar103@gmail.com', // replace
      pass: 'hduy zxmf jnxl guwl',     // replace
    },
  });

  const mailOptions = {
    from: '"Phase Shift Billing" <yourgmail@gmail.com>',
    to: email,
    subject: 'Your Bill for Phase Shift Fest 🎉',
    text: `Hello!

Thank you for registering for the Phase Shift Fest.

🗓 Dates: 12th - 13th April 2025  
📍 Location: Techno Main Salt Lake  
📚 Events: Circuit Making, Robotics, Project Expo, Gaming, and more!

Please find your bill attached.

See you at the fest! 🚀`,
    attachments: [
      {
        filename: path.basename(pdfPath),
        path: pdfPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

// Billing Controller
exports.billStudent = async (req, res) => {
    try {
      const {
        studentId,
        paymentMode,
        transactionId,
        foodCoupon,
        phone,
        email
      } = req.body;
  
      // 🔍 Log studentId received from request
      console.log("Received studentId:", studentId);
  
      const screenshot = req.file ? req.file.path : '';
  
      const student = await Student.findById(studentId);
  
      if (!student) {
        console.log("Student not found in DB for ID:", studentId); // Additional debug log
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const amount = foodCoupon === 'true' ? 300 : 150;
  
      const billing = new Billing({
        student: student._id,
        paymentMode,
        transactionId,
        screenshot,
        foodCoupon: foodCoupon === 'true',
        amount,
        phone,
        email,
      });
  
      await billing.save();
  
      // Update fund
      let fund = await Fund.findOne();
      if (!fund) {
        fund = new Fund({ totalFund: amount });
      } else {
        fund.totalFund += amount;
      }
      await fund.save();
  
      // Generate and send PDF
      const pdfPath = await generateBillPDF(billing, student);
      await sendBillEmail(email, pdfPath);
  
      res.status(201).json({ message: 'Billing successful, email sent 🎉' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Billing failed' });
    }
  };
  