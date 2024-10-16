"use client";

import React, { useState, useEffect } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoList from "@/components/PhotoList";

interface Comment {
  id: string;
  content: string;
}

interface Photo {
  id: string;
  url: string;
  comments: Comment[];
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/photos");
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
      // You can add a state to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);
      // You can add a state to show an error message to the user
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddComment = async (photoId: string, content: string) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, content }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const newComment = await response.json();

      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === photoId
            ? { ...photo, comments: [...photo.comments, newComment] }
            : photo
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      // You can add a state to show an error message to the user
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    setIsDeleting(photoId);
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }
      fetchPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
      // You can add a state to show an error message to the user
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Photo Upload and Comment App</h1>
      <PhotoUpload onUpload={handlePhotoUpload} />
      {isUploading && <p className="text-center">Uploading photo...</p>}
      {isLoading ? (
        <p className="text-center">Loading photos...</p>
      ) : (
        <PhotoList
          photos={photos}
          onAddComment={handleAddComment}
          onDeletePhoto={handleDeletePhoto}
          isDeleting={isDeleting}
        />
      )}
    </main>
  );
}
