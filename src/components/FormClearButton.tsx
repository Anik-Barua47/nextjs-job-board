"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function FormClearButton({ onClear }: { onClear: () => void }) {
  const router = useRouter(); // Next.js client-side navigation

  const handleClear = () => {
    onClear(); // Reset form state in parent component
    router.push("/"); // Redirect to home page with no filters
  };

  return (
    <Button className="mt-2 w-full" variant="outline" onClick={handleClear}>
      Clear
    </Button>
  );
}
