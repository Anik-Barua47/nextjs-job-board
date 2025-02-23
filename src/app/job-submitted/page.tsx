"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import H1 from "@/components/ui/h1";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Show a notification message
    toast(
      "Your job posting has been submitted. Redirecting to the home page in 5 seconds...",
    );

    // Redirect to the home page after 5 seconds
    const delay = 5000; // Fixed delay of 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, delay);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="m-auto my-10 max-w-5xl space-y-5 px-3 text-center">
      <H1>Job submitted</H1>
      <p>Your job posting has been submitted and is pending approval.</p>
    </main>
  );
}
