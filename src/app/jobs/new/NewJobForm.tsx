"use client";

import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import LocationInput from "@/components/locationInput";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import H1 from "@/components/ui/h1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { jobTypes, locationTypes } from "@/lib/job-types";
import { CreateJobValues, createJobSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { draftToMarkdown } from "markdown-draft-js";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function NewJobForm() {
  const form = useForm<CreateJobValues>({
    resolver: zodResolver(createJobSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting, errors },
  } = form;

  // console.log(errors);

  const router = useRouter();

  // State to store and preview the uploaded image
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  async function onSubmit(values: CreateJobValues) {
    console.log(form.formState.errors);
    console.log("Form submitted", values);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const isValid = await trigger();
      if (!isValid) {
        console.log("Validation failed");
        return; // Prevent form submission if validation fails
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server Error:", errorData);
        throw new Error("Failed to submit the job posting");
      }

      const responseData = await res.json();
      console.log("Job created successfully:", responseData);

      // Redirect to the job-submitted page
      router.push("/job-submitted");
    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again.");
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setValue("companyLogo", data.imagePath); // Save image path in form
      } else {
        alert("Image upload failed.");
      }
    }
  }

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Find your perfect developer</H1>
        <p className="text-muted-foreground">
          Get your job posting seen by thousands of job seekers.
        </p>
      </div>
      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Job details</h2>
          <p className="text-muted-foreground">
            Provide a job description and details
          </p>
        </div>
        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. frontend-developer" {...field} />
                  </FormControl>
                  {errors.slug && (
                    <FormMessage>{errors.slug.message}</FormMessage>
                  )}
                </FormItem>
              )}
            /> */}

            {/* Job Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Frontend Developer"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  {errors.title && (
                    <FormMessage>{errors.title.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Job Type */}
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job type</FormLabel>
                  <FormControl>
                    <Select {...field} defaultValue="">
                      <option value="" hidden>
                        Select an option
                      </option>
                      {jobTypes.map((jobType) => (
                        <option key={jobType} value={jobType}>
                          {jobType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.type && (
                    <FormMessage>{errors.type.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Company Name */}
            <FormField
              control={control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  {errors.companyName && (
                    <FormMessage>{errors.companyName.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Company Logo Upload */}
            <FormField
              control={control}
              name="companyLogo"
              render={() => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  {errors.companyLogo && (
                    <FormMessage>{errors.companyLogo.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Location Type */}
            <FormField
              control={control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue=""
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.currentTarget.value === "Remote") {
                          trigger("location");
                        }
                      }}
                    >
                      <option value="" hidden>
                        Select an option
                      </option>
                      {locationTypes.map((locationType) => (
                        <option key={locationType} value={locationType}>
                          {locationType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.locationType && (
                    <FormMessage>{errors.locationType.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office location</FormLabel>
                  <FormControl>
                    <LocationInput
                      onLocationSelected={field.onChange}
                      ref={field.ref}
                    />
                  </FormControl>
                  {watch("location") && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setValue("location", "", { shouldValidate: true });
                        }}
                      >
                        <X size={20} />
                      </button>
                      <span className="text-sm">{watch("location")}</span>
                    </div>
                  )}
                  {errors.location && (
                    <FormMessage>{errors.location.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* How to apply */}
            <div className="space-y-2">
              <Label htmlFor="applicationEmail">How to apply</Label>
              <div className="flex justify-between">
                <FormField
                  control={control}
                  name="applicationEmail"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            id="applicationEmail"
                            placeholder="Email"
                            type="email"
                            {...field}
                            autoComplete="off"
                          />
                          <span className="mx-2">or</span>
                        </div>
                      </FormControl>
                      {errors.applicationEmail && (
                        <FormMessage>
                          {errors.applicationEmail.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicationUrl"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <Input
                          placeholder="Website"
                          type="url"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            trigger("applicationEmail");
                          }}
                          autoComplete="off"
                        />
                      </FormControl>
                      {errors.applicationUrl && (
                        <FormMessage>
                          {errors.applicationUrl.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Job Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label onClick={() => setFocus("description")}>
                    Description
                  </Label>
                  <FormControl>
                    <RichTextEditor
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                    />
                  </FormControl>
                  {errors.description && (
                    <FormMessage>{errors.description.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Salary */}
            <FormField
              control={control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  {errors.salary && (
                    <FormMessage>{errors.salary.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <LoadingButton type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
}
