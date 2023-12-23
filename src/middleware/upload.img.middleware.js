
const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/upload'),
    filename: (req, file, cb) => {
        return cb(null, new Date().getTime() + path.extname(file.originalname))
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