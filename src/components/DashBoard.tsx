'use client'
import { useState } from "react";
import axios from "axios";
import Banner from "./Banner";

export default function Home() {
  const [input, setInput] = useState({
    description: '',
    timer: '',
    link: ''
  });
  const [response, setResponse] = useState<any>(null); // Initialize with null
  const [isLoading, setIsLoading] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false); // Toggle state

  const callApi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null); // Reset response

    try {
      const res = await axios.post("/api/banner", input);

      setResponse(res.data);
    } catch (error) {
      console.error("Error calling API:", error);
      setResponse({ error: "An error occurred while processing your request." });
    } finally {
      setIsLoading(false);
      setInput({ description: '', timer: '', link: '' }); // Reset input data
    }
  };

  return (
    <main className="flex items-center justify-center h-screen w-full flex-col">
      <div>
        <form onSubmit={callApi} className="flex text-black flex-col justify-center items-center space-y-2">
          <input 
            className="outline-none border p-2" 
            value={input.description} 
            onChange={(e) => setInput({ ...input, description: e.target.value })}
            placeholder="Enter title"
          />
          <input 
            type="number"
            className="outline-none border p-2" 
            value={input.timer} 
            onChange={(e) => setInput({ ...input, timer: e.target.value })}
            placeholder="Enter timer"
          />
          <input 
            className="outline-none border p-2" 
            value={input.link} 
            onChange={(e) => setInput({ ...input, link: e.target.value })}
            placeholder="Enter link"
          />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      <button onClick={() => setBannerVisible(!bannerVisible)}>Toggle Banner</button>
      {bannerVisible && response && response.data && <Banner content={response.data} />}
      {response && response.data && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold">Response:</h2>
          <pre>{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      )}
      {response && response.error && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{response.error}</p>
        </div>
      )}
    </main>
  );
}