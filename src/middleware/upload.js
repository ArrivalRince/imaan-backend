import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const name = Date.now() + ext;
		cb(null, name);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype && (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf")) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;

