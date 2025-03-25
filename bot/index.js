require("dotenv").config();
const { Telegraf } = require("telegraf");
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { BOT_TOKEN, SERVER_URL } = process.env;


const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const URI = `/webhook/${BOT_TOKEN}`;
const WEBHOOK_URL = `${SERVER_URL}${URI}`;

const bot = new Telegraf(BOT_TOKEN);

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
    console.log(res.data);
};

app.use(express.json());
app.use(bodyParser.json());

app.listen(port, async () => {
    console.log('App is running on port', port);
    await init();
});

const web_link = "https://basxbot.netlify.app"; 
const community_link = "https://t.me/tracexweb3";
const dm = "https://t.me/tracexpro";

bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;

    ctx.replyWithMarkdown(`*Hey, ${userName}! Welcome to Tracex Bot!*
    
Unlock exclusive airdrops and start mining $TRACEX cryptocurrency with ease 🔓.
    
Earn $TRACEX tokens daily and convert them into USDT or other top assets like BNB, SOL, and more 💰.

Invite your friends, family, and colleagues to join the game 🤑.
    
If you want to purchase this bot's source code, feel free to contact @tracexpro`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Play Now! 🎮", web_app: { url: urlSent } }],
                [{ text: "Join our Community ❤️ ", url: community_link }],
                [{ text: "Buy Tracex Bot 🤖", url: dm }],
            ],
        },
    });
});

app.get("/", async (req, res) => {
    res.send("Hello Get me here I work fine!");
});

app.post(URI, (req, res) => {
    bot.handleUpdate(req.body);
    res.status(200).send('Received Telegram Webhook');
});

app.get('/webhook', (req, res) => {
    res.send('Hey, Bot is Awake!');
});
