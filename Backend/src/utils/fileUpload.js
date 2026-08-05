// Backend/src/utils/fileUpload.js
const fs = require('fs');
const path = require('path');

/**
 * Save a base64 encoded image to the uploads directory.
 * Returns the public relative file URL path (e.g., /uploads/profile_12345.png).
 * If the input is already a file path/URL or invalid, returns it unchanged.
 */
function saveBase64Image(base64Data, folder = 'profile', identifier = 'user') {
    if (!base64Data || typeof base64Data !== 'string') {
        return base64Data;
    }

    // If it's already a relative URL or path, return as is
    if (!base64Data.startsWith('data:image/')) {
        return base64Data;
    }

    try {
        const matches = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return base64Data;
        }

        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const dataBuffer = Buffer.from(matches[2], 'base64');
        const cleanId = String(identifier).replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${cleanId}_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${ext}`;

        const uploadDir = path.join(__dirname, '../../uploads', folder);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, dataBuffer);

        return `/uploads/${folder}/${filename}`;
    } catch (err) {
        console.error('Error saving base64 image:', err);
        return base64Data;
    }
}

module.exports = {
    saveBase64Image
};
