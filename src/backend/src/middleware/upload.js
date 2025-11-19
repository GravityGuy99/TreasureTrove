import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

//here is a source I used for figuring out multer
//https://www.npmjs.com/package/multer

// needed to resolve directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Store files in /uploads folder
const storage = multer.diskStorage({
    //sends the image to the uploads folder
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"))
    },
    //handles the name of the file
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

export const upload = multer({ storage })
