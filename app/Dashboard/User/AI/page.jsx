'use client';

import React, { useState } from 'react';
import { OpenAI } from 'openai';

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = "7a07e7c539ae45259a03cb29bd690010"; 

const openai = new OpenAI({
  apiKey,
  baseURL,
  dangerouslyAllowBrowser: true,
});

const Page = () => {
  const [question, setQuestion] = useState('');
  const [jsonContent, setJsonContent] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonContent(parsed);
        setError('');
      } catch (err) {
        setError('Invalid JSON file.');
        setJsonContent(null);
      }
    };
    reader.readAsText(file);
  };

  const askQuestion = async () => {
    if (!question.trim() && !jsonContent) return;

    setLoading(true);
    setResponse('');
    setError('');

    let fullPrompt = question.trim();

    if (jsonContent) {
      fullPrompt += `\nHere is additional data:\n${JSON.stringify(jsonContent, null, 2)}`;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "system",
            content:
              "Act like a GHG Protocol agent. Provide well-structured responses with clear headers, bullet points, and organized sections. Include an executive summary at the beginning and actionable recommendations at the end. Use markdown formatting for better readability. Be detailed yet concise, and include relevant examples when helpful.",
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      setResponse(completion.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedResponse = (responseText) => {
    // Basic markdown-like formatting for the response display
    if (!responseText) return null;
    
    // Split by headers (lines with ## or #)
    const sections = responseText.split(/^(#+\s.*$)/gm);
    
    return (
      <div className="markdown-content">
        {sections.map((section, index) => {
          if (section.match(/^#+\s/)) {
            // This is a header
            const level = (section.match(/^#+/) || ['#'])[0].length;
            const title = section.replace(/^#+\s/, '');
            return (
              <div key={index} className={`text-${level === 1 ? 'xl' : level === 2 ? 'lg' : 'md'} font-bold mt-4 mb-2`}>
                {title}
              </div>
            );
          } else {
            // This is content
            // Convert bullet points with proper spacing
            const formattedContent = section
              .split('\n')
              .map((line, lineIndex) => {
                if (line.match(/^\s*-\s/)) {
                  return (
                    <li key={lineIndex} className="ml-4">
                      {line.replace(/^\s*-\s/, '')}
                    </li>
                  );
                } else if (line.match(/^\s*\d+\.\s/)) {
                  return (
                    <li key={lineIndex} className="ml-4 list-decimal">
                      {line.replace(/^\s*\d+\.\s/, '')}
                    </li>
                  );
                } else if (line.trim()) {
                  return <p key={lineIndex} className="my-2">{line}</p>;
                }
                return <br key={lineIndex} />;
              });
            
            return <div key={index}>{formattedContent}</div>;
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Ask a GHG Protocol Agent</h1>

        <div className="mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How to calculate Scope 2 emissions?"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="text-sm text-gray-600"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {jsonContent && (
          <div className="mb-4 bg-gray-100 p-3 rounded-md border text-sm max-h-60 overflow-y-auto">
            <strong className="block text-gray-700 mb-1">Parsed JSON:</strong>
            <pre className="whitespace-pre-wrap text-gray-800">{JSON.stringify(jsonContent, null, 2)}</pre>
          </div>
        )}

        <button
          onClick={askQuestion}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Ask"}
        </button>

        {response && (
          <div className="bg-gray-100 mt-6 p-4 rounded-md border border-gray-200">
            <h2 className="font-semibold text-gray-700 mb-2">Response:</h2>
            {renderFormattedResponse(response)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;