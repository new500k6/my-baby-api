const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.json');

// ডাটাবেস লোড করার ফাংশন (একবার লোড করলে ভালো হয়)
let chatData = {};
function syncDatabase() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        chatData = JSON.parse(data);
    } catch (err) {
        console.error("Database error:", err);
        chatData = {};
    }
}
syncDatabase(); // স্টার্ট করার সময় লোড হবে

app.get('/baby', (req, res) => {
    const userText = req.query.text ? req.query.text.trim().toLowerCase() : "";
    
    if (!userText) {
        return res.json({ error: "Please provide text! Example: /baby?text=hi" });
    }

    let finalAnswer = "আমি আপনার কথাটি বুঝতে পারিনি। আমাকে আরও শেখান!";
    let found = false;

    // সরাসরি ম্যাচিং করার চেষ্টা (Fastest)
    if (chatData[userText]) {
        const results = chatData[userText];
        finalAnswer = Array.isArray(results) ? results[Math.floor(Math.random() * results.length)] : results;
        found = true;
    } else {
        // কিওয়ার্ড ম্যাচিং লজিক (যদি সরাসরি না পাওয়া যায়)
        for (let key in chatData) {
            if (userText.includes(key.toLowerCase())) {
                const results = chatData[key];
                finalAnswer = Array.isArray(results) ? results[Math.floor(Math.random() * results.length)] : results;
                found = true;
                break; 
            }
        }
    }

    res.json({
        success: true,
        answer: finalAnswer,
        author: "Tamim Khan"
    });
});

// নতুন কিছু শেখানোর জন্য (Teach endpoint)
app.get('/teach', (req, res) => {
    const { ask, ans } = req.query;
    if (!ask || !ans) return res.json({ error: "Format: /teach?ask=hi&ans=hello" });

    syncDatabase(); // লেটেস্ট ডাটা নিন
    if (!chatData[ask]) chatData[ask] = [];
    if (Array.isArray(chatData[ask])) {
        chatData[ask].push(ans);
    } else {
        chatData[ask] = [chatData[ask], ans];
    }

    fs.writeFileSync(dbPath, JSON.stringify(chatData, null, 2));
    res.json({ success: true, msg: "শিখিয়ে দিলেন! ধন্যবাদ।" });
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
