const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ডেটাবেস ফাইল লোড করার ফাংশন
function loadDatabase() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("ডেটাবেস ফাইল পাওয়া যায়নি বা ভুল আছে!");
        return {};
    }
}

app.get('/baby', (req, res) => {
    const userText = req.query.text ? req.query.text.trim().toLowerCase() : "";
    const chatData = loadDatabase();

    if (!userText) {
        return res.status(400).json({ error: "অনুগ্রহ করে কিছু লিখুন (text=...)" });
    }

    let foundAnswer = "আমি এখনো এটি শিখিনি, আমাকে শেখাতে পারেন!";

    // ১. হুবহু মিললে উত্তর দিবে
    if (chatData[userText]) {
        foundAnswer = chatData[userText];
    } else {
        // ২. কিওয়ার্ড ম্যাচিং (যদি পুরো বাক্যের মধ্যে প্রশ্নটা থাকে)
        for (let key in chatData) {
            if (userText.includes(key.toLowerCase())) {
                foundAnswer = chatData[key];
                break;
            }
        }
    }

    res.json({
        success: true,
        answer: foundAnswer,
        author: "Tamim"
    });
});

// হোম পেজ
app.get('/', (req, res) => {
    res.send("<h1>Baby API is Online!</h1><p>Use: /baby?text=হাই</p>");
});

app.listen(PORT, () => {
    console.log(`এপিআই রান হচ্ছে পোর্ট: ${PORT}`);
});
