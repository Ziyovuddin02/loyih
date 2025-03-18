
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6525215749:AAGE_UO5FAHH5-8tCA68uXgyOP93NAsJ6ak';
const targetBotToken = '8007247318:AAF3EGrcSTFwz0dmsUg3uoDjeZy8jS77HLM'; // Ma'lumot yuboriladigan bot
const targetChatId = '1514472577'; // Ma'lumot yuboriladigan chat ID

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
function showKeyboardOnly(chatId) {
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: {
            courses: "📚 Kurslar",
            about: "ℹ️ Biz haqimizda 🌐",
            contact: "📞 Biz bilan bog‘lanish",
            location: "📍 Lokatsiya",
            change_lang: "🌍 Tilni o‘zgartirish"
        },
        ru: {
            courses: "📚 Курсы",
            about: "ℹ️ О нас 🌐",
            contact: "📞 Связаться с нами",
            location: "📍 Локация",
            change_lang: "🌍 Сменить язык"
        }
    };

    bot.sendMessage(chatId, "🔽 Pastdan menyuni tanlang:", {
        reply_markup: {
            keyboard: [
                [messages[lang].courses, { text: messages[lang].about, web_app: { url: "https://biznesfabrika.netlify.app/" }}],
                [messages[lang].contact, messages[lang].location],
                [messages[lang].change_lang]
            ],
            resize_keyboard: true
        }
    });
}

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
            welcome: "🔥 Assalomu alaykum! \n📚 *Biznes Fabrika* o'quv markaziga xush kelibsiz!\n\n🏆 Biz sizga sifatli va hamyonbop ta'limni taklif etamiz! 🎓\n\nPastdagi menyudan tanlang:",
            courses: "📚 Kurslar",
            about: "ℹ️ Biz haqimizda 🌐",
            contact: "📞 Biz bilan bog‘lanish",
            location: "📍 Lokatsiya",
            change_lang: "🌍 Tilni o‘zgartirish"
        },
        ru: {
            welcome: "🔥 Здравствуйте! \n📚 Добро пожаловать в *Biznes Fabrika* учебный центр!\n\n🏆 Мы предлагаем вам качественное и доступное образование! 🎓\n\nВыберите из меню ниже:",
            courses: "📚 Курсы",
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
                [messages[lang].courses, { text: messages[lang].about, web_app: { url: "https://biznesfabrika.netlify.app/" }}],
                [messages[lang].contact, messages[lang].location],
                [messages[lang].change_lang]
            ],
            resize_keyboard: true
        }
    });
}

