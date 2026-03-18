const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ডেটাবেস ফাইল লোড করা
let chatData = {};
try {
    const data = fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8');
    chatData = JSON.parse(data);
} catch (err) {
    console.error("ডেটাবেস ফাইল লোড করতে সমস্যা হচ্ছে:", err);
}

app.get('/baby', (req, res) => {
    const userText = req.query.text ? req.query.text.trim().toLowerCase() : "";

    if (!userText) {
        return res.status(400).json({ error: "Please provide a query (text=...)" });
    }

    // উত্তর খোঁজার লজিক (হাজার হাজার ডেটার মধ্যে দ্রুত কাজ করবে)
    let foundAnswer = "আমি এখনো এটি শিখিনি, আমাকে শেখাতে পারেন!";

    // হুবহু মিললে উত্তর দিবে
    if (chatData[userText]) {
        foundAnswer = chatData[userText];
    } else {
        // কিওয়ার্ড ম্যাচিং (যদি পুরোটা না মিলে)
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

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
