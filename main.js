const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

bot.onText(/\/getpastusernames (.+)/, async (msg, match) => {

    const chatId = msg.chat.id;
    const username = match[1];

    try {
        const response = await axios({
            method: 'post',
            url: '/api/metadata/get_past_usernames',
            baseURL: 'https://toto.oz.xyz',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.API_KEY
            },
            data: {
                "user": username,
                "how": 'username'
            }
        });

        const data = response.data.data;

        let text = `Past usernames for user ${response.data.user}: \n`;
        data.forEach((usernameInfo, index) => {
            text += `${index + 1}. ${usernameInfo.username}, last checked: ${usernameInfo.last_checked}\n`;
        });

        bot.sendMessage(chatId, text);

    } catch(error) {
        console.log(error);
        bot.sendMessage(chatId, 'An error occurred while fetching past usernames!');
    }
});