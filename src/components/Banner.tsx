"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface BannerProps {
  content: {
    id: number;
    description: string;
    timeLeft: number;
    link: string;
  };
  onBannerUpdate: (updatedContent: { description: string }) => void;
}

export default function Banner({ content, onBannerUpdate }: BannerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    content.description
  );

  const handleUpdateDescription = async () => {
    setIsUpdating(true);
    try {
      await axios.patch(`/api/banner/${content.id}`, {
        description: editedDescription,
      });
      onBannerUpdate({ description: editedDescription });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating banner:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border-gray-500 bg-[#191919] border mt-10 text-white p-4 mb-4 rounded w-full max-w-md">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="text-black p-1 mr-2 w-full"
          />
          <div className="mt-2">
            <button
              onClick={handleUpdateDescription}
              className="bg-green-700 p-1 rounded"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-500 p-1 rounded ml-2"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>         
          <div className=" flex items-end justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-700 px-4 py-2 rounded-lg mr-2"
            >
              Edit
            </button>
          </div>
          <div className=" flex items-center p-10 justify-center">
            <p className=" text-lg font-bold">{content.description}</p>
          </div>
        </div>
      )}
      <div className=" flex items-center justify-between">
        <p className="mt-2">Time left: {content.timeLeft} seconds</p>
        <Link
          href={content.link}
          target="_blank"
          rel="noopener noreferrer"
          className="underline mt-2 inline-block"
        >
          Click here
        </Link>
      </div>
    </div>
  );
}
