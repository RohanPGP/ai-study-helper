const { createWorker } = require('tesseract.js');

async function extractTextFromImages(imagePaths) {
  const worker = await createWorker('eng');
  let fullText = '';
  for (const imgPath of imagePaths) {
    const { data: { text } } = await worker.recognize(imgPath);
    fullText += text + '\n\n';
  }
  await worker.terminate();
  return fullText;
}

module.exports = { extractTextFromImages };
