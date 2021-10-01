class SlackResource {
  readonly welcomeMsg: string = "Welcome to news bot, get latest news in slack! Start with typing /news or just use /help to know more.";
  category: string[] = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  readonly helpMsg: string = `
  Use the following commands to use the news bot!\n:arrow_right: "/news" : To fetch news matching a specific query/category/country/language.
  \n :arrow_right: "/top_five" : To fetch top five trending headlines.
  \n :arrow_right: "/news-sources" : To fetch news from selected news sources.
  `;
  createBlockHeader(numberOfArticles: number): string {
    return `{
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": ":wave: Here are the top ${numberOfArticles} news headlines you requested :rolled_up_newspaper: :sparkles:",
                "emoji": true
            }
        },
        {
            "type": "divider"
        }`;
  }



  createNewsBlock(srNo: number, title: string, desc: string, articleUrl: string, imageUrl: string, publishedAt: string): string {

    const publishedAtDate = new Date(publishedAt).toLocaleDateString();
    const numberEmojiMap = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" };

    if (title && title.indexOf(`"`) >= 0) {
      title = escape(title);
    }
    if (desc && desc.indexOf(`"`) >= 0) {
      desc = escape(desc);
    }

    const failureMsg: string = "Sorry, I couldn't find the details. Please visit the link to find out."
    const res: string = `
                ,{
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":${numberEmojiMap[srNo]}:"
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": "${imageUrl}",
                        "alt_text": "img"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": ":arrow_forward: *${title}*"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Story: ${(desc) ? desc : failureMsg}"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Read the full story :arrow_right: <${articleUrl}|here.>"
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "plain_text",
                            "text": "Published at: ${publishedAtDate}",
                            "emoji": true
                        }
                    ]
                },
                {
                    "type": "divider"
                }
        `

    return res;
  };

  escapeQuotes(str: string): string {


    return str?.replace(/"/g, '\\"');

    // while(str.indexOf(`"`) >= 0){
    //     let index = str.indexOf(`"`);
    //     if(index == 0){
    //         str = "\\"+str;
    //     }else if(index == str.length){
    //         str = str+"\\";
    //     }else{
    //         str = str.substring(0,index-1)+"\\"+str.substring(index+1);
    //     }
    // }
    // return str;
  }

  readonly botHomeView: string = `{
        "type": "home",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Welcome home, <@" + event.user + "> :house:*"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": slackResource.welcomeMsg
            }
          }
        ]
      }`;

  readonly newsHeadlinesModalView: string = `{
	"type": "modal",
	"callback_id": "view_search",
	"title": {
		"type": "plain_text",
		"text": "News Bot"
	},
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Use the following options to personalize your news headlines :mag:",
				"emoji": true
			}
		},
		{
			"type": "input",
			"block_id": "keyword",
			"element": {
				"type": "plain_text_input",
				"action_id": "keyword_input",
				"placeholder": {
					"type": "plain_text",
					"text": "Keyword /phrase /type \"-\" to skip"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Keyword/Phrase"
			}
		},
		{
			"type": "input",
			"block_id": "category",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Choose a category",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "All"
						},
						"value": "-"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Entertainment"
						},
						"value": "entertainment"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Sports"
						},
						"value": "sports"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Business"
						},
						"value": "business"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "General"
						},
						"value": "general"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Health",
							"emoji": true
						},
						"value": "health"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Science"
						},
						"value": "science"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Technology"
						},
						"value": "technology"
					}
				],
				"action_id": "category_select"
			},
			"label": {
				"type": "plain_text",
				"text": "Category"
			}
		},
		{
			"type": "input",
			"block_id": "language",
			"element": {
				"type": "plain_text_input",
				"action_id": "language_input",
				"placeholder": {
					"type": "plain_text",
					"text": "Language /type \"-\" to skip, Default: English"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Language"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Accepted languages: EN - English, DE - German, FR - French, HE - Hebrew, ES - Spanish"
				}
			]
		},
		{
			"type": "input",
			"block_id": "country",
			"element": {
				"type": "plain_text_input",
				"action_id": "country_input",
				"min_length": 0,
				"placeholder": {
					"type": "plain_text",
					"text": "Country /type \"-\" to skip, Default - India"
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Country"
			}
		}
	],
	"submit": {
		"type": "plain_text",
		"text": "Submit"
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel"
	}
}`;

  readonly newsSourcesModalView: string = `{
        "type": "modal",
        callback_id: "news_sources",
        "title": {
            "type": "plain_text",
            "text": "News Bot",
            "emoji": true
        },
        "submit": {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        "blocks": [
            {
                "type": "input",
                "block_id": "source_block",
                "element": {
                    "type": "checkboxes",
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "BBC News",
                                "emoji": true
                            },
                            "value": "bbc-news"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Bloomberg",
                                "emoji": true
                            },
                            "value": "bloomberg"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Business Insider",
                                "emoji": true
                            },
                            "value": "business-insider"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Buzzfeed",
                                "emoji": true
                            },
                            "value": "buzzfeed"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Financial Post",
                                "emoji": true
                            },
                            "value": "financial-post"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "New Scientist",
                                "emoji": true
                            },
                            "value": "new-scientist"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Google News",
                                "emoji": true
                            },
                            "value": "google-news"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Hacker News",
                                "emoji": true
                            },
                            "value": "hacker-news"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Google News (India)",
                                "emoji": true
                            },
                            "value": "google-news-in"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "Wired",
                                "emoji": true
                            },
                            "value": "wired"
                        }
                    ],
                    "action_id": "checkboxes-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Select news sources :sparkles:",
                    "emoji": true
                }
            }
        ]
    }`;

}
export default SlackResource;