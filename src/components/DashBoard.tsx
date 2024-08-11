"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Banner from "../components/Banner";
import { inputSchema } from "@/lib/validation";
import { z } from "zod";

interface ApiResponse {
  data?: any;
  error?: string;
}

export default function DashBoard() {
  const [input, setInput] = useState({
    description: "",
    timer: "",
    link: "",
  });
  const [response, setResponse] = useState<any>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  //below state I used it for ux / thats why many usestates came
  //I believe we can use tanstack for better but this works fine...
  const [isLoading, setIsLoading] = useState(false);
  const [isBannerHidden, setIsBannerHidden] = useState(false);
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (bannerVisible && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && bannerVisible) {
      handleBannerRemove();
    }
    return () => clearTimeout(timerId);
  }, [timeLeft, bannerVisible]);

  const callApi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const validatedInput = inputSchema.parse(input);
      const res = await axios.post("/api/banner", input);
      setResponse(res.data);
      setBannerVisible(true);
      setIsBannerHidden(false);
      setTimeLeft(parseInt(validatedInput.timer));
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        setResponse({ error: error.errors.map((e) => e.message).join(", ") });
      }
      else{
        console.error("Error calling API:", error);
        setResponse({ error: "API call is failed man" });
      }
      
    } finally {
      setIsLoading(false);
      setInput({ description: "", timer: "", link: "" });
    }
  };

  const handleBannerRemove = () => {
    setBannerVisible(false);
    setResponse(null);
    setTimeLeft(0);
  };

  const handleBannerUpdate = (updatedContent: { description: string }) => {
    setResponse((prevResponse: ApiResponse) => ({
      ...prevResponse,
      data: {
        ...prevResponse.data,
        ...updatedContent,
      },
    }));
  };

  const toggleBanner = () => {
    setIsBannerHidden(!isBannerHidden);
  };

  return (
    <main className="flex h-screen w-full items-center max-md:flex-col justify-center">
      <div className="md:flex-1 pt-10 h-full flex-col flex items-center justify-center ">
        <p className="font-bold mb-5">TAKEUFORWARD TASK</p>
        <form onSubmit={callApi} className="flex flex-col space-y-2">
          <input
            className="outline-none rounded-md border p-2 text-black"
            value={input.description}
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
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

          {bannerVisible && response && response.data && (
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="bannerToggle"
                checked={!isBannerHidden}
                onChange={toggleBanner}
                className="mr-2"
              />
              <p>Banner hide </p>
            </div>
          )}

          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      <div className="md:flex-1 h-full flex-col flex items-center justify-center">
        {bannerVisible && response && response.data && (
          <>
            {!isBannerHidden && (
              <Banner
                content={{ ...response.data, timeLeft }}
                onBannerUpdate={handleBannerUpdate}
              />
            )}
          </>
        )}
        {response && response.data && (
          <div className="mt-4 p-4 border rounded w-fit ">
            <h2 className="font-bold">Response API:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(response.data, null, 2)}
            </pre>
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
