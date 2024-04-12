const QRCode = require("qrcode");
 
 async function generateQRCode(text:string) {
  try {
    const qrCodeBuffer = await QRCode.toDataURL(text);
    return qrCodeBuffer;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}