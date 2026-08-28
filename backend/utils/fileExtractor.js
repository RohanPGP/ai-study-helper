const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

/**
 * Extract plain text from uploaded file
 * Supports: PDF, DOCX, TXT
 */
async function extractText(filePath, mimeType) {
  const ext = filePath.split('.').pop().toLowerCase();

  try {
    if (mimeType === 'application/pdf' || ext === 'pdf') {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return { text: data.text, fileType: 'pdf' };
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return { text: result.value, fileType: 'docx' };
    }

    if (mimeType === 'text/plain' || ext === 'txt') {
      const text = fs.readFileSync(filePath, 'utf8');
      return { text, fileType: 'txt' };
    }

    throw new Error(`Unsupported file type: ${mimeType || ext}`);
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(filePath); } catch (_) {}
  }
}

module.exports = { extractText };
