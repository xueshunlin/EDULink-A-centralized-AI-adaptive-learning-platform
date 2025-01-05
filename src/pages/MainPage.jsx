import { useLocation } from "react-router-dom";
import styles from "./MainPage.module.css";
import { Navibar } from "../components/Navibar";
import { PlayGrid } from "../components/PlayGrid";
import { Footer } from "../components/Footer";
import { ResourceFilter } from "../components/ResourceFilter";
import SearchResultDisplay from "../components/SearchResultDisplay";
import TrendingFields from "../components/TrendingFields";
import { useState } from "react";

const MainPage = () => {
  const location = useLocation();

  // Extract query (for coursepage)
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("query") || "most popular";

  // State to manage the query and category
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("All categories");

  return (
    <div className={styles.mainPage}>
      <Navibar />

      {/* Display the current query for the course page */}
      <div className={styles.startYourLearningJourneyHeParent}>
        <div className={styles.startYourLearning}>{query}</div>
      </div>

      {/* Integrate SearchResultDisplay */}
      <div className={styles.searchbarContainer}>
        <SearchResultDisplay />
      </div>
      <ResourceFilter setCategory={setCategory} />
      <h4 className="text-2xl font-bold dark:text-white pl-20 pb-3">Trending Fields</h4>
      <TrendingFields setQuery={setQuery} />

      <h4 className="text-2xl font-bold dark:text-white pl-20 pb-3">Most Visits</h4>
      <div className={styles.gridContainer}>
        {/* Use query to fetch data for coursepage */}
        <PlayGrid query={query} category={category} page="1" />
      </div>

      <Footer />
    </div>
  );
};

export default MainPage;