import React, { useState} from "react";

export const CollectionStar = ({ email, video, isCollectedInitially, refreshCollection }) => {
  const [isCollected, setIsCollected] = useState(isCollectedInitially);
  console.log("starisCollected:", isCollected);

  const toggleStar = async (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent

    const mutation = isCollected
      ? `
      mutation removeVideoFromCollection($email: String!, $videoId: String!) {
        removeVideoFromCollection(email: $email, videoId: $videoId) {
          email
          collections {
            videoId
          }
        }
      }
    `
      : `
      mutation addVideoToCollection($email: String!, $video: InputVideoCollection!) {
        addVideoToCollection(email: $email, video: $video) {
          email
          collections {
            videoId
            title
            image
            description
            source
            videoUrl
            addedAt
          }
        }
      }
    `;

    const variables = isCollected
      ? { email, videoId: video.videoId }
      : { email, video };

    try {
      const response = await fetch("http://127.0.0.1:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        alert("An error occurred. Please try again.");
        return;
      }

      setIsCollected((prevState) => !prevState); // Toggle collection state
      if (refreshCollection) refreshCollection(); // Refresh collection if callback is provided
    } catch (error) {
      console.error("Error in mutation:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div onClick={toggleStar} className="cursor-pointer">
      {isCollected ? (
        // Render filled star when video is in the collection
        <svg
          className="w-6 h-6 text-yellow-500 dark:text-yellow-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
        </svg>
      ) : (
        // Render empty star when video is not in the collection
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"
          />
        </svg>
      )}
    </div>
  );
};
