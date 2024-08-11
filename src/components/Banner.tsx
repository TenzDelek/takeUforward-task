'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface BannerProps {
  content: {
    description: string
    timer: number
    link: string
  }
}

export default function Banner({ content }: BannerProps) {
  const [timeLeft, setTimeLeft] = useState(content.timer);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      removeBanner(content.description);
    }
  }, [timeLeft, content.description]);

  const removeBanner = async (id: string) => {
    try {
      const ans=await axios.delete(`/api/banner/${id}`);
      
      // Remove the banner from the UI
      // You can use a state management library like Redux or React Context to achieve this
    } catch (error) {
      console.error('Error removing banner:', error);
    }
  };

  return (
    <div className="bg-blue-500 text-white p-4 mb-4 rounded">
      <p>{content.description}</p>
      <p>Time left: {timeLeft} seconds</p>
      <a href={content.link} className="underline">Learn More</a>
    </div>
  );
}