// 📚 Kurslar
bot.onText(/📚 Kurslar|📚 Курсы/, (msg) => {
    const chatId = msg.chat.id;
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: "📚 Kurslarimizga yozilish uchun \nFanlardan birini tanlang:",
        ru: "📚 Запишитесь на наши курсы \nВыберите один из предметов:",
    };

    
    const courses = {
        uz: [
            [{ text: "💻 IT dasturlash", callback_data: "IT_dasturlash" }, { text: "🖥 Kompyuter savodxonligi", callback_data: "Kompyuter_savodxonligi" }],
            [{ text: "🧑‍💻 Kiberxavfsizlik", callback_data: "Kiberxavfsizlik" }, { text: "🫰 Pochemuchka", callback_data: "Pochemuchka" }],
            [{ text: "📊 Bugalteriya", callback_data: "Bugalteriya" }, { text: "🏥 Uy hamshiraligi", callback_data: "Hamshiralik" }],
            [{ text: "💊 Farmaseftika", callback_data: "Farmaseftika" }, { text: "💆‍♂️ Masajj kursi", callback_data: "Masajj" }],
            [{ text: "🧑‍🔬 Biologiya", callback_data: "Biologiya" }, { text: "📖 Arab tili", callback_data: "Arab" }],
            [{ text: "🇬🇧 Ingliz tili", callback_data: "Ingliz" }, { text: "📚 IELTS", callback_data: "IELTS" }],
            [{ text: "🇷🇺 Rus tili", callback_data: "Rus" }, { text: "🇰🇷 Koreys tili", callback_data: "Koreys" }],
            [{ text: "📐 Matematika", callback_data: "Matematika" }, { text: "📜 Tarix", callback_data: "Tarix" }],
            [{ text: "🧪 Kimyo", callback_data: "Kimyo" }, { text: "👨‍🍳 Pazandachilik", callback_data: "Pazandachilik" }],
            [{ text: "🧵 Tikuvchilik", callback_data: "Tikuvchilik" }, { text: "🧠 Mental arifmetika", callback_data: "Mental_arifmetika" }],
            [{ text: "🏫 Prezident maktabiga tayyorlov", callback_data: "Prezident_maktabi" }]
        ],
        ru: [
            [{ text: "💻 Программирование", callback_data: "IT_dasturlash" }, { text: "🖥 Компьютерная грамотность", callback_data: "Kompyuter_savodxonligi" }],
            [{ "text": "🧑‍💻 Кибербезопасность", "callback_data": "Кибербезопасность" }, { "text": "🫰 Почемучка", "callback_data": "Почемучка" }],
            [{ text: "📊 Бухгалтерия", callback_data: "Bugalteriya" }, { text: "🏥 Медсестра на дому", callback_data: "Hamshiralik" }],
            [{ text: "💊 Фармацевтика", callback_data: "Farmaseftika" }, { text: "💆‍♂️ Курс массажа", callback_data: "Masajj" }],
            [{ text: "🧑‍🔬 Биология", callback_data: "Biologiya" }, { text: "📖 Арабский язык", callback_data: "Arab" }],
            [{ text: "🇬🇧 Английский язык", callback_data: "Ingliz" }, { text: "📚 IELTS", callback_data: "IELTS" }],
            [{ text: "🇷🇺 Русский язык", callback_data: "Rus" }, { text: "🇰🇷 Корейский язык", callback_data: "Koreys" }],
            [{ text: "📐 Математика", callback_data: "Matematika" }, { text: "📜 История", callback_data: "Tarix" }],
            [{ text: "🧪 Химия", callback_data: "Kimyo" }, { text: "👨‍🍳 Кулинария", callback_data: "Pazandachilik" }],
            [{ text: "🧵 Швейное дело", callback_data: "Tikuvchilik" }, { text: "🧠 Ментальная арифметика", callback_data: "Mental_arifmetika" }],
            [{ text: "🏫 Подготовка в Президентскую школу", callback_data: "Prezident_maktabi" }]
        ]
    };
    
   

    bot.sendMessage(chatId, messages[lang], {
        reply_markup: { inline_keyboard: courses[lang] }
    });
});

// 📚 Kurslar (Kurs tanlanganda ism so'rash)
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const kursNomi = callbackQuery.data;
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: {
            selectName: `✅ Siz *${kursNomi}* kursini tanladingiz!\n✍️ Iltimos, ismingizni kiriting.`,
        },
        ru: {
            selectName: `✅ Вы выбрали курс *${kursNomi}*!\n✍️ Пожалуйста, введите ваше имя.`,
        }
    };

    // Save the selected course and ask for the user's name
    userData[chatId] = { kurs: kursNomi, sana: new Date().toLocaleDateString() };
    userSteps[chatId] = 'asking_name';

    bot.sendMessage(chatId, messages[lang].selectName, { parse_mode: 'Markdown' });
});

