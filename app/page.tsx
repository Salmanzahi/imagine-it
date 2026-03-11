'use client'

import { useEffect, useState } from "react";
import { loadCode } from "./load";

export default function Home() {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchcode = async () => {
      const codeData = await loadCode()
      setCode(codeData)
      setLoading(false)
    }
    fetchcode()
    
  }, []);

  return (
    
    <div className="flex flex-col h-[calc(100vh-73px)]">
      
      {/* HTML PREVIEW */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading preview...
          </div>
        ) : code ? (
          <iframe
            srcDoc={code}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Generated HTML Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No preview available. Go to Create Page to generate one.
          </div>
        )}
      </div>
    </div>
  );
}
