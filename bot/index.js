// require("dotenv").config();
// const { Telegraf } = require("telegraf");
// const express = require("express");
// const axios = require("axios");

// const app = express();
// const port = process.env.PORT || 3000;
// const bodyParser = require("body-parser");
// const { BOT_TOKEN, SERVER_URL } = process.env;
console.log("Current BOT_TOKEN:", BOT_TOKEN);


// const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
// const URI = `/webhook/${BOT_TOKEN}`;
// const WEBHOOK_URL = `${SERVER_URL}${URI}`;

// console.log("Webhook URL:", WEBHOOK_URL);


// const bot = new Telegraf(BOT_TOKEN);

// const init = async () => {
//     const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
//     console.log(res.data);
// };

// app.use(express.json());
// app.use(bodyParser.json());

// app.listen(port, async () => {
//     console.log('App is running on port', port);
//     await init();
// });

// const web_link = "https://basxbot.netlify.app"; 
// const community_link = "https://t.me/ostad_coin";
// const dm = "https://t.me/َAR_1007";
// // #https://t.me/ostadshajarian_bot

// bot.start((ctx) => {
//     const startPayload = ctx.startPayload;
//     const urlSent = `${web_link}?ref=${startPayload}`;
//     const user = ctx.message.from;
//     const userName = user.username ? `@${user.username}` : user.first_name;

//     ctx.replyWithMarkdown(`*سلام, ${userName}!به ربات استاد شچربان خوش اومدی!*
    
// این ارز برای یاد یود استاد شجریان و با هدف پیشرفت ایران و مردمی والا توسعه پیدا کرده 
// امید داربم که بتوانیم جامعه ای بهتر بسازیم `, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: "بازی کن 🎮", web_app: { url: urlSent } }],
//                 [{ text: "پبوستن به دورهمی ❤️ ", url: community_link }],
//                 [{ text: "پشتیبانی 🤖", url: dm }],
//             ],
//         },
//     });
// });

// app.get("/", async (req, res) => {
//     res.send("Hello Get me here I work fine!");
// });

// app.post(URI, (req, res) => {
//     bot.handleUpdate(req.body);
//     res.status(200).send('Received Telegram Webhook');
// });

// app.get('/webhook', (req, res) => {
//     res.send('Hey, Bot is Awake!');
// });


require("dotenv").config();
const { Telegraf } = require("telegraf");
const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { BOT_TOKEN, SERVER_URL } = process.env;

const bot = new Telegraf(BOT_TOKEN);

const web_link = "https://basxbot.netlify.app"; 
const community_link = "https://t.me/ostad_coin";
const dm = "https://t.me/َAR_1007";

const NETLIFY_BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/67e3c284406484e9fe60c04e";

app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('App is running on port', port);
});

bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;

    ctx.replyWithMarkdown(`*سلام, ${userName}! به ربات استاد شجریان خوش اومدی!*
    
    این ارز برای یاد استاد شجریان و با هدف پیشرفت ایران و مردمی والا توسعه پیدا کرده است. 
    امیدواریم که بتوانیم جامعه ای بهتر بسازیم.`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "بازی کن 🎮", web_app: { url: urlSent } }],
                [{ text: "پیوستن به دورهمی ❤️ ", url: community_link }],
                [{ text: "پشتیبانی 🤖", url: dm }],
            ],
        },
    });
});

// POST endpoint for the webhook
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
    // Handle Telegram webhook (if needed)
    bot.handleUpdate(req.body);

    // Trigger Netlify build hook
    try {
        const response = await axios.post(NETLIFY_BUILD_HOOK_URL, {
            // Optional: Add custom data to the Netlify webhook payload
            build_trigger: 'telegram_webhook_triggered'
        });
        console.log("Netlify Build Triggered:", response.data);
        res.status(200).send('Webhook received and Netlify build triggered');
    } catch (error) {
        console.error("Error triggering Netlify build:", error);
        res.status(500).send('Error triggering Netlify build');
    }
});

// Simple get endpoint to verify that the app is running
app.get("/", (req, res) => {
    res.send("Hello Get me here I work fine!");
});

app.get('/webhook', (req, res) => {
    res.send('Hey, Bot is Awake!');
});
