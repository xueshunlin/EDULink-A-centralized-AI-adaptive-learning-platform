import { useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { debounce } from "lodash";
import styles from "./SearchBar.module.css";
import { GPT_RECOMMENDATION_SYSTEM_PROMPT, GPT_RECOMMENDATION_PROMPT } from "../../constants.mjs";

export const SearchBar = ({ setResults, onFocus, onBlur, onSearch }) => {
  const [input, setInput] = useState("");

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
      'x-rapidapi-host': 'yt-api.p.rapidapi.com'
    }
  };

  const sendToOpenAI = async (query) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: `${GPT_RECOMMENDATION_SYSTEM_PROMPT}` },
                {
                    role: "user",
                    content: `${GPT_RECOMMENDATION_PROMPT(query)}`,
                },
            ],
            temperature: 0.2
        }),
    });
    const data = await response.json();

    const GPTresponse = JSON.parse(data.choices[0].message.content.replace(/```json|```/g, '').trim());

    setResults(GPTresponse.keyword);
};
  // Debounce the fetchData function
  const debouncedFetchData = useCallback(debounce(sendToOpenAI, 300), []);

  const handleChange = (value) => {
    setInput(value);
    debouncedFetchData(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      onSearch(input.trim()); // Trigger the parent-provided onSearch function
      setInput(""); // Optionally, clear the input field after search
    }
  };

  return (
    <div className={styles.input_wrapper}>
      <FaSearch className={styles.search_icon} />
      <input
        placeholder="Type to search..."
        value={input}
        onFocus={onFocus} // Highlight or show suggestions on focus
        onBlur={onBlur} // Hide suggestions after blur
        onChange={(e) => handleChange(e.target.value)} // Handle user input
        onKeyDown={handleKeyPress} // Trigger search on Enter
        className={styles.search_input}
      />
    </div>
  );
};