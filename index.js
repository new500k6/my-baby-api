const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ডাটাবেস লোড করার ফাংশন
function loadDatabase() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database.json:", err);
        return {};
    }
}

app.get('/baby', (req, res) => {
    // ইউজারের পাঠানো টেক্সট (Query: ?text=হাই)
    const userText = req.query.text ? req.query.text.trim().toLowerCase() : "";
    const chatData = loadDatabase();

    if (!userText) {
        return res.status(400).json({ 
            error: "Please provide text! Example: /baby?text=hi" 
        });
    }

    let finalAnswer = "আমি আপনার কথাটি বুঝতে পারিনি। আমাকে আরও শেখান!";
    let found = false;

    // কিওয়ার্ড ম্যাচিং লজিক
    for (let key in chatData) {
        // যদি ইউজারের ইনপুটে ডাটাবেসের কোনো কিওয়ার্ড থাকে
        if (userText.includes(key.toLowerCase())) {
            const possibleAnswers = chatData[key];

            // যদি উত্তরগুলো একটি তালিকায় (Array) থাকে, তবে র‍্যান্ডমলি একটি বেছে নাও
            if (Array.isArray(possibleAnswers) && possibleAnswers.length > 0) {
                const randomIndex = Math.floor(Math.random() * possibleAnswers.length);
                finalAnswer = possibleAnswers[randomIndex];
            } else {
                finalAnswer = possibleAnswers; // যদি সিঙ্গেল টেক্সট থাকে
            }
            found = true;
            break; 
        }
    }

    // সুন্দর করে রেসপন্স পাঠানো
    res.json({
        success: true,
        answer: finalAnswer,
        author: "Tamim Khan",
        status: found ? "Match Found" : "Not Found"
    });
});

// হোম পেজ চেক করার জন্য
app.get('/', (req, res) => {
    res.send("Baby API is Running! Created by Tamim.");
});

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    console.log(`Test link: http://localhost:${PORT}/baby?text=হাই`);
});
