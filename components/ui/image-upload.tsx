"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [success, setSuccess] = useState<string | null>(null); // State for success messages

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null); // Reset error state before upload
    setSuccess(null); // Reset success state before upload

    try {
      const fileName = `${uuidv4()}-${file.name}`;
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      };

      await s3.send(new PutObjectCommand(params));
      const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
      onChange(fileUrl);
      setSuccess("File uploaded successfully!"); // Set success message
    } catch (error) {
      console.error("Error uploading to S3:", error);
      setError("Failed to upload the file. Please try again."); // Set error message for the user
    } finally {
      setLoading(false);
    }
  };

  const renderMedia = (url: string) => {
    const isVideo = url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.avi');

    if (isVideo) {
      return (
        <video autoPlay preload="true" controls className="w-full h-full object-cover">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <Image fill className="object-cover" alt="Image" src={url} />;
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"icon"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {renderMedia(url)}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      {success && <p className="text-green-500">{success}</p>} {/* Display success message */}

      <Button type="button" disabled={disabled || loading} variant="secondary" className="p-6 flex items-center justify-center">
        <label className="flex items-center">
          <ImagePlus className="h-4 w-4 mr-2" />
          Upload a File
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={disabled || loading}
            accept="image/*,video/*" // Allow images and videos
          />
        </label>
      </Button>
    </div>
  );
};

export default ImageUpload;
