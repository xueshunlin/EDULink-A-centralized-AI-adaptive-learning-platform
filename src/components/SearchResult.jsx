import styles from "./SearchResult.module.css";
import { useNavigate } from "react-router-dom";

export const SearchResult = ({ result }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search-page?query1=${encodeURIComponent(result)}`);
  };
  
  return (
    <div
      className={styles.search_result}
      onMouseDown={handleClick}
    >
      {result}
    </div>
  );
};
