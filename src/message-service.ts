const sendMessageToClient = async (app: any, channel_id: any, textMessage: string, blocksMessage: string) => {

    try {
        const result = await app.client.chat.postMessage({
            text: (textMessage) ? textMessage : "Hello there!",
            channel: channel_id,
            blocks: blocksMessage,
        });
        console.log(result);
    }
    catch (error) {
        console.error(error);
    }
}
export {sendMessageToClient};
