"use client";

import { useState, useRef } from "react";
import { JobFilterValues } from "@/lib/validation";
import FormSubmitButton from "./FormSubmitButton";
import FormClearButton from "./FormClearButton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";

interface JobFilterFormProps {
  defaultValues: JobFilterValues;
  distinctLocations: string[];
  jobTypes: string[];
  filterJobs: (formData: FormData) => Promise<void>;
}

export default function JobFilterForm({
  defaultValues,
  distinctLocations,
  jobTypes,
  filterJobs,
}: JobFilterFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setFiltersApplied(true); // Show the "Clear" button after submitting
    await filterJobs(formData);
  };

  const handleClear = () => {
    formRef.current?.reset(); // Reset form fields
    setFiltersApplied(false); // Hide Clear button
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      key={JSON.stringify(defaultValues)}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            name="q"
            placeholder="Title, company, etc."
            defaultValue={defaultValues.q}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" defaultValue={defaultValues.type || ""}>
            <option value="">All types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Select
            id="location"
            name="location"
            defaultValue={defaultValues.location || ""}
          >
            <option value="">All locations</option>
            {distinctLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="remote"
            name="remote"
            type="checkbox"
            className="scale-125 accent-black"
            defaultChecked={defaultValues.remote}
          />
          <Label htmlFor="remote">Remote jobs</Label>
        </div>

        <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton>

        {/* Show Clear button only if filters have been applied */}
        {filtersApplied && <FormClearButton onClear={handleClear} />}
      </div>
    </form>
  );
}
