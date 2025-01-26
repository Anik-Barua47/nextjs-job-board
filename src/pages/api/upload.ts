import multer from "multer";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/runMiddleware"; // Helper to run middleware in Next.js

// Configure Multer to store files in the "public/images" folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), "public/images");
        cb(null, uploadDir); // Save files to "public/images"
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Custom filename
    },
});

const upload = multer({ storage });

// Middleware to handle the file upload
export const config = {
    api: {
        bodyParser: false, // Disable Next.js default body parser
    },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            // Use Multer middleware to process the uploaded file
            await runMiddleware(req, res, upload.single("file"));

            // File is stored in "req.file"
            const filePath = `/images/${req.file.filename}`; // Public path to the file
            return res.status(200).json({ imagePath: filePath });
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ error: "File upload failed" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

export default handler;
