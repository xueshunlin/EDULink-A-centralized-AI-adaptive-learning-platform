import React, { useState } from "react";
import ChatBot from 'react-chatbotify';
import OpenAI from "openai";
import "./VideoPlayerAssistant.css";

const VideoPlayerAssistant = () => {
  const apiKey = `${import.meta.env.VITE_OPENAI_API_KEY}`;
  const modelType = "gpt-4o-mini";
  const [hasError, setHasError] = useState(false);

  const styles = {
    headerStyle: {
      // background: '#42b0c5',
      // color: '#ffffff',
      // padding: '10px',
    },
    chatWindowStyle: {
      // backgroundColor: '#f2f2f2',
    },
    // ...other styles
  };


  // Function to call OpenAI API
  const callOpenAI = async (params) => {
    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for testing on the browser side, not recommended for production
      });

      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: params.userInput }],
        model: modelType,
      });

      await params.injectMessage(chatCompletion.choices[0].message.content);
    } catch (error) {
      await params.injectMessage("I'm sorry, I couldn't process your request. Please try again later.");
      setHasError(true);
    }
  };

  // Define the chatbot flow
  const flow = {
    start: {
      message: "Hello! I'm your dedicated video player assistant. I'm here to help answer any questions about the video you're watching. How can I assist you today?",
      path: "loop",
    },
    loop: {
      message: async (params) => {
        await callOpenAI(params);
      },
      path: () => {
        return "loop";
        // return hasError ? "start" : "loop";
      },
    },
  };

  return (
      <ChatBot
        styles={styles}
        settings={{
          chatHistory: { storageKey: "video_player_assistant_conversation" },
        }}
        flow={flow}
      />
  );
};

export default VideoPlayerAssistant;