# CV vs Job Spec Analyser

Paste your CV and a job description, get an honest breakdown of how well you match — and whether it's actually worth applying or just a reword job.

## What it tells you

- **Match %** — how much of the spec your CV already covers
- **Vibes %** — how much of the spec is corporate fluff ("passionate", "self-starter", "dynamic") vs real requirements
- **Easy wins** — places where you probably have the skill but your CV doesn't use their words
- **Genuine gaps** — stuff you actually don't have (honest nopes, not panic material)
- **Full breakdown** — every requirement listed with whether it's a real skill or a vibe, and whether you match, need a reword, or are missing it

## Before you start

You'll need a free Anthropic API key: https://console.anthropic.com

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/cw4444/cv-analyzer.git
   cd cv-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Create a file called `.env.local` in the root folder and add:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```
   Replace `your-key-here` with your actual Anthropic API key.

4. **Run it**
   ```bash
   npm run dev
   ```

5. **Open your browser and go to** http://localhost:3000

## How to use it

1. Paste your CV into the left box
2. Paste the job description into the right box
3. Hit **Analyse**
4. Read the results, update your CV on the easy wins, decide if the gaps are dealbreakers

That's it. No sign up, no data stored, everything runs locally.

