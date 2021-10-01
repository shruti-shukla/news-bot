import SlackResource from './resource';
const { App } = require('@slack/bolt');
const news = require('./news-service');
const messageService = require('./message-service');
import { Helper } from './helper';
require('dotenv').config()

const app = new App({
  clientId: process.env.CLIENT_ID,
  appToken: process.env.APP_ID,
  clientSecret: process.env.CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

app.message(':wave:', async ({ context, say }) => {
  await say(`Hello, <@${context.user}>`);
});

app.command('/news', async ({ ack, body, client }) => {
  await ack();
  const resource: SlackResource = new SlackResource();
  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "view_search",
        title: {
          type: "plain_text",
          text: "News Bot"
        },
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Use the following options to personalize your news headlines :mag:",
              emoji: true
            }
          },
          {
            type: "input",
            block_id: "keyword",
            element: {
              type: "plain_text_input",
              action_id: "keyword_input",
              placeholder: {
                type: "plain_text",
                text: "Keyword /phrase /type \"-\" to skip"
              }
            },
            label: {
              type: "plain_text",
              text: "Keyword/Phrase"
            }
          },
          {
            type: "input",
            block_id: "category",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Choose a category",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "All"
                  },
                  value: "-"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Entertainment"
                  },
                  value: "entertainment"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Sports"
                  },
                  value: "sports"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Business"
                  },
                  value: "business"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "General"
                  },
                  value: "general"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Health",
                    emoji: true
                  },
                  value: "health"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Science"
                  },
                  value: "science"
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Technology"
                  },
                  value: "technology"
                }
              ],
              action_id: "category_select"
            },
            label: {
              type: "plain_text",
              text: "Category"
            }
          },
          {
            type: "input",
            block_id: "language",
            element: {
              type: "plain_text_input",
              action_id: "language_input",
              placeholder: {
                type: "plain_text",
                text: "Language /type \"-\" to skip, Default: English"
              }
            },
            label: {
              type: "plain_text",
              text: "Language"
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "plain_text",
                text: "Accepted languages: EN - English, DE - German, FR - French, HE - Hebrew, ES - Spanish"
              }
            ]
          },
          {
            type: "input",
            block_id: "country",
            element: {
              type: "plain_text_input",
              action_id: "country_input",
              min_length: 0,
              placeholder: {
                type: "plain_text",
                text: "Country /type \"-\" to skip, Default - India"
              }
            },
            label: {
              type: "plain_text",
              text: "Country"
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "plain_text",
                text: "Please use two letter abbreviations like: IN - India, US - United States, SG - Singapore, etc."
              }
            ]
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit"
        },
        close: {
          type: "plain_text",
          text: "Cancel"
        }
      },
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.view('news_sources', async ({ ack, body, view, client }) => {
  await ack();
  console.log("News source request submitted");
  const helper: Helper = new Helper();
  const resource: SlackResource = new SlackResource();

  let sources:string = '';

  const selected_options = view['state']['values']['source_block']['checkboxes-action']['selected_options'];

  for(let i = 0;i < selected_options.length;i+=1){
    sources += selected_options[i]["value"]+",";
  }

  sources = sources.substring(0,sources.length-1);

  let message: string = "Something went wrong, please check your query or try again later.";
  const response = await news.getTopHeadlines(sources, null, null, null, null);
  const channel_id = body['user']['id'];
  
  if (response != message) {
    console.log(response);
    const { articles } = response;
    if (articles.length > 0) {
      message = helper.createNewsHeadlinesMessage(articles);
      message = `[${resource.createBlockHeader(articles.length > 5 ? 5 : articles.length)}${message}]`;
      console.log(message);
      messageService.sendMessageToClient(app, channel_id, null, message);
    } else {
      message = "Sorry! I couldn't find any articles that match your query! Please try searching for something else or try again later."
      messageService.sendMessageToClient(app, channel_id, message, null);
    }
  } else {
    messageService.sendMessageToClient(app, channel_id, message, null);
  }

});

app.view('view_search', async ({ ack, body, view, client }) => {
  await ack();
  console.log("Search request submitted");
  let keyword: string = view['state']['values']['keyword']['keyword_input']['value'];
  let category: string = view['state']['values']['category']['category_select']['selected_option']['value'];
  let language: string = view['state']['values']['language']['language_input']['value'];
  let country: string = view['state']['values']['country']['country_input']['value'];


  console.log(keyword);
  console.log(category);
  console.log(language);
  console.log(country);

  const helper: Helper = new Helper();
  const resource: SlackResource = new SlackResource();
  let message: string = "Something went wrong, please check your query or try again later.";
  const response = await news.getTopHeadlines(null, keyword, category, language.toLowerCase().substring(0, 2), country.toLowerCase().substring(0, 2));
  const channel_id = body['user']['id'];

  if (response != message) {
    console.log(response);
    const { articles } = response;
    if (articles.length > 0) {
      message = helper.createNewsHeadlinesMessage(articles);
      message = `[${resource.createBlockHeader(articles.length > 5 ? 5 : articles.length)}${message}]`;
      console.log(message);
      messageService.sendMessageToClient(app, channel_id, null, message);
    } else {
      message = "Sorry! I couldn't find any articles that match your query! Please try searching for something else or try again later."
      messageService.sendMessageToClient(app, channel_id, message, null);
    }
  } else {
    messageService.sendMessageToClient(app, channel_id, message, null);
  }
});

app.event('app_home_opened', async ({ event, client }) => {
 
  try {
    const slackResource: SlackResource = new SlackResource();
    const result = await client.views.publish({
      user_id: event.user,
      view: slackResource.botHomeView
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.command('/top_five', async ({ command, ack, respond }) => {
  await ack();

  const helper: Helper = new Helper();
  const resource: SlackResource = new SlackResource();
  let message: string = "Something went wrong, please check your query or try again late";
  const response = await news.getTopHeadlines();
  if (response != message) {
    console.log(response);
    const { articles } = response;
    if (articles.length > 0) {
      message = helper.createNewsHeadlinesMessage(articles);
      message = `[${resource.createBlockHeader(articles.length > 5 ? 5 : articles.length)}${message}]`;
      console.log(message);
      messageService.sendMessageToClient(app, command.channel_id, null, message);
    }
    else {
      message = "Sorry! I couldn't find any articles that match your query! Please try searching for something else or try again later."
      messageService.sendMessageToClient(app, command.channel_id, message, null);
    }
  } else {
    messageService.sendMessageToClient(app, command.channel_id, message, null);
  }

  //await respond(`${command.text}`);
});

app.command('/news-sources', async ({ ack, body, client }) => {
  await ack();
  const resource: SlackResource = new SlackResource();
  try{ 
  const result = await client.views.open({
        trigger_id: body.trigger_id,
        view: resource.newsSourcesModalView});

  }catch(error){console.error()};
});

app.command('/help', async ({ command, ack, respond }) => {
  await ack();
  const resource: SlackResource = new SlackResource();
  try{
    await respond(resource.helpMsg);
  }catch(error){console.error()};
});


// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

