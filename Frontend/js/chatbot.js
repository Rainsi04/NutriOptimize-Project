// ===============================================
// NUTRIOPTIMIZE CHATBOT WITH Q&A KNOWLEDGE BASE
// ===============================================

// Toggle Chat Window
document.getElementById("chatbot-button").onclick = () => {
    document.getElementById("chatbot-window").style.display = "flex";
};

document.getElementById("chatbot-close").onclick = () => {
    document.getElementById("chatbot-window").style.display = "none";
};

// Elements
const messages = document.getElementById("chatbot-messages");
const input = document.getElementById("chatbot-input");
const send = document.getElementById("chatbot-send");

// SEND MESSAGE (Button + Enter)
send.onclick = () => sendMessage();
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// -----------------------------------------------------
// 1️⃣ KNOWLEDGE BASE (Add all your Q&A here)
// -----------------------------------------------------
const KNOWLEDGE = [
    {
        q: ["hello", "hi", "hey"],
        a: "Hello! 👋 I'm your Nutri ChatGPT. How can I help you today?"
    },

    {
        q: ["diet", "food plan", "healthy diet"],
        a: "A healthy diet includes lean proteins, whole grains, fruits, vegetables, and healthy fats. Want a recipe suggestion?"
    },

    {
        q: ["recipe", "suggest a recipe", "give me a recipe"],
        a: "Sure! What type of recipe do you want? High protein, low carb, diabetic-friendly, or weight loss?"
    },

    {
        q: ["fatty liver", "liver diet"],
        a: "For fatty liver, focus on whole grains, leafy vegetables, lean proteins, and avoid sugary, oily foods."
    },

    {
        q: ["diabetes", "blood sugar"],
        a: "For diabetes, eat low glycemic index foods like oats, dal, brown rice, vegetables, and protein-rich meals."
    },

    {
        q: ["pcod", "pcos"],
        a: "For PCOD/PCOS, follow a low-carb balanced diet, avoid junk foods, increase protein intake, and prefer whole grains."
    },

    {
        q: ["recommendations", "best foods"],
        a: "I can help with Nutrition, Recipes, Meal Planning, and Disease-Based Recommendations. What would you like to know?"
    },

    {
        q: ["thank you", "thanks"],
        a: "You're welcome! 😊 Always here to help."
    },
    {
        q: ["how does disease recommendations work", "disease recommendation panel"],
        a: "The Disease Recommendation Panel shows foods and recipes based on your selected condition like diabetes, fatty liver, hypertension, or PCOS."
    },
    {
        q: ["show foods for", "foods for"],
        a: "Tell me the condition — Diabetes, Fatty Liver, PCOS, Kidney, Hypertension — and I’ll show suitable foods."
    },
    {
        q: ["open diabetes panel", "diabetes recommendations"],
        a: "Opening Diabetes Recommendations… you can check suitable foods, recipes, and diet charts."
    }
    ,
    {
    q: ["view recipe", "open recipe", "show recipe details"],
    a: "Click on any recipe to see its full ingredients, steps, calories, nutrition chart, and image."
},
{
    q: ["why recipe not opening", "recipe issue"],
    a: "If the recipe is not opening, reload the page or check if the recipe slug matches the backend route."
},
{
    q: ["show more recipes", "recommended recipes"],
    a: "Tell me your disease type or diet preference and I will suggest more recipes!"
},
{
    q: ["what can you do", "project features", "what features"],
    a: "I can guide you through Disease Recommendations, Recipe Details, Nutrition Info, Image-based Predictions, and Personalized Diet Suggestions."
},
{
    q: ["help", "how to use app", "guide me"],
    a: "Use the top menu to choose disease recommendations, upload images, or browse recipes. I can help you with any step!"
},
{
    q: ["download report", "get pdf", "download results"],
    a: "You can download your nutrition report or recipe details using the download button on the results page."
}



];

// -----------------------------------------------------
// 2️⃣ ADD MESSAGE TO UI
// -----------------------------------------------------
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

// -----------------------------------------------------
// 3️⃣ BOT REPLY WITH TYPING EFFECT
// -----------------------------------------------------
function botReply(text) {
    addMessage("Typing...", "bot");
    setTimeout(() => {
        messages.lastChild.innerText = text;
    }, 600);
}

// -----------------------------------------------------
// 4️⃣ FIND ANSWER FROM KNOWLEDGE BASE
// -----------------------------------------------------
function getAnswer(userMsg) {
    userMsg = userMsg.toLowerCase();

    for (let item of KNOWLEDGE) {
        for (let keyword of item.q) {
            if (userMsg.includes(keyword)) {
                return item.a;
            }
        }
    }

    return "I'm still learning! Try asking about diets, recipes, diseases, or health tips 😊";
}

// -----------------------------------------------------
// 5️⃣ SEND USER MESSAGE
// -----------------------------------------------------
function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const reply = getAnswer(text);
    botReply(reply);
}
