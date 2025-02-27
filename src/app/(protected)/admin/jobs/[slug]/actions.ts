"use server";

import prisma from "@/lib/prisma";
// import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { UserRole } from "@prisma/client";
import { currentRole } from "@/lib/auth";

// Define the FormState type
type FormState = { error?: string } | undefined;

export async function approveSubmission(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const jobId = formData.get("jobId") as string; // Ensure jobId is treated as a string

    const role = await currentRole();
    console.log(role);

    if (!role || !UserRole.ADMIN) {
      throw new Error("Not authorized");
    }

    await prisma.job.update({
      where: { id: jobId }, // Use jobId as a string
      data: { approved: true },
    });

    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteJob(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    console.log("Starting deleteJob function"); // Debugging
    const jobId = formData.get("jobId") as string;
    console.log("Job ID:", jobId); // Debugging

    const role = await currentRole();
    console.log("User Role:", role); // Debugging

    if (role !== UserRole.ADMIN) {
      throw new Error("Not authorized");
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    console.log("Job found:", job); // Debugging

    if (job?.companyLogoUrl) {
      const filePath = path.resolve("public/uploads", job.companyLogoUrl);
      console.log("File path:", filePath); // Debugging

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted:", filePath); // Debugging
      }
    }

    await prisma.job.delete({
      where: { id: jobId },
    });
    console.log("Job deleted:", jobId); // Debugging

    revalidatePath("/admin");
    redirect("/admin"); // This will throw a NEXT_REDIRECT error
  } catch (error) {
    // Only handle errors that are NOT NEXT_REDIRECT
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("Error in deleteJob:", error);
      let message = "Unexpected error";
      if (error instanceof Error) {
        message = error.message;
      }
      return { error: message };
    }
    // Re-throw the NEXT_REDIRECT error to ensure redirection happens
    throw error;
  }
}
