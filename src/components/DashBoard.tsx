'use client'

import { useState } from "react";
import axios from "axios";
import Banner from "../components/Banner";
interface ApiResponse {
  data?: any;
  error?: string;
}
export default function DashBoard() {
  
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
      setResponse({ error: "API call is failed man" });
    } finally {
      setIsLoading(false);
      setInput({ description: '', timer: '', link: '' });
    }
  };

  const handleBannerRemove = () => {
    setBannerVisible(false);
    setResponse(null);
  };
  
  
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
    <main className=" flex h-screen w-full items-center max-md:flex-col justify-center">
      <div className="md:flex-1 pt-10  h-full flex-col flex items-center justify-center ">
        <p className=" font-bold mb-5">TAKEUFORWARD TASK</p>
        <form onSubmit={callApi} className="flex flex-col space-y-2">
          <input
            className="outline-none rounded-md border p-2 text-black"
            value={input.description}
            onChange={(e) => setInput({ ...input, description: e.target.value })}
            placeholder="Enter Description"
          />
          <input
            type="number"
            className="outline-none border rounded-md p-2 text-black"
            value={input.timer}
            onChange={(e) => setInput({ ...input, timer: e.target.value })}
            placeholder="Enter timer"
          />
          <input
            className="outline-none border rounded-md p-2 text-black"
            value={input.link}
            onChange={(e) => setInput({ ...input, link: e.target.value })}
            placeholder="Enter link"
          />
          <button type="submit" className="p-2 bg-green-500 text-white rounded" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      <div className=" md:flex-1  h-full flex-col flex items-center justify-center ">
      {bannerVisible && response && response.data && (
        <Banner 
          content={response.data} 
          onBannerRemove={handleBannerRemove} 
          onBannerUpdate={handleBannerUpdate}
        />
      )}
      {response && response.data && (
        <div className="mt-4 p-4 border rounded w-fit ">
          <h2 className="font-bold">Response API:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      )}
      {response && response.error && (
        <div className="mt-4 p-4 border rounded w-full max-w-md">
          <h2 className="font-bold">Error:</h2>
          <p>{response.error}</p>
        </div>
      )}
      </div>
     
    </main>
  );
}