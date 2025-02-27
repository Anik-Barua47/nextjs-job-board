"use client";

import { Upload } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";

const UploadImage = ({ onUpload }: { onUpload: (url: string) => void }) => {
  return (
    <>
      <CldUploadWidget
        uploadPreset="tu5jdthj"
        onSuccess={(result) => {
          const info = result.info as { secure_url: string };
          onUpload(info.secure_url); // Send URL back to the parent
        }}
      >
        {({ open }) => (
          <button
            type="button"
            className="rounded-md border px-2.5 py-2 text-left text-sm"
            onClick={() => open()}
          >
            <div className="flex items-center gap-2">
              <Upload /> Upload Logo
            </div>
          </button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default UploadImage;
