import SlackResource from "./resource";

export class Helper {

    createNewsHeadlinesMessage(articles: any): string {
        let headlinesMessage: string = '';
        const resource = new SlackResource();
        if (articles.length > 0) { 
            let index: number = (articles.length >= 5) ? 5 : articles.length;
            for (let i = 0; i < index; i += 1) {
                const article = articles[i];
                const { title, description, url, urlToImage, publishedAt } = article;
                headlinesMessage += resource.createNewsBlock(i+1, title, description, url, urlToImage, publishedAt);
            }
        }
        return headlinesMessage;
    }
}
