const multer = require('multer');
const fs = require('fs');
const path = require('path');
const File = require('./model');

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const fileController = {};

fileController.uploadFile = [
    upload.single('file'),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        try {
            const file = new File({
                filename: req.file.filename,
                size: req.file.size
            });
            await file.save();
            res.status(200).send({ filename: req.file.filename });
        } catch (err) {
            res.status(500).send('Error saving file metadata.');
        }
    }
];

fileController.getFileData = (req, res) => {
    const filename = req.query.filename;

    if (!filename) {
        return res.status(400).send('Filename query parameter is required.');
    }

    const filePath = path.join(__dirname, '../../../uploads/', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }
        res.status(200).send(data);
    });
};

module.exports = fileController;
