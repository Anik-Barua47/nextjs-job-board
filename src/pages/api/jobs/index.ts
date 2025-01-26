import prisma from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            console.log("Incoming request body:", req.body);

            const {
                title,
                type,
                locationType,
                location,
                description,
                salary,
                companyName,
                applicationEmail,
                applicationUrl,
                companyLogo, // Get the uploaded logo path
            } = req.body;

            // Validate all required fields
            if (!title || !type || !salary || !companyName) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const slug = `${toSlug(title)}-${nanoid(10)}`;

            const job = await prisma.job.create({
                data: {
                    title,
                    slug,
                    type,
                    locationType,
                    location,
                    description,
                    salary: parseInt(salary, 10), // Ensure salary is an integer
                    companyName,
                    applicationEmail,
                    applicationUrl,
                    companyLogoUrl: companyLogo, // Map "companyLogo" to "companyLogoUrl"
                },
            });

            console.log("Job created successfully:", job);
            res.status(201).json({ message: "Job created successfully", job });
        } catch (error) {
            console.error("Error creating job:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
