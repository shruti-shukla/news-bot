const NewsAPI = require('newsapi');
require('dotenv').config()
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);


const getTopHeadlines = async (sources?: string, query?: string, category?: string, language?: string, country?: string) => {
    try {
        let res:any;
        if (sources) { //sources cannot be called with category/country according to newsAPI docs
            res = await newsapi.v2.topHeadlines({
                sources: sources,
                language: (language && language != "-") ? language : 'en',
            });
        }
        else {
            res = await newsapi.v2.topHeadlines({
                q: (query && query != "-") ? query : '',
                language: (language && language != "-") ? language : 'en',
                category: (category && category != "-") ? category : '',
                country: (country && country != "-") ? country : 'in'
            });
        }
        return res;
    } catch (error) {
        console.error(error);
        return "Something went wrong, please check your query or try again later."
    }
};

export {getTopHeadlines};