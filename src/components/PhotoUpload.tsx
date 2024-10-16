import React, { useState, useRef } from "react";

const PhotoUpload: React.FC<{ onUpload: (file: File) => void }> = ({
  onUpload,
}) => {
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select an image file");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    onUpload(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="w-full p-2 border rounded"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload
      </button>
    </form>
  );
};

export default PhotoUpload;
