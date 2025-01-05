import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import CoursePage from "./pages/CoursePage";
import MainPage from "./pages/MainPage";
import FeaturesOverviewPage from "./pages/FeaturesOverviewPage";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";


    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/main-page" element={<MainPage />} />
      <Route path="/course-page" element={<CoursePage />} />
      <Route path="/video-player-page" element={<VideoPlayerPage />} />
      <Route path="/features-page" element={<FeaturesOverviewPage />} />
      <Route path="/search-page" element={<SearchPage />} />
      <Route path="/history-page" element={<HistoryPage />} />
    </Routes>
  );
}
export default App;