// 📌 Foydalanuvchi ma’lumotlarini yig‘ish va telefon raqam so'rash
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: {
            selectPhone: `👍 Rahmat, *${text}*! 📞 Endi iltimos, telefon raqamingizni yuboring.`,
            success: "✅ Sizning ma'lumotlaringiz qabul qilindi! 🎉 Tez orada siz bilan bog'lanamiz. Rahmat!",
        },
        ru: {
            selectPhone: `👍 Спасибо, *${text}*! 📞 Теперь, пожалуйста, отправьте свой номер телефона.`,
            success: "✅ Ваши данные приняты! 🎉 Мы скоро с вами свяжемся. Спасибо!",
        }
    };

    if (userSteps[chatId] === 'asking_name') {
        userSteps[chatId] = 'asking_phone';
        userData[chatId].ism = text;

        bot.sendMessage(chatId, messages[lang].selectPhone, {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [[{ text: lang === 'uz' ? "📞 Telefon raqamni yuborish" : "📞 Отправить номер", request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });

    } else if (msg.contact) {
        userData[chatId].telefon = msg.contact.phone_number;

        bot.sendMessage(chatId, messages[lang].success);

        // **Ma'lumotni boshqa botga yuborish**
        const message = `📌 *Yangi ro'yxatga olish*\n\n📅 Sana: ${userData[chatId].sana}\n📚 Kurs: ${userData[chatId].kurs}\n👤 Ism: ${userData[chatId].ism}\n📞 Telefon: ${userData[chatId].telefon}`;

        axios.post(`https://api.telegram.org/bot${targetBotToken}/sendMessage`, {
            chat_id: targetChatId,
            text: message,
            parse_mode: 'Markdown'
        }).catch(err => console.error('Xatolik yuz berdi:', err));

        // Asosiy menyuni qayta chiqarish
         showKeyboardOnly(chatId);


        // Foydalanuvchi ma'lumotlarini o‘chirish
        delete userSteps[chatId];
        delete userData[chatId];
    }
});



// 📍 Lokatsiya / Локация
bot.onText(/📍 Lokatsiya|📍 Локация/, (msg) => {
    const chatId = msg.chat.id;
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: {
            location: "📍 O‘quv markazimiz manzili:\n📍 *Afgʻon MFY, Ziyokor ko‘chasi (Pochta yaqinida)*\n\n🗺 [Google xaritada ochish](https://www.google.com/maps/place/WQR7%2BJM5+BIZNES+FABRIKA+O%CA%BBQUV+MARKAZI,+Chinoz+Street,+%D0%A2%D0%BEshkent,+Toshkent+Viloyati/data=!4m2!3m1!1s0x38addb0049b58403:0x4a3c99a4fdf19a1?entry=gps)"
        },
        ru: {
            location: "📍 Адрес нашего учебного центра:\n📍 *Афгон МФЙ, улица Зиёкор (рядом с Почтой)*\n\n🗺 [Открыть в Google Картах](https://www.google.com/maps/place/WQR7%2BJM5+BIZNES+FABRIKA+O%CA%BBQUV+MARKAZI,+Chinoz+Street,+%D0%A2%D0%BEshkent,+Toshkent+Viloyati/data=!4m2!3m1!1s0x38addb0049b58403:0x4a3c99a4fdf19a1?entry=gps)"
        }
    };

    bot.sendLocation(chatId, 40.941581, 68.764154);
    bot.sendMessage(chatId, messages[lang].location, { parse_mode: 'Markdown', disable_web_page_preview: true });
});


// 📞 Biz bilan bog‘lanish / Связаться с нами
bot.onText(/📞 Biz bilan bog‘lanish|📞 Связаться с нами/, (msg) => {
    const chatId = msg.chat.id;
    const lang = userLang[chatId] || 'uz';

    const messages = {
        uz: "📞 Aloqa uchun:\n☎️ +998 94 988 97 01\n📧 [Biz bilan bog‘lanish](https://t.me/biznesfabrika_chinoz_admin)",
        ru: "📞 Для связи:\n☎️ +998 94 988 97 01\n📧 [Связаться с нами](https://t.me/biznesfabrika_chinoz_admin)"
    };

    bot.sendMessage(chatId, messages[lang], { parse_mode: 'Markdown' });
});



     
