const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = "mongodb+srv://tamim-khan:019283t%40t@bby.cqclzt3.mongodb.net/?retryWrites=true&w=majority&appName=bby";

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas ✅"))
    .catch(err => console.log("Database Error: ", err));

const replySchema = new mongoose.Schema({
    question: { type: String, unique: true, required: true },
    answers: [String]
});
const Reply = mongoose.model('Reply', replySchema);

app.get('/', (req, res) => res.send("Baby API Live! 🚀"));

app.get('/baby', async (req, res) => {
    const { text, teach, reply } = req.query;
    if (teach && reply) {
        try {
            const ques = teach.toLowerCase().trim();
            const ans = reply.trim();
            let data = await Reply.findOne({ question: ques });
            if (data) {
                if (!data.answers.includes(ans)) {
                    data.answers.push(ans);
                    await data.save();
                }
            } else {
                await Reply.create({ question: ques, answers: [ans] });
            }
            return res.json({ status: "success", message: "✅ শিখেছি!" });
        } catch (e) { return res.status(500).json({ error: "Error" }); }
    }
    if (text) {
        try {
            const input = text.toLowerCase().trim();
            let data = await Reply.findOne({ question: input });
            if (data) {
                const randomReply = data.answers[Math.floor(Math.random() * data.answers.length)];
                return res.json({ reply: randomReply });
            } else {
                const simRes = await axios.get("https://api.simsimi.net/v2/?text=" + encodeURIComponent(input) + "&lc=bn");
                return res.json({ reply: simRes.data.success });
            }
        } catch (e) { return res.json({ reply: "সার্ভার একটু বিজি!" }); }
    }
    res.json({ message: "Welcome" });
});

app.listen(3000, () => console.log("Server started on port 3000"));
