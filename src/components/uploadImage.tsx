"use client";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

const UploadImage = () => {
  const [publicId, setPublicId] = useState("");
  return (
    <>
      {publicId && (
        <CldImage src={publicId} alt={publicId} width={"300"} height={"300"} />
      )}
      <CldUploadWidget
        uploadPreset="tu5jdthj"
        onSuccess={({ event, info }) => {
          console.log(event, info);
          if (event === "success") {
            if (typeof info !== "string" && info?.public_id) {
              setPublicId(info.public_id);
            }
          }
        }}
      >
        {({ open }) => (
          <button
            className="rounded-lg bg-zinc-700 p-4 text-white"
            onClick={() => open()}
          >
            Upload
          </button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default UploadImage;
