// app/admin/page.js (or wherever your server component is located)

import prisma from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";

const AdminPage = async () => {
  const unapprovedJobs = await prisma.job.findMany({
    where: { approved: false },
  });

  return <AdminDashboard unapprovedJobs={unapprovedJobs} />;
};

export default AdminPage;
