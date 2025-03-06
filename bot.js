const TelegramBot = require('node-telegram-bot-api'); 
const axios = require('axios');

const token = '7849063293:AAFzEOf3wBx3gVUuYezF3zONydAZFtfBBMU';
const targetBotToken = '7713850071:AAFim6SlR6jXROOZbxSLKUNo2myMXWaVi8M';
const targetChatId = '7188214047';

const bot = new TelegramBot(token, { polling: true });
let userSteps = {};
let userData = {};
let userLang = {};

// 🚀 Start bosilganda til tanlash
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userSteps[chatId] = 'start';
    userLang[chatId] = null;

    bot.sendMessage(chatId, "🌍 Tilni tanlang:", {
        reply_markup: {
            keyboard: [["🇺🇿 O'zbek", "🇷🇺 Русский"]],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

// 🚀 Til tanlanganda asosiy menyu chiqadi
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "🇺🇿 O'zbek") {
        userLang[chatId] = 'uz';
        showMainMenu(chatId);
    } else if (text === "🇷🇺 Русский") {
        userLang[chatId] = 'ru';
        showMainMenu(chatId);
    } else if (text === "🌍 Tilni o‘zgartirish" || text === "🌍 Сменить язык") {
        bot.sendMessage(chatId, "🌍 Tilni tanlang:", {
            reply_markup: {
                keyboard: [["🇺🇿 O'zbek", "🇷🇺 Русский"]],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});

// 🚀 Asosiy menyu
function showMainMenu(chatId) {
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: {
            welcome: "🔥 Assalomu alaykum! \n📚 *Mening botimga *  xush kelibsiz!\n\n🏆 Salom ismim ag'zamxo'ja men sizga IT xizmatlarini taklif qilaman!\n\nPastdagi menyudan tanlang:",
            courses: "📚 Xizmatlar",
            about: "ℹ️ Biz haqimizda 🌐",
            contact: "📞 Biz bilan bog‘lanish",
            location: "📍 Lokatsiya",
            change_lang: "🌍 Tilni o‘zgartirish"
        },
        ru: {
            welcome: "🔥 Здравствуйте! \n📚 Добро пожаловать в *мой* бот!\n\n🏆 Здравствуйте, меня зовут Азамхожа, предлагаю Вам IT-услуги!\n\nВыберите из меню ниже:",
            courses: "📚 Услуги",
            about: "ℹ️ О нас 🌐",
            contact: "📞 Связаться с нами",
            location: "📍 Локация",
            change_lang: "🌍 Сменить язык"
        }
    };

    bot.sendMessage(chatId, messages[lang].welcome, {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                [messages[lang].courses, { text: messages[lang].about, web_app: { url: "https://ismatxojayev.netlify.app/" }}],
                [messages[lang].contact, messages[lang].location],
                [messages[lang].change_lang]
            ],
            resize_keyboard: true
        }
    });
}
// 📚 Kurslar ro‘yxati
function showCourses(chatId) {
    const lang = userLang[chatId] || 'uz';
    const messages = {
        uz: "📚 Xizmatlardan \n birini tanlang:",
        ru: "📚 Выберите одну из \n служб:"
    };

    bot.sendMessage(chatId, messages[lang], {
        reply_markup: {
            inline_keyboard: [
                [{ text: "💻 Web sayt yaratish", callback_data: "Web_sayt_yaratish" }, { text: "🖥 Telegramm bot yaratish", callback_data: "Telegramm_bot_yaratish" }],
                [{ text: "📐 Sayt o'zgartirish kiritish", callback_data: "Sayt_o'zgartirish_kiritish" }, { text: "📜 Web ilova yaratish", callback_data: " Web_ilova_yaratish" }]
            ]
        }
    });
}
// 📚 Kurslar
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const course = query.data;

    userSteps[chatId] = 'waiting_for_name';
    userData[chatId] = { course };

    const lang = userLang[chatId] || 'uz';
    const messages = {
        uz: "👤 Ismingizni kiriting:",
        ru: "👤 Введите ваше имя:"
    };

    bot.sendMessage(chatId, messages[lang]);
});





bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const lang = userLang[chatId] || 'uz';

    if (userSteps[chatId] === 'waiting_for_name') {
        userData[chatId].name = text;
        userSteps[chatId] = 'waiting_for_phone';
        
        const messages = {
            uz: "📞 Telefon raqamingizni yuboring (yoki pastdagi tugmadan foydalaning):",
            ru: "📞 Отправьте ваш номер телефона (или используйте кнопку ниже):"
        };

        bot.sendMessage(chatId, messages[lang], {
            reply_markup: {
                keyboard: [[{ text: "📲 Telefon raqamni yuborish", request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } else if (userSteps[chatId] === 'waiting_for_phone') {
        if (msg.contact) {
            userData[chatId].phone = msg.contact.phone_number;
        } else {
            userData[chatId].phone = text;
        }

        const { course, name, phone } = userData[chatId];

        const targetMessage = `📌 IT xizmat\n\n📚 Kurs: ${course}\n👤 Ism: ${name}\n📞 Telefon: ${phone}`;

        await axios.post(`https://api.telegram.org/bot${targetBotToken}/sendMessage`, {
            chat_id: targetChatId,
            text: targetMessage
        });

        const messages = {
            uz: "✅  IT xizmatga yozildingiz! Tez orada operatorimiz siz bilan bog‘lanadi.",
            ru: "✅ Вы подписались на IT-услугу! Наш оператор скоро с вами свяжется."
        };

        bot.sendMessage(chatId, messages[lang]);
        showMainMenu(chatId);
    }
});
