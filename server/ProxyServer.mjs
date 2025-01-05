// Proxy server is used to get rid of CORS issues when fetching data from external APIs.
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Import node-fetch directly
import {
    YOUTUBE_SEARCH_API, 
    BILIBILI_SEARCH_API,
    BILIBILI_RELATED_VIDEO_API,
    YOUTUBE_RELATED_VIDEO_API,
    GPT_SYSTEM_PROMPT, 
    GPT_FILTER_PROMPT,
    YOUTUBE_VIDEO_INFO_API,
    BILIBILI_VIDEO_INFO_API
} from '../constants.mjs';
import dotenv from 'dotenv';
import NodeCache from "node-cache";
import arxiv_api from 'arxiv-api';
import { Octokit } from "@octokit/rest";

dotenv.config();

const app = express(); // Initialize Express app
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes
app.use(cors()); // Enable CORS for all routes

// Helper function to filter out HTML content in the video title
const sanitizeHTML = (text) => text.replace(/<[^>]*>?/gm, "");

// Helper function to fetch image as binary data
const fetchImageAsBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        return `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error fetching image from ${url}:`, error);
        return null; // Return null if the image fetch fails
    }
};

const config = {
    rapidApiKey: process.env.VITE_RAPID_API_KEY,
    bilibiliSessData: process.env.VITE_BILIBILI_SESSDATA,
    openAiApiKey: process.env.VITE_OPENAI_API_KEY,
    githubApiKey: process.env.VITE_GITHUB_API_KEY,
};

