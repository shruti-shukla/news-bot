const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('08637f7ef48642e39826ea504f3b3a57');


const getTopHeadlines = async (sources?: string, query?: string, category?: string, language?: string, country?: string) => {
    try {
        const res = await newsapi.v2.topHeadlines({
            q: (query && query != "-") ? query : '',
            language: (language && language != "-") ? language : 'en',
            category: (category && category != "-") ? category : '',
            country: (country && country != "-") ? country : 'in'
        });
        return res;
    } catch (error) {
        console.error(error);
        return "Something went wrong, please check your query or try again later."
    }
};

export {getTopHeadlines};