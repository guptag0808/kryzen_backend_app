// backend/utils/generatePDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (formData, filePath) => {
  const doc = new PDFDocument();

  // Extract the directory path from the file path
  const dirPath = path.dirname(filePath);

  // Create the directory if it doesn't exist
  await fs.promises.mkdir(dirPath, { recursive: true });

  // Pipe the PDF content to a writable stream (file)
  const stream = fs.createWriteStream(filePath);

  // Handle stream errors
  stream.on('error', (error) => {
    console.error('Error writing PDF file:', error);
  });    

  // Pipe the PDF content to the stream
  doc.pipe(stream);

  // Add content to the PDF based on the formData
  doc.fontSize(16).text('Collected Data', { align: 'center' }).moveDown(0.5);

  Object.entries(formData).forEach(([key, value]) => {
    doc.fontSize(14).text(`${key}: ${value}`).moveDown(0.5);
  });

  // End the PDF document
  doc.end();

  return filePath;
};

module.exports = generatePDF;
