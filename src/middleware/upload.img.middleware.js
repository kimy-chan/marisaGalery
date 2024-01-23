
const multer = require("multer")
const path = require("path")
const uuid = require("uuid")
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/upload'),
    filename: (req, file, cb) => {
        const uniqueFilename = new Date().getTime() + '_' + uuid.v4() + path.extname(file.originalname);
        return cb(null, uniqueFilename)
    }
})


const upload = multer({
    storage: storage,

    dest: path.join(__dirname, '../public/upload'),
    fileFilter: (req, file, cb) => {
        const extensions = path.extname(file.originalname)
        if (extensions === '.png' || extensions === '.jpg' || extensions === '.jpeg' || extensions === '.JPG' || extensions === '.PNG') {
            return cb(null, true)
        }
        req.fileError = "archivo invalido"
        return cb(null, false);
    }



})


module.exports = upload