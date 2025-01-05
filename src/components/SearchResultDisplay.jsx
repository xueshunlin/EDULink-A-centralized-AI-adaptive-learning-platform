import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import styles from "./SearchResultDisplay.module.css";
import { SearchResultsList } from "./SearchResultsList";

const SearchResultDisplay = () => {
  const [results, setResults] = useState([]); // Holds search results
  const [isFocused, setIsFocused] = useState(false); // Tracks focus on the search bar
  const navigate = useNavigate();

  // Handle search input and navigate to update query1 in the URL
  const handleSearch = (searchQuery) => {
    console.log(`Navigating to /search-page?query1=${searchQuery}`);
    navigate(`/search-page?query1=${encodeURIComponent(searchQuery)}`); // Navigate to search-page with query1
  };

  return (
      <div className={styles.searchbar}>
        <SearchBar
          setResults={setResults} // Dynamically update suggestions
          onSearch={handleSearch} // Navigate to search-page
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        />
        {isFocused && results.length > 0 && (
          <div className={styles.suggestionBox}>
            {/* Use SearchResultsList to show suggestions */}
            {results.length > 0 && <SearchResultsList results={results} />}
          </div>
        )}
      </div>
  );
};

export default SearchResultDisplay;
