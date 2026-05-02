# ✉️ AI Email Drafter

An AI-powered email drafting app built with React and Claude. Just describe the email you need in plain language and get a polished draft instantly.

**Made by han han**

---

## ✨ Features

- 💬 **Chat to draft** — describe your email conversationally and AI writes it for you
- 📋 **Quick-start chips** — one-click starters for common email types (follow-up, apology, job application, etc.)
- 👀 **Live preview panel** — see your drafted email with To, Subject, and Body fields
- 📋 **Copy with one click** — grab the full draft instantly
- 🔁 **Iterate naturally** — just say "make it shorter" or "more formal" to refine

## 🚀 Getting Started

### Run on Claude.ai
No setup needed — open the `.jsx` file as an artifact in Claude.ai and it works out of the box.

### Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-email-drafter.git
   cd ai-email-drafter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your Anthropic API key**

   In `ai_email_drafter.jsx`, find the fetch call and add your key:
   ```js
   headers: {
     "Content-Type": "application/json",
     "x-api-key": "YOUR_API_KEY_HERE",
     "anthropic-version": "2023-06-01"
   }
   ```
   > ⚠️ For production, move your API key to a backend server so it's not exposed publicly.

4. **Start the app**
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

- **React** — UI framework
- **Claude API (claude-sonnet-4)** — AI email generation
- **Vanilla CSS-in-JS** — styling

## 📁 Project Structure

```
ai-email-drafter/
├── ai_email_drafter.jsx   # Main app component
└── README.md              # You're here
```

## 💡 Example Prompts

- *"Write a follow-up email to a client who hasn't responded in a week"*
- *"Apologize to my boss for missing a meeting, keep it professional but warm"*
- *"Write a cold outreach email to a potential collaborator"*
- *"Decline a job offer politely"*

## 📄 License

MIT — free to use and modify.
