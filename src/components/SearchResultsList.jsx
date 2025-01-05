import { Link } from "react-router-dom";
import styles from "./SearchResultsList.module.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results }) => {
  return (
    <div className={styles.results_list}>
      {results.map((result, index) => (
        <div key={index}>
          <SearchResult result={result} />
        </div>
      ))}
    </div>
  );
};