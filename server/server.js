const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { connectToDb } = require('./db.js');
const cors = require('cors'); // Enable CORS for cross-origin requests

let db;

// Helper function to get the next sequence for user ID
async function getNextSequence() {
  try {
    const lastUser = await db.collection('users')
      .find({})
      .sort({ id: -1 }) // Sort by `id` in descending order
      .limit(1)
      .toArray();

    return lastUser.length > 0 ? lastUser[0].id + 1 : 1; // Increment or start at 1
  } catch (err) {
    console.error('Error generating next user ID:', err);
    throw new Error('Unable to generate the next user ID.');
  }
}

// Mutation Resolvers
const Mutation = {
  async addUser(_, { user }) {
    try {
      const existingUser = await db.collection('users').findOne({ email: user.email });
      if (existingUser) return existingUser;

      // Generate new ID and add the user
      user.id = await getNextSequence();
      const result = await db.collection('users').insertOne(user);

      return result.ops[0];
    } catch (err) {
      console.error('Error adding user:', err);
      throw new Error(`Error adding user. Details: ${err.message}`);
    }
  },

  async addVideoToCollection(_, { email, video }) {
    try {
      const updatedUser = await db.collection('users').findOneAndUpdate(
        { email },
        { $push: { collections: { ...video, 
          addedAt: video.addedAt ? new Date(video.addedAt) : new Date(), } } },
        { returnDocument: 'after' } // Return the updated document
      );
      if (!updatedUser.value) throw new UserInputError('User not found.');
      return updatedUser.value;
    } catch (err) {
      console.error('Error adding video to collection:', err);
      throw new Error(`Error adding video to collection. Details: ${err.message}`);
    }
  },

  async removeVideoFromCollection(_, { email, videoId }) {
    try {
      const updatedUser = await db.collection('users').findOneAndUpdate(
        { email },
        { $pull: { collections: { videoId } } },
        { returnDocument: 'after' } // Return the updated document
      );
      if (!updatedUser.value) throw new UserInputError('User not found.');
      return updatedUser.value;
    } catch (err) {
      console.error('Error removing video from collection:', err);
      throw new Error(`Error removing video from collection. Details: ${err.message}`);
    }
  },

  async addVideoToHistory(_, { email, video }) {
    try {
      // Find the user by email
      const user = await db.collection("users").findOne({ email });
      if (!user) {
        throw new UserInputError("User not found.");
      }
  
      // Check if the video is already in the user's history
      const videoExists = user.history?.some((entry) => entry.videoId === video.videoId);
  
      if (videoExists) {
        // If the video is already in the history, return the user as is
        return user;
      }
  
      // Prepare the history entry
      const historyEntry = {
        ...video,
        watchedAt: video.watchedAt ? new Date(video.watchedAt) : new Date(),
      };
  
      // Add the new video to the user's history
      const updatedUser = await db.collection("users").findOneAndUpdate(
        { email },
        {
          $push: { history: historyEntry },
        },
        { returnDocument: "after" } // Return the updated document
      );
  
      return updatedUser.value;
    } catch (err) {
      console.error("Error adding video to history:", err);
      throw new Error(`Error adding video to history. Details: ${err.message}`);
    }
  },
  

  async clearVideoCollection(_, { email }) {
    try {
      const updatedUser = await db.collection('users').findOneAndUpdate(
        { email },
        { $set: { collections: [] } },
        { returnDocument: 'after' } // Return the updated document
      );
      if (!updatedUser.value) throw new UserInputError('User not found.');
      return updatedUser.value;
    } catch (err) {
      console.error('Error clearing video collection:', err);
      throw new Error(`Error clearing video collection. Details: ${err.message}`);
    }
  },

  async clearVideoHistory(_, { email }) {
    try {
      const updatedUser = await db.collection('users').findOneAndUpdate(
        { email },
        { $set: { history: [] } },
        { returnDocument: 'after' } // Return the updated document
      );
      if (!updatedUser.value) throw new UserInputError('User not found.');
      return updatedUser.value;
    } catch (err) {
      console.error('Error clearing video history:', err);
      throw new Error(`Error clearing video history. Details: ${err.message}`);
    }
  },
};

// Query Resolvers
const Query = {
  listVideoHistory: async (_, { email }, { db }) => {
    const user = await db.collection("users").findOne({ email });
    if (!user) throw new Error("User not found");
    return user.history.map(video => ({
      ...video,
      source: video.source || "unknown",
      url: video.url || "#",
    }));
  },

  async listVideoCollection(_, { email }) {
    try {
      const user = await db.collection('users').findOne(
        { email },
        { projection: { collections: 1 } }
      );
      if (!user) throw new UserInputError('User not found.');
      return user.collections || [];
    } catch (err) {
      console.error('Error fetching video collection:', err);
      throw new Error(`Error fetching video collection. Details: ${err.message}`);
    }
  },
};

// Express and Apollo Server Setup
const app = express();
app.use(cors()); // Enable CORS

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/userschema.graphql', 'utf-8'),
  resolvers: { Mutation, Query },
  context: async () => ({ db }), // Pass database connection to resolvers
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

// Increase payload size limit
app.use(express.json({ limit: "10mb" })); // Adjust limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Apply Middleware and Start Server
server.applyMiddleware({ app, path: '/graphql' });

(async function startServer() {
  try {
    db = await connectToDb(); // Connect to MongoDB
    app.listen(8000, () => {
      console.log('Server running at http://localhost:8000/graphql');
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
  }
})();