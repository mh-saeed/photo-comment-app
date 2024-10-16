import React, { useState } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
}

interface Photo {
  id: string;
  url: string;
  comments: Comment[];
}

const PhotoList: React.FC<{
  photos: Photo[];
  onAddComment: (photoId: string, content: string) => Promise<void>;
  onDeletePhoto: (photoId: string) => void;
  isDeleting: string | null;
}> = ({ photos, onAddComment, onDeletePhoto, isDeleting }) => {
  const [commentContent, setCommentContent] = useState<{
    [key: string]: string;
  }>({});
  const [isAddingComment, setIsAddingComment] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCommentSubmit = async (photoId: string) => {
    const content = commentContent[photoId];
    if (content) {
      setIsAddingComment({ ...isAddingComment, [photoId]: true });
      await onAddComment(photoId, content);
      setIsAddingComment({ ...isAddingComment, [photoId]: false });
      setCommentContent({ ...commentContent, [photoId]: "" });
    }
  };

  return (
    <div>
      {photos.map((photo) => (
        <div key={photo.id} className="mb-8 p-4 border rounded">
          <div className="flex justify-between items-center mb-4">
            <Image
              src={photo.url}
              alt="Uploaded photo"
              width={500}
              height={300}
              className="w-full max-w-md"
            />
            <button
              onClick={() => onDeletePhoto(photo.id)}
              className="px-4 py-2 bg-red-500 text-white rounded"
              disabled={isDeleting === photo.id}
            >
              {isDeleting === photo.id ? "Deleting..." : "Delete"}
            </button>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold">Comments:</h3>
            {photo.comments.map((comment) => (
              <p key={comment.id} className="mb-2">
                {comment.content}
              </p>
            ))}
          </div>
          <div>
            <textarea
              value={commentContent[photo.id] || ""}
              onChange={(e) =>
                setCommentContent({
                  ...commentContent,
                  [photo.id]: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              placeholder="Add a comment"
            />
            <button
              onClick={() => handleCommentSubmit(photo.id)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              disabled={isAddingComment[photo.id]}
            >
              {isAddingComment[photo.id] ? "Adding..." : "Add Comment"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
