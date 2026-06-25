const multer = require('multer');

// define storage engine
const storage = multer.memoryStorage();

// configure upload middleware
const upload = multer({ storage });

module.exports = upload;