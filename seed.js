const mongoose = require('mongoose');
require('dotenv').config();

// 1. Define Schema directly in script for isolation (or import your model)
const questionSchema = new mongoose.Schema({
    question: String,
    question_id: String,
    isCheckPoint: { type: Boolean, default: false },
    options: {
        yes: { nextQuestion: { type: mongoose.Schema.Types.ObjectId, ref: "Question" } },
        no: { nextQuestion: { type: mongoose.Schema.Types.ObjectId, ref: "Question" } },
    },
});

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

const MONGO_URI = "mongodb://deepanshu:root@ac-9qz1yh2-shard-00-00.awzjbbs.mongodb.net:27017,ac-9qz1yh2-shard-00-01.awzjbbs.mongodb.net:27017,ac-9qz1yh2-shard-00-02.awzjbbs.mongodb.net:27017/Conversation_Flow_Wysa?ssl=true&replicaSet=atlas-ovje04-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const questionsData = [
    // Level 1
    { qid: "m1_q1", text: "Are you feeling mentally exhausted today?", yes: "m1_q2", no: "m1_q3", cp: false },
    
    // Level 2
    { qid: "m1_q2", text: "Did you have a stressful day at work?", yes: "m1_q4", no: "m1_q5", cp: false },
    { qid: "m1_q3", text: "Are you finding it hard to stay motivated?", yes: "m1_q6", no: "m1_q7", cp: false },
    
    // Level 3 - SET AS CHECKPOINTS (Requirement 5)
    { qid: "m1_q4", text: "Is the stress due to a heavy workload?", yes: "m1_q8", no: "m1_q9", cp: true },
    { qid: "m1_q5", text: "Is it a conflict with a colleague?", yes: "m1_q10", no: "m1_q11", cp: true },
    { qid: "m1_q6", text: "Are you lacking clear goals?", yes: "m1_q12", no: "m1_q13", cp: true },
    { qid: "m1_q7", text: "Are personal matters distracting you?", yes: "m1_q14", no: "m1_q15", cp: true },

    // Level 4
    { qid: "m1_q8", text: "Do you have more than 3 urgent tasks?", yes: "m1_q16", no: "m1_q17", cp: false },
    { qid: "m1_q9", text: "Is the deadline less than 24 hours away?", yes: "m1_q18", no: "m1_q19", cp: false },
    { qid: "m1_q10", text: "Was the conflict about a specific project?", yes: "m1_q20", no: "m1_q21", cp: false },
    { qid: "m1_q11", text: "Is this a recurring issue with them?", yes: "m1_q22", no: "m1_q23", cp: false },
    { qid: "m1_q12", text: "Do you need help prioritizing tasks?", yes: "m1_q24", no: "m1_q25", cp: false },
    { qid: "m1_q13", text: "Are you feeling bored with your routine?", yes: "m1_q26", no: "m1_q27", cp: false },
    { qid: "m1_q14", text: "Have you talked to someone about this?", yes: "m1_q28", no: "m1_q29", cp: false },
    { qid: "m1_q15", text: "Are you getting enough sleep (7+ hours)?", yes: "m1_q30", no: "m1_q31", cp: false },

    // Level 5 (Leaf Nodes)
    { qid: "m1_q16", text: "Action: Try the Pomodoro technique (25/5 min).", yes: null, no: null, cp: false },
    { qid: "m1_q17", text: "Action: Delegate one small task today.", yes: null, no: null, cp: false },
    { qid: "m1_q18", text: "Action: Focus only on the 'Must-Do' item.", yes: null, no: null, cp: false },
    { qid: "m1_q19", text: "Action: Take a 10-minute walk to clear your head.", yes: null, no: null, cp: false },
    { qid: "m1_q20", text: "Action: Schedule a quick sync for clarity.", yes: null, no: null, cp: false },
    { qid: "m1_q21", text: "Action: Write down your thoughts before talking.", yes: null, no: null, cp: false },
    { qid: "m1_q22", text: "Action: Consider involving a neutral mediator.", yes: null, no: null, cp: false },
    { qid: "m1_q23", text: "Action: Set clear boundaries for future syncs.", yes: null, no: null, cp: false },
    { qid: "m1_q24", text: "Action: Use an Eisenhower Matrix to categorize.", yes: null, no: null, cp: false },
    { qid: "m1_q25", text: "Action: Start with the absolute easiest task.", yes: null, no: null, cp: false },
    { qid: "m1_q26", text: "Action: Try a new learning course for 15 mins.", yes: null, no: null, cp: false },
    { qid: "m1_q27", text: "Action: Reward yourself after one small win.", yes: null, no: null, cp: false },
    { qid: "m1_q28", text: "Action: It's good to share. Keep the dialogue open.", yes: null, no: null, cp: false },
    { qid: "m1_q29", text: "Action: Journaling your thoughts might help.", yes: null, no: null, cp: false },
    { qid: "m1_q30", text: "Action: Great! Maintain your sleep hygiene.", yes: null, no: null, cp: false },
    { qid: "m1_q31", text: "Action: Try an early night. Sleep is medicine.", yes: null, no: null, cp: false }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Atlas...");

        await Question.deleteMany({});

        // First Pass: Create placeholders to get MongoDB ObjectIDs
        const createdDocs = [];
        for (const q of questionsData) {
            const newQ = await Question.create({
                question: q.text,
                question_id: q.qid,
                isCheckPoint: q.cp,
                options: { yes: { nextQuestion: null }, no: { nextQuestion: null } }
            });
            createdDocs.push(newQ);
        }

        // Create ID Map: question_id string -> MongoDB _id
        const idMap = {};
        createdDocs.forEach(doc => {
            idMap[doc.question_id] = doc._id;
        });

        // Second Pass: Link references
        for (const q of questionsData) {
            const update = {};
            if (q.yes) update["options.yes.nextQuestion"] = idMap[q.yes];
            if (q.no) update["options.no.nextQuestion"] = idMap[q.no];

            if (Object.keys(update).length > 0) {
                await Question.updateOne({ question_id: q.qid }, { $set: update });
            }
        }

        console.log("Successfully seeded 31 questions with Checkpoints!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();