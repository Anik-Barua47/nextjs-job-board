// components/AdminDashboard.js

"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import JobListItem from "@/components/JobListItem";
import Link from "next/link";
import { Job } from "@prisma/client"; // Import Job type from Prisma

interface AdminDashboardProps {
  unapprovedJobs: Job[];
}

const AdminDashboard = ({ unapprovedJobs }: AdminDashboardProps) => {
  const role = useCurrentRole();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is not an ADMIN
    if (role !== "ADMIN") {
      router.push("/auth/login"); // Redirect to login page
    }
  }, [role, router]);

  if (role !== "ADMIN") {
    return null; // or a message like "Redirecting to login..."
  }

  return (
    <div className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <h1 className="text-center text-2xl font-bold">Admin Dashboard</h1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Unapproved jobs:</h2>
        {unapprovedJobs.map((job) => (
          <Link key={job.id} href={`/admin/jobs/${job.slug}`} className="block">
            <JobListItem job={job} />
          </Link>
        ))}
        {unapprovedJobs.length === 0 && (
          <p className="text-muted-foreground">No unapproved jobs</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
