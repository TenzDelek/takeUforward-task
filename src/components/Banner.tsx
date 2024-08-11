'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface BannerProps {
  content: {
    id: number
    description: string
    timer: number
    link: string
  }
  onBannerRemove: () => void
  onBannerUpdate: (updatedContent: { description: string }) => void
}

export default function Banner({ content, onBannerRemove, onBannerUpdate }: BannerProps) {
  const [timeLeft, setTimeLeft] = useState(content.timer);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedDescription, setEditedDescription] = useState(content.description);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      removeBanner(content.id);
    }
  }, [timeLeft, content.id]);

  const removeBanner = async (id: number) => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/banner/${id}`);
      onBannerRemove();
    } catch (error) {
      console.error('Error removing banner:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateDescription = async () => {
    setIsUpdating(true);
    try {
      await axios.patch(`/api/banner/${content.id}`, { description: editedDescription });
      onBannerUpdate({ description: editedDescription });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating banner:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isDeleting) {
    return <div className="bg-yellow-500 text-white p-4 mb-4 rounded">Removing banner...</div>;
  }

  return (
    <div className="bg-blue-500 text-white p-4 mb-4 rounded w-full max-w-md">
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
              className="bg-green-500 p-1 rounded"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save'}
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
        <p>{content.description} <button onClick={() => setIsEditing(true)} className="bg-yellow-500 p-1 rounded ml-2">Edit</button></p>
      )}
      <p>Time left: {timeLeft} seconds</p>
      <a href={content.link} className="underline">Learn More</a>
    </div>
  );
}