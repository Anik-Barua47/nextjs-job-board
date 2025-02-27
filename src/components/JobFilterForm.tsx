"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isFormEmpty, setIsFormEmpty] = useState(true);

  const checkIfFormEmpty = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const q = formData.get("q")?.toString().trim();
    const type = formData.get("type")?.toString().trim();
    const location = formData.get("location")?.toString().trim();
    const remote = formData.get("remote") === "on";

    // Check if any filter is applied
    const isEmpty = !q && !type && !location && !remote;
    setIsFormEmpty(isEmpty);
  };

  useEffect(() => {
    const form = formRef.current;
    if (form) {
      // Add event listeners to check if form is empty whenever the user changes an input
      const checkForm = () => {
        checkIfFormEmpty();
      };

      form.addEventListener("input", checkForm);
      form.addEventListener("change", checkForm);

      // Recalculate form emptiness state after the form is reset (initial check)
      checkIfFormEmpty();

      return () => {
        form.removeEventListener("input", checkForm);
        form.removeEventListener("change", checkForm);
      };
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setFiltersApplied(true); // Show the "Clear" button after submitting
    await filterJobs(formData);
  };

  const handleClear = () => {
    if (formRef.current) {
      formRef.current.reset(); // Reset form fields
      setFiltersApplied(false); // Hide Clear button
      setIsFormEmpty(true); // Explicitly disable Filter button after clearing
    }
  };

  const handleInputChange = () => {
    // Check if the form is empty after any input change
    checkIfFormEmpty();
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
            onInput={handleInputChange} // Add input change handler here
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="type">Type</Label>
          <Select
            id="type"
            name="type"
            defaultValue={defaultValues.type || ""}
            onChange={handleInputChange} // Add input change handler here
          >
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
            onChange={handleInputChange} // Add input change handler here
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
            onChange={handleInputChange} // Add input change handler here
          />
          <Label htmlFor="remote">Remote jobs</Label>
        </div>

        <FormSubmitButton className="w-full" disabled={isFormEmpty}>
          Filter jobs
        </FormSubmitButton>

        {/* Show Clear button only if filters have been applied */}
        {filtersApplied && <FormClearButton onClear={handleClear} />}
      </div>
    </form>
  );
}
