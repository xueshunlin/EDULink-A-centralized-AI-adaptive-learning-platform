// these apis are used to fetch data from youtube and bilibili in the search page
export const YOUTUBE_SEARCH_API = "https://yt-api.p.rapidapi.com/search"
export const BILIBILI_SEARCH_API = "https://api.bilibili.com/x/web-interface/search/type"
// export const BILIBILI_SEARCH_INFO_API = "https://api.bilibili.com/x/player/pagelist"
// these apis are used to fetch data from youtube and bilibili in the video player page
export const YOUTUBE_RELATED_VIDEO_API = "https://yt-api.p.rapidapi.com/related"
export const YOUTUBE_VIDEO_INFO_API = "https://yt-api.p.rapidapi.com/video/info"
export const BILIBILI_RELATED_VIDEO_API = "https://api.bilibili.com/x/web-interface/archive/related"
export const BILIBILI_VIDEO_INFO_API = "https://api.bilibili.com/x/web-interface/view"
// these prompts are used to generate the prompt for the GPT ranking search results
export const GPT_SYSTEM_PROMPT = "You are an assistant tasked with filtering and sorting video resources for an educational platform. Your goal is to ensure that only videos relevant to the specified academic topic are retained."
export const GPT_FILTER_PROMPT = (topic, videoData) => `
##Topic: 
${topic}

##Input Data: 
${videoData}

##Task: 
   1. Filter out sources that are irrelevnat to the education or self-study based on its title and description.
   2. Analyze the relevance of each resource to the given subject.
   3. Assign a relevance score between 1 (low relevance) to 10 (high relevance).
   4. Exclude resources with a relevance score below 3.
   5. Sort the remaining videos in descending order of relevance.

## Response Format
[
    {
        "title": "string",
        "relevanceScore": number
    },
    ...
]

## Note
There is no preference for any language, treat them equally.

##Action
Ensure that your evaluation focuses on academic and educational alignment to the topic, and give your result of filering STRICTLY in the required JSON format`

export const GPT_TRENDING_FIELD_SYSTEM_PROMPT = `You are a research assistant tasked with identifying the most popular and emerging fields in the academic world. Your goal is to provide a list of the top 12 fields in descending order of popularity based on the given topic.`

export const GPT_TRENDING_FIELD_PROMPT = (topic) => `
##Topic:
${topic}

##Task:
   1. Based on your latest knowledge, identify the most popular and emerging fields in the academic world of the given topic.
   3. Provide at most 4 words for the description of each field.
   4. List the top 12 fields in descending order of popularity.

##Response Format

{
        "field": [field A, field B, field C, field D, field E]
}

##Action
Ensure to focuses on the academic and educational alignment to the topic, and give your result of filering STRICTLY in the required JSON format`

export const GPT_RECOMMENDATION_SYSTEM_PROMPT = `You are a assistant handling with search autocompletion, providing educational suggestions based on the user's input.`

export const GPT_RECOMMENDATION_PROMPT = (keyword) => `
##Task
Based on the given input, provide 10 relevant keyword suggestions that expand on the user's input. Each suggestion should:
1. Be directly related to the input.
2. Focus on educational content.
3. Start with the text the user entered.

##User input
${keyword}

##Response Format

{
        "keyword": [suggest1, ...]
}

##Action
Ensure your suggestion focues on the acdemic and aducational topics, and give your result of filering STRICTLY in the required JSON format`