import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import styles from "./VideoPlayerPage.module.css";
import { Navibar } from "../components/Navibar";
import { Footer } from "../components/Footer";
import { UserContext } from "../UserContext";
import { CollectionStar} from "../components/CollectionStar";
import SearchResultDisplay from "../components/SearchResultDisplay";
import VideoPlayerAssistant from "../components/VideoPlayerAssistant";
import PlayList from "../components/PlayList";

const VideoPlayerPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { user } = useContext(UserContext);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const source = queryParams.get("source"); // video source: YouTube or Bilibili
  const [playerURL, setPlayerURL] = useState(""); // State to track player URL
  const [videoID, setVideoID] = useState(null); // State to store video ID
  const [singleVideo, setSingleVideo] = useState(null); // Store video data
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    // Decode and set player URL
    const decodedURL = decodeURIComponent(queryParams.get("url"));
    setPlayerURL(decodedURL);

      // Trigger iframe resize after setting playerURL
    const iframe = document.getElementById("videoPlayer");
    if (iframe) {
      iframe.style.height = iframe.offsetWidth * 0.5625 + "px"; // 16:9 aspect ratio
    }
  }, [queryParams]);

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
          const collectionVideoIds = data.listVideoCollection.map((video) => String(video.videoId));
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

  useEffect(() => {
    // Extract video ID based on the source
    if (source === "YouTube" && playerURL.includes("/embed/")) {
      const id = playerURL.split("/embed/")[1]?.split("?")[0];
      setVideoID(id);
      console.log("Extracted YouTube VideoID:", id);
    } else if (source === "Bilibili" && playerURL.includes("player.bilibili.com")) {
      const id = playerURL.split("aid=")[1]?.split("&")[0];
      setVideoID(id);
      console.log("Extracted Bilibili VideoID:", id);
    }
  }, [playerURL, source]);

  useEffect(() => {
    // Fetch video data when videoID and source are available
    if (videoID && source) {
      const sinreAPI = `http://127.0.0.1:3000/api/videos?source=${source}&videoid=${videoID}`;
      console.log("Single & Related Video API URL:", sinreAPI);

      fetch(sinreAPI)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setSingleVideo(data);
          console.log("Fetched single video data:", data);
        })
        .catch((error) => {
          console.error("Error fetching API data:", error);
        });
    }
  }, [videoID, source]);

  // useEffect(() => {
  //   // Handle iframe resizing
  //   const resizeIframe = () => {
  //     const iframe = document.getElementById("videoPlayer");
  //     if (iframe) {
  //       iframe.style.height = iframe.offsetWidth * 0.5625 + "px"; // 16:9 aspect ratio
  //     }
  //   };

  //   if (playerURL) {
  //     resizeIframe(); // Initial resize
  //     window.addEventListener("resize", resizeIframe);
  //   }

  //   return () => {
  //     window.removeEventListener("resize", resizeIframe);
  //   };
  // }, [playerURL]);

  if (!playerURL) {
    return <p className={styles.errorText}>Error: Missing player URL.</p>;
  }

  return (
    <>
      {loadingCollection ? (
        <p>Loading...</p>
      ) : (
        <>
          <VideoPlayerAssistant />
          <div className={styles.videoPlayerPage}>
            {/* Navbar */}
            <Navibar />
            <div className={styles.searchbarContainer}>
              <SearchResultDisplay />
            </div>
            <div className={styles.pageContainer}>
              {/* Left Column: Video Details and Player */}
              <div className={styles.leftColumn}>
                {/* Video Title */}
                <h5 className={styles.videoMainTitle}>
                  {singleVideo?.single?.title}
                </h5>
  
                {/* Metadata (Views, Date, Tags) */}
                <div className={styles.metadataSection}>
                  <p className={styles.videoMetadata}>
                    <span className={styles.viewCount}>
                      {singleVideo?.single?.viewCount} views
                    </span>
                    <span className={styles.dotSeparator}>•</span>
                    <span className={styles.pubDate}>
                      Published on {singleVideo?.single?.pubDate}
                    </span>
                    <span className={styles.dotSeparator}>•</span>
                    <span className={styles.tags}>
                      Tags: {singleVideo?.single?.tags}
                    </span>
                  </p>
                </div>
  
                {/* Video Player */}
                <div className={styles.videoPlayerContainer}>
                  <iframe
                    id="videoPlayer"
                    src={playerURL}
                    frameBorder="no"
                    framespacing="0"
                    width="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen={true}
                    className={styles.responsiveIframe}
                    title={singleVideo?.single?.title}
                  ></iframe>
                </div>
  
                {/* Author Info */}
                <div className={styles.authorSection}>
                  <img
                    src={singleVideo?.single?.author?.authorIcon}
                    alt={`${singleVideo?.single?.author?.name} icon`}
                    className={styles.authorIcon}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <p className={styles.authorName}>
                      {singleVideo?.single?.author?.name}
                    </p>
                    <p className={styles.videoSource}>
                      {singleVideo?.single?.source}
                    </p>
  
                    {/* Debugging output */}
                    {console.log("Collection:", collection)}
                    {console.log("VideoID:", videoID)}
                    {console.log(
                      "Is Collected:",
                      collection.includes(videoID)
                    )}
  
                    {user && user.email ? (
                      <CollectionStar
                      email={user.email}
                      video={{
                        videoId: videoID,
                        title:
                          singleVideo?.single?.title || "Untitled Video",
                        image: singleVideo?.single?.image || "../default-featured-image.jpg.png",
                        source: source,
                        description:
                          singleVideo?.single?.description ||
                          "No description available.",
                        videoUrl: playerURL,
                        addedAt: new Date().toISOString(),
                      }}
                      isCollectedInitially={collection.includes(videoID)}
                      className={styles.collectionStar}
                    />
                  ) :  null}
                  </div>
                </div>
  
                {/* Description */}
                <div className={styles.descriptionSection}>
                  <p>{singleVideo?.single?.description}</p>
                </div>
              </div>
  
              {/* Right Column: Playlist */}
              <div className={styles.rightColumn}>
                <PlayList recommend={singleVideo?.recommend} />
              </div>
            </div>
  
            <br />
            <br />
            {/* Footer */}
            <Footer />
          </div>
        </>
      )}
    </>
  );
};  

export default VideoPlayerPage;