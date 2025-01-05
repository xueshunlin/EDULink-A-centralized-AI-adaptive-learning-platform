import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import styles from "./HistoryPage.module.css";
import { Navibar } from "../components/Navibar";
import { Footer } from "../components/Footer";
import { UserContext } from "../UserContext";

const HistoryPage = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Determine type from URL (either "history" or "collection")
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type") || "history";

  const isHistory = type === "history";

  // Fetch data from the GraphQL API
  async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch("http://127.0.0.1:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        const error = result.errors[0];
        alert(error.message || "An error occurred while fetching data.");
        return null;
      }

      return result.data;
    } catch (e) {
      alert(`Error fetching data: ${e.message}`);
      console.error(`Fetch error: ${e.message}`);
      return null;
    }
  }

  // Fetch user data (history or collection)
  const fetchData = async () => {

    const query = isHistory
      ? `
        query listVideoHistory($email: String!) {
          listVideoHistory(email: $email) {
            videoId
            title
            image
            source
            description
            videoUrl
            watchedAt
          }
        }
      `
      : `
        query listVideoCollection($email: String!) {
          listVideoCollection(email: $email) {
            videoId
            title
            image
            source
            description
            videoUrl
            addedAt
          }
        }
      `;

    const variables = { email: user.email };
    const data = await graphQLFetch(query, variables);

    if (data) {
      setData(isHistory ? data.listVideoHistory : data.listVideoCollection);
    }
  };

  // Delete a specific item from the collection
  const handleDelete = async (videoId) => {
    if (!user || !user.email) {
      alert("Please log in to delete an item.");
      return;
    }

    const mutation = `
      mutation removeVideoFromCollection($email: String!, $videoId: String!) {
        removeVideoFromCollection(email: $email, videoId: $videoId) {
          email
          collections {
            videoId
          }
        }
      }
    `;

    try {
      const result = await graphQLFetch(mutation, { email: user.email, videoId });

      if (result) {
        setData((prevData) => prevData.filter((item) => item.videoId !== videoId)); // Remove the item locally
        // alert("Item successfully removed from your collection.");
      } else {
        alert("Failed to remove the item. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item.");
    }
  };

  // Clear user data (history or collection)
  const handleClearData = async () => {
    if (!user || !user.email) {
      alert("Please log in to clear your data.");
      return;
    }

    const mutation = isHistory
      ? `
        mutation clearVideoHistory($email: String!) {
          clearVideoHistory(email: $email) {
            email
            history {
              videoId
            }
          }
        }
      `
      : `
        mutation clearVideoCollection($email: String!) {
            clearVideoCollection(email: $email) {
                email
                collections {
                videoId
                }
            }
        }
      `;

    try {
      const data = await graphQLFetch(mutation, { email: user.email });
      if (data) {
        setData([]); // Clear the local state
        alert(`Your ${isHistory ? "history" : "collection"} has been cleared.`);
      } else {
        alert("Failed to clear data. Please try again later.");
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("An error occurred while clearing data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, user]);

  return (
    <div className={styles.videoHistoryPage}>
      <Navibar />
      {user ? (
      <div className={styles.historyContainer}>
        <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
          {isHistory ? "Watch History" : "\u00A0Collections"}
        </h2>
        {data.length > 0 ? (
          <div>
            {/* Clear Data Button */}
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleClearData}
            >
              Clear {isHistory ? "History" : "Collections"}
            </button>

            {/* Video List */}
            <ul className={styles.videoList}>
              {data.map((item) => (
                <li key={item.videoId} className={styles.videoItem}>
                  <img
                    src={item.image || "/images/video-placeholder.png"}
                    alt={item.title}
                    className={styles.thumbnail}
                    onClick={async () => {
                        try {
                        if (item.source === "YouTube" || item.source === "Bilibili") {
                            // Redirect to video-player page for YouTube or Bilibili
                            window.location.href = `/video-player-page?source=${item.source}&url=${encodeURIComponent(
                            item.videoUrl
                            )}`;
                        } else if (item.source === "GitHub" || item.source === "ArXiv") {
                            // Redirect directly to GitHub link
                            window.location.href = item.videoUrl;
                        } else {
                            console.error("Unknown video source:", item.source);
                            return;
                        }
                        } catch (error) {
                        console.error("Error handling video click:", error);
                        }
                  }}
                  style={{ cursor: "pointer" }}
                  />
                  
                  <div className={styles.videoDetails}>
                    <h3>{item.title || "Untitled Video"}</h3>
                    <p className={styles.videoDescription}>
                      {item.description || "No description available."}
                    </p>
                    <p>
                      {isHistory
                        ? `Watched on: ${item.watchedAt
                          ? new Date(item.watchedAt).toLocaleString()
                          : "Unknown"
                        }`
                        : `Added on: ${item.addedAt
                          ? new Date(item.addedAt).toLocaleString()
                          : "Unknown"
                        }`}
                    </p>
                    <div className={styles.actionButtons}>
                      {/* View Again Button */}
                      <button
                        onClick={async () => {
                          try {
                            if (item.source === "YouTube" || item.source === "Bilibili") {
                              // Redirect to video-player page for YouTube or Bilibili
                              window.location.href = `/video-player-page?source=${item.source}&url=${encodeURIComponent(
                                item.videoUrl
                              )}`;
                            } else if (item.source === "GitHub" || item.source === "ArXiv") {
                              // Redirect directly to GitHub link
                              window.location.href = item.videoUrl;
                            } else {
                              console.error("Unknown video source:", item.source);
                              return;
                            }
                          } catch (error) {
                            console.error("Error handling video click:", error);
                          }
                        }}
                        className="text-white bg-blue-500 hover:bg-blue-600 rounded-full px-3 py-1 text-sm"
                      >
                        View Again
                      </button>
                      {!isHistory && (
                        <button
                          onClick={() => handleDelete(item.videoId)}
                          className="ml-4 text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
            Your {isHistory ? "watch history" : "collection"} is empty.
          </p>
        )}
      </div>
      ) : (
        <div className="flex flex-col items-center justify-start h-screen">
  <p className="text-2xl font-bold text-gray-700 lg:text-4xl dark:text-gray-300">
    Please log in to view your data.
  </p>
</div>


      )}
      <Footer />
    </div>
  );
};

export default HistoryPage;
