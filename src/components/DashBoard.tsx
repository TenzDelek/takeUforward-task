'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import Banner from "../components/Banner";

export default function Home() {
  const [input, setInput] = useState({
    description: '',
    timer: '',
    link: ''
  });
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  const callApi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await axios.post("/api/banner", input);
      setResponse(res.data);
      setBannerVisible(true);
    } catch (error) {
      console.error("Error calling API:", error);
      setResponse({ error: "An error occurred while processing your request." });
    } finally {
      setIsLoading(false);
      setInput({ description: '', timer: '', link: '' });
    }
  };

  const handleBannerRemove = () => {
    setBannerVisible(false);
    setResponse(null);
  };
  interface ApiResponse {
    data?: any;
    error?: string;
  }
  
  const handleBannerUpdate = (updatedContent: { description: string }) => {
    setResponse((prevResponse : ApiResponse ) => ({
      ...prevResponse,
      data: {
        ...prevResponse.data,
        ...updatedContent
      }
    }));
  };

  return (
    <main className="flex items-center justify-center min-h-screen w-full flex-col p-4">
      <div className="w-full max-w-md">
        <form onSubmit={callApi} className="flex flex-col space-y-2">
          <input
            className="outline-none border p-2 text-black"
            value={input.description}
            onChange={(e) => setInput({ ...input, description: e.target.value })}
            placeholder="Enter title"
          />
          <input
            type="number"
            className="outline-none border p-2 text-black"
            value={input.timer}
            onChange={(e) => setInput({ ...input, timer: e.target.value })}
            placeholder="Enter timer"
          />
          <input
            className="outline-none border p-2 text-black"
            value={input.link}
            onChange={(e) => setInput({ ...input, link: e.target.value })}
            placeholder="Enter link"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      {bannerVisible && response && response.data && (
        <Banner 
          content={response.data} 
          onBannerRemove={handleBannerRemove} 
          onBannerUpdate={handleBannerUpdate}
        />
      )}
      {response && response.data && (
        <div className="mt-4 p-4 border rounded w-full max-w-md">
          <h2 className="font-bold">Response:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      )}
      {response && response.error && (
        <div className="mt-4 p-4 border rounded w-full max-w-md">
          <h2 className="font-bold">Error:</h2>
          <p>{response.error}</p>
        </div>
      )}
    </main>
  );
}