// API endpoint to fetch videos from YouTube and Bilibili
app.get('/api/videos', async (req, res) => {
    const keyword = req.query.keyword; // Get the keyword from query parameters
    const videoid = req.query.videoid; // Get the videoid from query parameters
    const source = req.query.source; // Video source: YouTube or Bilibili
    const page = req.query.page || 1; // Default to page 1

    const cacheKey = `${keyword}_${page}`;
    // Check cache
    if (cache.has(cacheKey)) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json(cache.get(cacheKey)); // Return cached results
    }

    if (!keyword && (!source || !videoid)) {
        return res.status(400).json({ error: 'Keyword or videoid is required' }); // Handle missing parameters
    }

    try {
        let combinedResults = [];

        if (keyword) {
            console.log('Fetching data for keyword:', keyword);
            // YouTube API Configuration for keyword search
            const YOUTUBE_API_URL = `${YOUTUBE_SEARCH_API}?query=${keyword}&type=video&sort=views&duration=long&page=${page}`;
            // Bilibili API Configuration for keyword search
            const BILIBILI_API_URL = `${BILIBILI_SEARCH_API}?keyword=${keyword}&search_type=video&page=${page}`;

            const perPage = 5; // Results per page for arXiv
            const start = (page - 1) * perPage; // Calculate the start index for arXiv

            async function searchArxiv(perPage, start) {
                try {
                    const results = await arxiv_api.search({
                        searchQueryParams: [
                            {
                                include: [{ name: `${keyword}`, scope: 'abs' }]
                            },
                        ],
                        maxResults: perPage,
                        start: start,
                        sortBy: 'relevance',
                    });
                    return results;
                } catch (error) {
                    console.error('Error fetching data from arXiv:', error);
                }
            }

            // Initialize Octokit with GitHub API key
            const octokit = new Octokit({
                auth: config.githubApiKey,
                request: { fetch }
            });

            // Search repositories based on keyword
            async function searchRepos(page = 1) {
                try {
                  const response = await octokit.rest.search.repos({
                    q: `${keyword}`,
                    sort: 'stars',
                    order: 'desc',
                    per_page: 10,
                    page: page
                  }
                );
                return response.data.items;
                } catch (error) {
                  console.error(`Error: ${error}`);
                }
              }
                         

            // Fetch data from YouTube and Bilibili concurrently
            const [arxivData, githubData, youtubeResponse, bilibiliResponse] = await Promise.all([
                searchArxiv(perPage, start),
                searchRepos(page),
                fetch(YOUTUBE_API_URL, {
                    headers: {
                        'x-rapidapi-key': config.rapidApiKey,
                        'x-rapidapi-host': 'yt-api.p.rapidapi.com',
                    },
                }),
                fetch(BILIBILI_API_URL, {
                    headers: {
                        Cookie: `SESSDATA=${config.bilibiliSessData}`,
                        Referer: 'https://www.bilibili.com',
                    },
                }),
            ]);

            // Parse the responses concurrently
            const [youtubeData, bilibiliData] = await Promise.all([
                youtubeResponse.json(),
                bilibiliResponse.json(),
            ]);
            console.log('Bili API:', BILIBILI_API_URL);
            console.log('Bilibili Data:', bilibiliData);

            // Extract video results from Bilibili response
            const bilibiliVideoData = bilibiliData.data.result
            
            console.log('Arxiv Data:', arxivData[0]);
            console.log('GitHub Data:', githubData[0]);
            console.log('YouTube Data:', youtubeData.data[0]);
            console.log('Bilibili Data:', bilibiliVideoData[0]);


            // Helper function to clean and extract a given number of words
            const cleanAndExtract = (text, wordCount) =>
                text
                ? text
                    .replace(/\n/g, " ") // Replace newlines with space
                    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
                    .trim() // Remove leading/trailing spaces
                    .split(" ") // Split into words
                    .slice(0, wordCount) // Take the specified number of words
                    .join(" ") // Join back into a string
                : "";
            
            // Generate description list for GPT
            const desclist = [
                ...arxivData.map((data) => ({
                    title: data.title,
                    description: cleanAndExtract(data.summary, 20),
                })),
                ...githubData.map((data) => ({
                    title: data.name,
                    description: cleanAndExtract(data.description, 20),
                })),
                ...youtubeData.data.map((data) => ({
                    title: data.title,
                    description: cleanAndExtract(data.description, 20),
                })),
                ...bilibiliVideoData.map((data) => ({
                    title: data.title,
                    description: cleanAndExtract(data.description, 5),
                })),
            ];
              
            // console.log('desclist:', desclist);  
            
            // parallel fetch data from GPT, YouTube and Bilibili
            const [openAIRelevanceMap, arxivResults, githubResults, youtubeResults, bilibiliResults] = await Promise.all([
                // GPT data processing
                (async () => {
                    console.time('Process gpt Results');
                    const result =  await sendToOpenAI(keyword, desclist);
                    console.timeEnd('Process gpt Results');
                    return result;
                })(),

                (async () => {
                    return Promise.all(
                        (arxivData || [])
                            .filter((paper) => paper && paper.title)
                            .map(async (paper) => ({
                                id: paper.id.replace('http://arxiv.org/abs/', 'https://arxiv.org/pdf/'),
                                title: paper.title,
                                description: paper.summary || '',
                                image: null,
                                source: 'ArXiv',
                            }))
                    );
                })(),

                (async () => {
                    return Promise.all(
                        (githubData || [])
                            .filter((repo) => repo && repo.name)
                            .map(async (repo) => ({
                                id: repo.full_name,
                                title: repo.name,
                                description: repo.description || '',
                                image: null,
                                source: 'GitHub',
                            }))
                    );
                })(),
        
                // YouTube data processing
                (async () => {
                    return Promise.all(
                        (youtubeData.data || [])
                            .filter((video) => video && video.title)
                            .map(async (video) => ({
                                id: video.videoId,
                                title: video.title,
                                description: video.description || '',
                                image: video.thumbnail?.[0]?.url || null,
                                source: 'YouTube',
                            }))
                    );
                })(),
        
                // Bilibili data processing
                (async () => {
                    console.time('Process Bilibili Results');
                    if (!bilibiliVideoData) {
                        return [];
                    }
        
                    const result =  Promise.all(
                        bilibiliVideoData.map(async (video) => ({
                                    id: video.id,
                                    title: sanitizeHTML(video.title),
                                    description: video.description || '',
                                    image: video.pic ? await fetchImageAsBase64('https:' + (video.pic).replace("https:", '')) : null,
                                    source: 'Bilibili',
                                }))
                    );
                    console.timeEnd('Process Bilibili Results');

                    return result;
                })(),
            ]);

            // Combine results from keyword search
            combinedResults = [...arxivResults, ...githubResults, ...youtubeResults, ...bilibiliResults];

            // console.log('Combined Results:', combinedResults);

            // Add relevance to the combined results
            const enrichedResults = combinedResults.map((data) => ({
                ...data,
                relevanceScore: openAIRelevanceMap.get(data.title) || 0, // Default to 0 if not found
            }));

            // Filter out videos with 0 relevance (not in OpenAI response)
            const filteredResults = enrichedResults.filter((data) => data.relevanceScore > 0);

            // Sort the filtered results based on relevance
            const finalResults = filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

            cache.set(cacheKey, finalResults);

            // Send combined results to the frontend
            res.send(finalResults);
        }

        // new version for both youtube and bilibili and their related videos
        if (source && videoid) {
            if (source === 'Bilibili') {
                console.log('Fetching related videos for Bilibili videoid:', videoid);

                const BILIBILI_SINGLE_VIDEO_API = `${BILIBILI_RELATED_VIDEO_API}?aid=${videoid}`;
                const BILIBILI_THIS_VIDEO_API = `${BILIBILI_VIDEO_INFO_API}?aid=${videoid}`;

                const [relatedResponse, singleResponse] = await Promise.all([
                    fetch(BILIBILI_SINGLE_VIDEO_API, {
                        headers: {
                            Cookie: `SESSDATA=${config.bilibiliSessData}`,
                        },
                    }),
                    fetch(BILIBILI_THIS_VIDEO_API, {
                        headers: {
                            Cookie: `SESSDATA=${config.bilibiliSessData}`,
                        },
                    }),
                ]);
                
                const singleData = await singleResponse.json();
                const relatedData = await relatedResponse.json();
                // Process single video data
                let single = null;
                if (singleData?.data) {
                    const video = singleData.data;
                    single = {
                        id: video.aid.toString(),
                        title: sanitizeHTML(video.title),
                        description: video.desc || '',
                        image: video.pic ? await fetchImageAsBase64('https:' + (video.pic).replace("http:", '')) : null,
                        viewCount: video.stat?.view.toString() || '0',
                        likeCount: video.stat?.like.toString() || '0',
                        pubDate: video.pubdate ? new Date(video.pubdate * 1000).toISOString().split('T')[0] : '',
                        tags: video.tname ? video.tname.split('·').map(tag => `#${tag.trim()}`).join(' ') : '',
                        author: {
                            name: video.owner?.name || '',
                            authorId: video.owner?.mid || '',
                            authorIcon: video.owner?.face || '',
                        },
                        source: 'Bilibili',
                    };
                }
                // Process related videos
                let recommend = [];
                if (relatedData?.data) {
                    recommend = relatedData.data.map(video => ({
                        id: video.aid.toString(),
                        title: sanitizeHTML(video.title),
                        description: video.desc || '',
                        image: video.pic ? `https:${video.pic.replace("http:", "")}` : null,
                        source: 'Bilibili',
                        pubDate: video.pubdate ? new Date(video.pubdate * 1000).toISOString().split('T')[0] : '',
                        tags: video.tname ? video.tname.split('·').map(tag => `#${tag.trim()}`).join(' ') : '',
                        // tags: video.tname.split('·').map(tag => ({ name: tag })),
                    }));
                }

                const result = {
                    single,
                    recommend,
                };
                return res.json(result);

            } else if (source === 'YouTube') {
                console.log('Fetching related videos for YouTube videoid:', videoid);

                const YOUTUBE_SINGLE_VIDEO_API = `${YOUTUBE_RELATED_VIDEO_API}?id=${videoid}`;
                const YOUTUBE_THIS_VIDEO_API = `${YOUTUBE_VIDEO_INFO_API}?id=${videoid}`;
                // const response = await fetch(YOUTUBE_SINGLE_VIDEO_API, {
                //     headers: {
                //         'x-rapidapi-key': config.rapidApiKey,
                //         'x-rapidapi-host': 'yt-api.p.rapidapi.com',
                //     },
                // });
                const [singleResponse, response] = await Promise.all([
                    fetch(YOUTUBE_THIS_VIDEO_API, {
                        headers: {
                            'x-rapidapi-key': config.rapidApiKey,
                            'x-rapidapi-host': 'yt-api.p.rapidapi.com',
                        },
                    }),
                    fetch(YOUTUBE_SINGLE_VIDEO_API, {
                        headers: {
                            'x-rapidapi-key': config.rapidApiKey,
                            'x-rapidapi-host': 'yt-api.p.rapidapi.com',
                        },
                    }),
                ]);

                const singleData = await singleResponse.json();
                const data = await response.json();
                let single = null;
                if (data?.meta) {
                    const video = data.meta;
                    single = {
                        id: video.videoId,
                        title: sanitizeHTML(video.title),
                        description: video.description || '',
                        image: singleData.thumbnail?.[0]?.url || null,
                        viewCount: video.viewCount || 0,
                        likeCount: video.likeCount || 0,
                        pubDate: video.publishDate || '',
                        tags: video.superTitle || '',
                        author: {
                            name: video.channelHandle || '',
                            authorId: video.channelId || '',
                            authorIcon: video.channelThumbnail?.[0]?.url || '',
                        },
                        source: 'YouTube',
                    };
                }
                let recommend = [];
                if (data?.data) {
                    recommend = data.data.map((video) => ({
                        id: video.videoId,
                        title: sanitizeHTML(video.title),
                        description: video.description || '',
                        image: video.thumbnail?.[0]?.url || null,
                        source: 'YouTube',
                        pubDate: video.publishDate || '',
                    }));
                }

                const result = {
                    single,
                    recommend,
                };
                return res.json(result);
            }
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: error.message });
    }
});

const sendToOpenAI = async (query, descData) => {
    const BATCH_SIZE = 10; // batch size for parallel processing
    const batches = [];

    for (let i = 0; i < descData.length; i += BATCH_SIZE) {
        const batchData = descData.slice(i, i + BATCH_SIZE);
        batches.push(
            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${config.openAiApiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: `${GPT_SYSTEM_PROMPT}` },
                        {
                            role: "user",
                            content: `${GPT_FILTER_PROMPT(query, JSON.stringify(batchData))}`,
                        },
                    ],
                    temperature: 0.2
                }),
            }).then((res) => res.json())
        );
    }

    // Wait for all batches to complete
    const results = await Promise.all(batches);
    // console.log('Results:',results[0].choices[0].message.content.replace(/```json|```/g, '').trim());

    // Combine results from all batches
    const relevanceMap = new Map();
    results.forEach((result) => {
        const batchResults = JSON.parse(result.choices[0].message.content.replace(/```json|```/g, '').trim());
        batchResults.forEach((video) => {
            relevanceMap.set(video.title, video.relevanceScore);
        });
    });

    return relevanceMap;
};

// Start the server
app.listen(3000, () => {
    console.log('Proxy server running on http://127.0.0.1:3000/');
});