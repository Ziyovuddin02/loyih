const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Bot tokeningizni shu yerga yozing
const token = '6525215749:AAGE_UO5FAHH5-8tCA68uXgyOP93NAsJ6ak';
const targetBotToken = '8007247318:AAF3EGrcSTFwz0dmsUg3uoDjeZy8jS77HLM'; // Ma'lumot yuboriladigan bot
const targetChatId = '1514472577'; // Ma'lumot yuboriladigan chat ID

// Botni ishga tushiramiz
const bot = new TelegramBot(token, { polling: true });

let userSteps = {};
let userData = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userSteps[chatId] = 'choosing_course';
    bot.sendMessage(chatId, "Assalomu alaykum! \nBiznes Fabrika o'quv markaziga xush kelibsiz! Qaysi kurslarimizga qiziqish bildirmoqchisiz??", {
        reply_markup: {
            keyboard: [
                ["IT dasturlash", "Kompyuter savodxonligi"],
                ["Bugalteriya", "Uy hamshiraligi"],
                ["Masajj kursi", "Qandolatchilik"]
                ["Arab tili", "Ingliz tili"],
                ["Koryes tili", "Rus tili"],
                ["Matematika", "Tarix"]
                ["Fizika", "Mental arifmetrika"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (userSteps[chatId] === 'choosing_course' && text !== "/start") {
        userSteps[chatId] = 'asking_name';
        userData[chatId] = { kurs: text, sana: new Date().toLocaleString() };
        bot.sendMessage(chatId, `Siz \"${text}\" kursini tanladingiz!\nIltimos, ismingizni kiriting. \nMisol uchun Ziyovuddin`);
    } else if (userSteps[chatId] === 'asking_name') {
        userSteps[chatId] = 'asking_phone';
        userData[chatId].ism = text;
        bot.sendMessage(chatId, `Rahmat, ${text}! Endi iltimos, telefon raqamingizni yuboring.`, {
            reply_markup: {
                keyboard: [[{ text: "📞 Telefon raqamni yuborish", request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } else if (msg.contact) {
        userData[chatId].telefon = msg.contact.phone_number;
        bot.sendMessage(chatId, "Sizning ma'lumotlaringiz qabul qilindi! Tez orada siz bilan bog'lanamiz. Rahmat!", {
            reply_markup: { remove_keyboard: true }
        });

        // Ma'lumotni boshqa botga yuborish
        const message = `📌 *Yangi ro'yxatga olish*\n\n📅 Sana: ${userData[chatId].sana}\n📚 Kurs: ${userData[chatId].kurs}\n👤 Ism: ${userData[chatId].ism}\n📞 Telefon: ${userData[chatId].telefon}`;
        axios.post(`https://api.telegram.org/bot${targetBotToken}/sendMessage`, {
            chat_id: targetChatId,
            text: message,
            parse_mode: 'Markdown'
        }).catch(err => console.error('Xatolik yuz berdi:', err));
        
        delete userSteps[chatId];
        delete userData[chatId];
    }
});
