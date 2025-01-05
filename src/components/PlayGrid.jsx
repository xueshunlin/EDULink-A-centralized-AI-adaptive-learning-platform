import { useState, useEffect, useContext } from "react";
import styles from "./PlayGrid.module.css";
import { UserContext } from "../UserContext";
import {CollectionStar} from "./CollectionStar";

export const PlayGrid = ({ query, category, page }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [filteredData, setFilteredData] = useState([]); // State to store filtered data
  const [collection, setCollection] = useState([]); // State to store collection data
  const { user } = useContext(UserContext);

  console.log("playgrid Query:", query);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/videos?keyword=${query}&page=${page}`);
      const Results = await response.json();
      console.log("Results:", Results);

      setData(Results);
      setFilteredData(Results); // Initialize filtered data with full data
    } catch (error) {
      console.error("Error fetching combined data:", error);
    } finally {
      setLoading(false);
    }
  };

  async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch('http://127.0.0.1:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result && result.errors) {
        const error = result.errors[0];
        if (error.extensions && error.extensions.code === 'BAD_USER_INPUT') {
          const details = error.extensions.exception ? error.extensions.exception.errors.join('\n ') : '';
          alert(`${error.message}:
 ${details}`);
        } else {
          alert(`${error.extensions ? error.extensions.code : 'Error'}: ${error.message}`);
        }
        return null; // Return null if there's an error in the GraphQL response
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
      console.error(`Fetch error: ${e.message}`);
      return null; // Return null in case of network or parsing errors
    }
  }

  const addVideoToHistory = async (email, video) => {
    const mutation = `
        mutation AddVideoToHistory($email: String!, $video: InputVideoHistory!) {
          addVideoToHistory(email: $email, video: $video) {
            email
            history {
              videoId
              title
              image
              description
              source
              videoUrl
              watchedAt
            }
          }
        }
    `;

    const variables = { email, video, };

    const response = await graphQLFetch(mutation, variables);

    // if (response.addVideoToHistory) {
    //   alert("Video successfully added to your history!");
    // } else {
    //   alert("An unexpected error occurred while adding the video to history.");
    // }
  };

  const handleVideoClick = async (video) => {
    try {
      console.log("Video clicked:", video);

      let videoUrl = "";
      let paperUrl = "";
      let githubUrl = "";
      if (video.source === "YouTube") {
        videoUrl = `https://www.youtube.com/embed/${video.id}`;
      } else if (video.source === "GitHub") { githubUrl = `https://github.com/${video.id}`; }
      else if (video.source === "Bilibili") {
        videoUrl = `https://player.bilibili.com/player.html?aid=${video.id}&page=1&high_quality=1`;
      } else if (video.source == "ArXiv") {
        paperUrl = video.id;
      } else {
        console.error("Unknown video source:", video.source);
        return;
      }

      // if (!user || !user.email) {
      //   alert("Please log in to save videos to your history.");
      //   return;
      // }

      try {
        await addVideoToHistory(user.email, {
          videoId: String(video.id),
          title: video.title || "Untitled Video", // Provide a fallback title
          image: video.source === "GitHub"
            ? "../github-logo.png"
            : video.source === "ArXiv"
              ? "../arxiv-logo.jpg"
              : video.image || "../default-featured-image.jpg.png", // Default image fallback
          source: video.source,
          description: video.description || "No description available.", // Fallback for description
          videoUrl: videoUrl || paperUrl || githubUrl, // Prioritize videoUrl, then paperUrl, then githubUrl
          watchedAt: new Date(), // Current time for watchedAt
        });

      } catch (error) {
        console.error("Error adding video to history:", error);
      }

      if (paperUrl) {
        window.location.href = `${paperUrl}`;
      } else if (githubUrl) { window.location.href = `${githubUrl}`; }
      else {
        window.location.href = `/video-player-page?source=${video.source}&url=${encodeURIComponent(
          videoUrl)}`;
      }

    } catch (error) {
      console.error("Error handling video click:", error);
    }
  };

  useEffect(() => {
    console.log("Query changed, fetching data:", query);
    setLoading(true);
    fetchData();
  }, [query, page]);

  // Filter data when the category changes
  useEffect(() => {
    if (category === "All categories") {
      setFilteredData(data); // Show all data if no specific category is selected
    } else {
      setFilteredData(
        data.filter((item) => item.source === category) // Filter by category
      );
    }
  }, [category, data]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        if (!user || !user.email) return;
        const query = `
          query listVideoCollection($email: String!) {
            listVideoCollection(email: $email) {
              videoId
            }
          }
        `;

        const variables = { email: user.email };
        const data = await graphQLFetch(query, variables);

        if (data && data.listVideoCollection) {
          const collectionVideoIds = data.listVideoCollection.map((video) => video.videoId);
          setCollection(collectionVideoIds);
        }
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoadingCollection(false);
      }
    };
    
    setLoadingCollection(true);
    fetchCollection();
  }, [user]);

  console.log("collection", collection);
  

  return (
    <div>
      {loading || loadingCollection ? (
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <ul className={styles.grid}>
          {filteredData.map((video) => {
            const videoProps = {
              videoId: String(video.id),
              title: video.title || "Untitled Video",
              image:
                video.source === "GitHub"
                  ? "../github-logo.png"
                  : video.source === "ArXiv"
                  ? "../arxiv-logo.jpg"
                  : video.image || "../default-featured-image.jpg.png",
              source: video.source,
              description: video.description || "No description available.",
              videoUrl:
                video.source === "YouTube"
                  ? `https://www.youtube.com/embed/${video.id}`
                  : video.source === "Bilibili"
                  ? `https://player.bilibili.com/player.html?aid=${video.id}&page=1&high_quality=1`
                  : video.source === "GitHub"
                  ? `https://github.com/${video.id}`
                  : video.source === "ArXiv"
                  ? video.id
                  : null,
              addedAt: new Date().toISOString(),
            };

            return (
              <li
                key={video.id}
                className={styles.card}
                onClick={() => handleVideoClick(video)}
              >
                <div>
                {video.source === "Bilibili" || video.source === "YouTube" ? (
                   <img src={video.image} alt={video.title} />
                  ) : (
                    <p className={styles.arxivDescription}>{video.description}</p>
                  )}
                  <h3>{videoProps.title}</h3>
                  <div className={styles.source}>
                    <span>Source:</span>
                    <img
                      src={
                        video.source === "YouTube"
                          ? "../frame-12@2x.png"
                          : video.source === "Bilibili"
                          ? "../frame-121@2x.png"
                          : video.source === "GitHub"
                          ? "../github-mark.png"
                          : video.source === "ArXiv"
                          ? "../arxiv-logo-small.jpg"
                          : ""
                      }
                      alt={video.source}
                      className={styles.sourceIcon}
                    />
                  </div>
                  <div className="absolute bottom-4 right-4">
                  {user && user.email ? (
                    <CollectionStar
                      email={user.email}
                      video={videoProps}
                      isCollectedInitially={collection.includes(String(video.id))} // Dynamically check collection state
                    />
                  ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
