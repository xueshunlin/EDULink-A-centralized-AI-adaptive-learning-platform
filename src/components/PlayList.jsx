import React, { useContext } from "react";
import styles from "./PlayList.module.css";
import { UserContext } from "../UserContext";

const PlayList = ({ recommend }) => {
  const { user } = useContext(UserContext);

  // generic function to fetch data from the GraphQL server
  const graphQLFetch = async (query, variables = {}) => {
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

      if (result && result.errors) {
        const error = result.errors[0];
        if (error.extensions && error.extensions.code === "BAD_USER_INPUT") {
          const details = error.extensions.exception
            ? error.extensions.exception.errors.join("\n ")
            : "";
          alert(`${error.message}:\n${details}`);
        } else {
          alert(
            `${error.extensions ? error.extensions.code : "Error"}: ${error.message}`
          );
        }
        return null;
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
      console.error(`Fetch error: ${e.message}`);
      return null;
    }
  };

  // add video to history
  const addVideoToHistory = async (video) => {
    // if (!user || !user.email) {
    //   alert("Please log in to save videos to your history.");
    //   return;
    // }

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

    const variables = { email: user.email, video };

    const response = await graphQLFetch(mutation, variables);

    if (response?.addVideoToHistory) {
      console.log("Video successfully added to history!");
    } else {
      console.error("Error adding video to history.");
    }
  };

  // click event handler for video
  const handleVideoClick = async (video) => {
    const videoUrl =
      video.source === "YouTube"
        ? `https://www.youtube.com/embed/${video.id}`
        : video.source === "Bilibili"
        ? `https://player.bilibili.com/player.html?aid=${video.id}&page=1&high_quality=1`
        : null;

    if (!videoUrl) {
      alert("Unknown video source. Cannot navigate.");
      return;
    }

    // add video to history
    const videoData = {
      videoId: video.id,
      title: video.title || "Untitled Video",
      image: video.image,
      source: video.source,
      description: video.description || "No description available.",
      videoUrl,
      watchedAt: new Date(),
    };

    try {
      await addVideoToHistory(videoData);
    } catch (error) {
      console.error("Error adding video to history:", error);
    }

    // jump to video player page
    window.location.href = `/video-player-page?source=${video.source}&url=${encodeURIComponent(
      videoUrl
    )}`;
  };

  if (!recommend || recommend.length === 0) {
    return <p className={styles.noRecommend}>No recommendations available</p>;
  }

  return (
    <div className={styles.playlistContainer}>
      <h3 className={styles.playlistTitle}>Recommended Videos</h3>
      <ul className={styles.playlistList}>
        {recommend.map((video) => (
          <li key={video.id} className={styles.playlistItem}>
            {/* clickable area for video */}
            <div
              className={styles.clickableArea}
              onClick={() => handleVideoClick(video)}
            >
              <img
                src={video.image.replace("http:", "https:")} // https://... for images
                alt={video.title}
                className={styles.thumbnail}
                {...(video.source === "Bilibili" && {
                    referrerPolicy: "no-referrer", // only for Bilibili to avoid error loading
                    crossOrigin: "anonymous",
                })}
              />
              <div className={styles.videoInfo}>
                <p className={styles.videoTitle}>{video.title}</p>
                {/* <p className={styles.videoTags}>{video.tags}</p>
                <p className={styles.videoPubDate}>{video.pubDate}</p> */}
                <p className={styles.videoMetadata}>
                    {video.pubDate} · {video.tags}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayList;