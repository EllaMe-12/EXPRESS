import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OCCASIONS = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "thankyou", label: "Thank you", emoji: "🤍" },
  { id: "apology", label: "Apology", emoji: "🫶" },
  { id: "anniversary", label: "Anniversary", emoji: "✨" },
  { id: "miss-you", label: "I miss you", emoji: "🌙" },
  { id: "congratulate", label: "Congratulations", emoji: "🎉" },
  { id: "reject", label: "Say no", emoji: "🕊️" },
  { id: "comfort", label: "Comfort", emoji: "🌿" },
  { id: "reconnect", label: "Reconnect", emoji: "💌" },
  { id: "farewell", label: "Farewell", emoji: "🪽" },
  { id: "anger", label: "I'm angry", emoji: "🔥" },
  { id: "hurt", label: "I'm hurt", emoji: "🩹" },
  { id: "betrayal", label: "Betrayal", emoji: "🥀" },
  { id: "disappointment", label: "Disappointment", emoji: "🌧️" },
  { id: "boundaries", label: "Set a boundary", emoji: "🪷" },
  { id: "difficult", label: "Difficult conversation", emoji: "🕯️" },
  { id: "love", label: "I love you", emoji: "❤️" },
  { id: "encourage", label: "Encourage someone", emoji: "🌻" },
  { id: "celebrate", label: "Celebrate a moment", emoji: "🥂" },
  { id: "unsure", label: "Something else", emoji: "💭" },
];

const QUESTION_FLOWS = {
  birthday: [
    ["recipientName", "Who's celebrating?", "Their name or nickname", "text", true],
    ["relationship", "What are they to you?", "", "choice", false, ["Best friend", "Friend", "Partner", "Sibling", "Parent", "Someone special", "Other"]],
    ["birthdayDetail", "What makes them special to you?", "A little thing you love, a memory, or what comes to mind", "textarea"],
    ["birthdayWish", "What do you genuinely wish for them?", "What you hope their next year looks like", "textarea"],
  ],
  thankyou: [
    ["recipientName", "Who do you want to thank?", "Their name or how you know them", "text", true],
    ["whatTheyDid", "What did they do for you?", "Tell us what happened, in your own words", "textarea", true],
    ["whyItMatters", "Why did it mean something to you?", "How it made you feel or what it changed", "textarea"],
  ],
  apology: [
    ["recipientName", "Who are you apologizing to?", "Their name or your relationship", "text", true],
    ["whatHappened", "What happened?", "Tell us what went wrong, honestly", "textarea", true],
    ["whatYouRegret", "What do you wish you had done differently?", "What you regret or understand now", "textarea"],
    ["intention", "What do you want them to understand?", "Your intention, without making excuses", "textarea"],
  ],
  anniversary: [
    ["recipientName", "Who is this for?", "Their name or nickname", "text", true],
    ["milestone", "What are you celebrating?", "A year together, wedding anniversary, or another milestone", "text", true],
    ["meaning", "What does this relationship mean to you?", "A memory, something you admire, or how they make you feel", "textarea"],
    ["wish", "What would you like to say about the future?", "Only what you genuinely feel", "textarea"],
  ],
  "miss-you": [
    ["recipientName", "Who are you missing?", "Their name or your relationship", "text", true],
    ["whatYouMiss", "What do you miss about them?", "The conversations, their presence, a little habit...", "textarea", true],
    ["whatYouWant", "What do you wish could happen?", "Talk again, meet soon, or simply let them know", "textarea"],
  ],
  congratulate: [
    ["recipientName", "Who are you congratulating?", "Their name or nickname", "text", true],
    ["achievement", "What happened?", "Their achievement, good news, or milestone", "text", true],
    ["yourFeeling", "How do you feel about it?", "Proud, excited, happy for them, amazed...", "textarea"],
    ["personalDetail", "Anything personal you want to mention?", "Their effort, journey, or something you know about them", "textarea"],
  ],
  reject: [
    ["recipientName", "Who are you responding to?", "Their name or your relationship", "text"],
    ["whatYouDecline", "What do you need to say no to?", "An invitation, relationship, request, or opportunity", "textarea", true],
    ["reason", "Would you like to explain why?", "You can leave this blank", "textarea"],
    ["boundary", "How should it feel?", "", "choice", false, ["Kind but clear", "Gentle", "Direct", "Firm"]],
  ],
  comfort: [
    ["recipientName", "Who needs your support?", "Their name or your relationship", "text", true],
    ["situation", "What are they going through?", "Share only what you're comfortable sharing", "textarea", true],
    ["support", "What do you want them to know?", "That you're there, that you care, or something else", "textarea"],
  ],
  reconnect: [
    ["recipientName", "Who do you want to reconnect with?", "Their name or your relationship", "text", true],
    ["whatYouMiss", "What do you miss about your connection?", "A memory, your conversations, how things used to be", "textarea", true],
    ["whyDrifted", "What led to the distance?", "Optional. You don't have to explain everything", "textarea"],
    ["whatYouWant", "What are you hoping for now?", "A conversation, meeting again, or slowly rebuilding", "textarea"],
  ],
  farewell: [
    ["recipientName", "Who are you saying goodbye to?", "Their name or your relationship", "text", true],
    ["context", "What kind of goodbye is this?", "", "choice", false, ["Moving away", "Leaving a school or workplace", "Ending a relationship", "A chapter coming to an end", "Other"]],
    ["whatYouWantToSay", "What do you want them to remember?", "A memory, gratitude, or something left unsaid", "textarea", true],
  ],
  anger: [
    ["recipientName", "Who are you addressing?", "Their name or your relationship", "text"],
    ["whatHappened", "What happened that made you angry?", "Tell it as it is. You don't have to soften it.", "textarea", true],
    ["impact", "What did their actions do to you?", "What hurt, changed, or damaged your trust", "textarea", true],
    ["whatYouNeed", "What do you need them to hear now?", "Your truth, your boundary, or what happens next", "textarea"],
  ],
  hurt: [
    ["recipientName", "Who hurt you?", "Their name or your relationship", "text"],
    ["whatHappened", "What happened?", "What they said or did", "textarea", true],
    ["impact", "What has it left you feeling?", "Hurt, confused, disappointed, unseen...", "textarea", true],
    ["whatYouNeed", "What do you wish they understood?", "What you need them to hear", "textarea"],
  ],
  betrayal: [
    ["recipientName", "Who is this for?", "Their name or your relationship", "text"],
    ["whatHappened", "What happened?", "What broke your trust", "textarea", true],
    ["impact", "What has the betrayal changed for you?", "Your feelings, trust, or relationship", "textarea", true],
    ["whatYouNeed", "What do you want to say now?", "You can be honest without being polite", "textarea"],
  ],
  disappointment: [
    ["recipientName", "Who are you addressing?", "Their name or your relationship", "text"],
    ["whatHappened", "What disappointed you?", "What you expected and what happened instead", "textarea", true],
    ["impact", "Why did it matter to you?", "What it meant or how it affected you", "textarea"],
    ["whatYouNeed", "What do you want them to understand?", "What you need going forward", "textarea"],
  ],
  boundaries: [
    ["recipientName", "Who needs to hear this boundary?", "Their name or your relationship", "text"],
    ["situation", "What situation needs a boundary?", "What keeps happening or what you need to change", "textarea", true],
    ["boundary", "What do you need to make clear?", "What is and isn't okay with you", "textarea", true],
    ["tone", "How should it come across?", "", "choice", false, ["Calm and clear", "Kind but firm", "Direct", "Uncompromising"]],
  ],
  difficult: [
    ["recipientName", "Who is this conversation with?", "Their name or your relationship", "text"],
    ["situation", "What do you need to talk about?", "The situation, in your own words", "textarea", true],
    ["feeling", "What has been difficult to say?", "Your honest feelings", "textarea"],
    ["outcome", "What are you hoping will come from this?", "Understanding, clarity, change, or something else", "textarea"],
  ],
  love: [
    ["recipientName", "Who do you want to tell?", "Their name or nickname", "text", true],
    ["whatYouLove", "What do you love about them?", "A quality, a small habit, or a feeling", "textarea", true],
    ["memory", "Is there a moment that captures it?", "A memory, big or small", "textarea"],
    ["whatYouWant", "What do you want them to know?", "Whatever feels true to you", "textarea"],
  ],
  encourage: [
    ["recipientName", "Who needs encouragement?", "Their name or nickname", "text", true],
    ["situation", "What are they facing?", "What they're working through or trying to do", "textarea", true],
    ["whatYouBelieve", "What do you want them to remember?", "Something you genuinely believe about them", "textarea"],
  ],
  celebrate: [
    ["recipientName", "Who are you celebrating?", "Their name or nickname", "text", true],
    ["achievement", "What is the moment?", "The milestone, news, or little win", "textarea", true],
    ["meaning", "Why does it matter to you?", "What you feel or admire about it", "textarea"],
  ],
  unsure: [
    ["recipientName", "Who is this message for?", "Their name or your relationship", "text"],
    ["rawIntent", "What are you trying to say?", "Write it messy. It doesn't need to sound good yet.", "textarea", true],
    ["desiredFeeling", "What do you want them to feel or understand?", "Whatever matters most to you", "textarea"],
  ],
};

const COMMON_QUESTIONS = [
  {
    id: "tone",
    question: "How should it sound?",
    type: "choice",
    options: [
      "Like me, naturally",
      "Warm and heartfelt",
      "Simple and direct",
      "A little emotional",
      "Light and casual",
      "Angry and confronting",
      "Hurt and honest",
      "Cold and final",
      "Firm, with clear boundaries",
      "Disappointed, not forgiving",
    ],
  },
  {
    id: "length",
    question: "How much do you want to say?",
    type: "choice",
    options: ["A few lines", "A short paragraph", "A little more detailed"],
  },
];

const PALETTES = [
  { name: "Paper", background: "#fffaf5", text: "#302923" },
  { name: "Rose", background: "#f8e8ec", text: "#56333d" },
  { name: "Midnight", background: "#20243a", text: "#f8f3ee" },
  { name: "Sage", background: "#e8eee5", text: "#354238" },
  { name: "Blue", background: "#e7eff8", text: "#263c55" },
];

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

* { box-sizing: border-box; }

.express-app {
  min-height: 100vh;
  background: #fbf4ef;
  color: #45362f;
  font-family: "DM Sans", sans-serif;
  overflow: hidden;
}

.express-app button, .express-app input, .express-app textarea { font: inherit; }
.express-app button { cursor: pointer; }

.express-shell { max-width: 1120px; margin: auto; padding: 30px 28px 70px; }

.express-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 58px;
}

.express-logo {
  font-size: 25px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #49352f;
}

.express-logo span { color: #c58a82; }

.express-nav-note { color: #9a8178; font-size: 12px; letter-spacing: .4px; }

.express-hero { text-align: center; margin: 0 auto 34px; max-width: 720px; }

.express-eyebrow {
  display: inline-block;
  padding: 9px 15px;
  border-radius: 30px;
  background: #f2e2dc;
  color: #a7756e;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

.express-hero h1 {
  margin: 23px 0 14px;
  font-size: clamp(42px, 7vw, 72px);
  letter-spacing: -2.7px;
  line-height: 1.08;
  font-weight: 400;
  font-family: "Playfair Display", Georgia, serif;
}

.express-hero h1 em { color: #bd817a; font-weight: 400; }

.express-hero p {
  color: #987f74;
  line-height: 1.85;
  font-size: 14px;
  font-weight: 300;
}

.express-search {
  width: 100%;
  max-width: 680px;
  display: block;
  margin: 30px auto 20px;
  border: 1px solid #eadbd2;
  background: #fffdfb;
  padding: 17px 20px;
  border-radius: 18px;
  outline: none;
  color: #49352f;
  box-shadow: 0 10px 35px #6c463b08;
}

.express-search:focus, .express-field:focus { border-color: #d1a19a; }

.express-section-label {
  color: #a18a7f;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  font-weight: 600;
  margin: 32px 0 12px;
}

/* Occasion rail and arrow controls */

.express-rail-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.express-rail-arrow {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border: 1px solid #e6d5cc;
  border-radius: 50%;
  background: #fffaf6;
  color: #87675d;
  font-size: 23px;
  display: grid;
  place-items: center;
  transition: .25s ease;
  box-shadow: 0 4px 12px #6c463b08;
}

.express-rail-arrow:hover {
  background: #f2e2dc;
  border-color: #c99088;
  transform: scale(1.06);
}

.express-occasion-viewport {
  position: relative;
  overflow: hidden;
  flex: 1;
  min-width: 0;
  padding: 14px 0 20px;
  mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
}

.express-occasion-track {
  display: flex;
  width: 100%;
  gap: 17px;
  padding: 8px 16px;
  align-items: stretch;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
}

.express-occasion-track::-webkit-scrollbar { display: none; }

.express-occasion {
  flex: 0 0 142px;
  height: 184px;
  border: 1px solid #eadbd3;
  background: #fffaf6;
  border-radius: 27px;
  padding: 22px 15px;
  text-align: center;
  color: #58443b;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px #6c463b09;
}

.express-occasion:hover {
  transform: translateY(-5px);
  border-color: #d2a09a;
  box-shadow: 0 15px 30px #b77d7418;
}

.express-occasion.active {
  background: #f4e2dc;
  border-color: #c99088;
}

.express-occasion .emoji { font-size: 29px; display: block; margin-bottom: 18px; }

.express-occasion .occasion-name { font-size: 12px; font-weight: 500; line-height: 1.5; }

/* Question panel */

.express-panel {
  max-width: 700px;
  margin: 32px auto 0;
  background: #fffaf6;
  border: 1px solid #eee0d7;
  border-radius: 26px;
  padding: clamp(22px, 5vw, 42px);
  box-shadow: 0 18px 55px #49301a08;
}

.express-progress {
  height: 3px;
  background: #f0e4dc;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 28px;
}

.express-progress div {
  height: 100%;
  background: #c68f87;
  transition: width .2s;
}

.express-step { color: #ad9285; font-size: 10px; letter-spacing: 1.3px; margin-bottom: 12px; }

.express-panel h2 {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 29px;
  font-weight: 400;
  letter-spacing: -.4px;
  margin: 0 0 9px;
}

.express-panel .subhead {
  color: #9b8277;
  font-size: 13px;
  line-height: 1.8;
  margin: 0 0 25px;
  font-weight: 300;
}

.express-question { margin: 23px 0; }

.express-field {
  display: block;
  width: 100%;
  border: 1px solid #eadbd3;
  border-radius: 15px;
  padding: 14px 16px;
  outline: none;
  background: #fffdfb;
  color: #49352f;
}

.express-field.textarea { resize: vertical; min-height: 110px; line-height: 1.75; }

.express-options { display: flex; flex-wrap: wrap; gap: 9px; }

.express-option {
  border: 1px solid #eadbd3;
  background: #fffdfb;
  border-radius: 30px;
  padding: 10px 14px;
  color: #806b60;
  font-size: 12px;
  transition: .2s ease;
}

.express-option.selected {
  background: #f4e2dc;
  border-color: #c99088;
  color: #865a53;
}

.express-actions { display: flex; justify-content: space-between; gap: 10px; margin-top: 30px; }

.express-btn {
  border: 1px solid #e8d9d0;
  border-radius: 14px;
  padding: 12px 19px;
  background: #fffdfb;
  color: #725d52;
  font-weight: 500;
  font-size: 12px;
}

.express-btn.primary { background: #59443b; color: #fff8f2; border-color: #59443b; }

.express-btn:disabled { opacity: .45; cursor: not-allowed; }

.express-btn:hover:not(:disabled) { filter: brightness(.97); }

.express-error {
  color: #a84c55;
  background: #fff0ed;
  padding: 13px 15px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 16px;
}

/* Generated message */

.express-result { max-width: 780px; margin: 32px auto 0; }

.express-result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 15px;
}

.express-result-top h2 {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 25px;
  font-weight: 400;
  margin: 0;
}

.express-result-top p { color: #9b8277; font-size: 12px; margin: 6px 0 0; }

.express-message {
  width: 100%;
  min-height: 250px;
  resize: vertical;
  padding: 26px;
  border: 1px solid #eadbd3;
  border-radius: 21px;
  background: #fffdfb;
  outline: none;
  color: #49352f;
  font-size: 15px;
  line-height: 1.9;
}

.express-tools { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 16px; }

.express-palette { display: flex; gap: 10px; margin: 17px 0 8px; align-items: center; }

.express-swatch {
  width: 29px;
  height: 29px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #ddd;
  padding: 0;
}

.express-swatch.selected { box-shadow: 0 0 0 2px #c58a82; }

/* Loading */

.express-loading { text-align: center; padding: 44px 20px; }

.express-loading .spinner {
  width: 42px;
  height: 42px;
  border: 2px solid #f0e4dc;
  border-top-color: #c58a82;
  border-radius: 50%;
  margin: 0 auto 22px;
  animation: express-spin .8s linear infinite;
}

@keyframes express-spin { to { transform: rotate(360deg); } }

.express-loading h2 { margin: 0 0 8px; }

.express-loading p { color: #9b8277; font-size: 13px; line-height: 1.8; }

.express-footer {
  text-align: center;
  margin-top: 54px;
  color: #b8a69b;
  font-size: 10px;
  letter-spacing: .7px;
}

/* Four-second intro: translucent forms merge into one soft colour field */

.express-intro {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #fffaf7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: express-intro-exit .9s 3.1s cubic-bezier(.7,0,.2,1) forwards;
}

.express-intro::before {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(ellipse at 18% 30%, #e9c5b9a8 0, transparent 38%),
    radial-gradient(ellipse at 78% 68%, #d8aaa5a8 0, transparent 42%),
    radial-gradient(ellipse at 58% 8%, #f3dfd4 0, transparent 36%);
  filter: blur(28px);
  animation: express-fields 4s ease-in-out both;
}

.express-intro::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #fffaf7aa, #f2dfd855, #fffaf7aa);
  opacity: 0;
  animation: express-veil 1.2s 2.5s ease forwards;
}

.express-intro-fields {
  position: absolute;
  inset: 0;
  filter: blur(34px);
  opacity: .8;
}

.express-intro-fields i {
  position: absolute;
  display: block;
  border-radius: 46% 54% 62% 38% / 48% 42% 58% 52%;
  background: #e7c2b6a8;
  mix-blend-mode: multiply;
  animation: express-merge 3.5s ease-in-out both;
}

.express-intro-fields i:nth-child(1) {
  width: 42vw;
  height: 38vw;
  left: -10vw;
  top: -12vw;
}

.express-intro-fields i:nth-child(2) {
  width: 48vw;
  height: 42vw;
  right: -12vw;
  bottom: -18vw;
  background: #d5aaa3a0;
  animation-delay: .15s;
}

.express-intro-fields i:nth-child(3) {
  width: 30vw;
  height: 34vw;
  right: 22%;
  top: 10%;
  background: #f0d9cba8;
  animation-delay: .3s;
}

.express-intro-fields i:nth-child(4) {
  width: 32vw;
  height: 28vw;
  left: 22%;
  bottom: -12%;
  background: #e9c9bba8;
  animation-delay: .45s;
}

.express-intro-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 28px;
  animation: express-brand-in 1s .25s both;
}

.express-intro-brand {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(43px, 8vw, 75px);
  color: #5a443b;
  letter-spacing: 2px;
  font-weight: 500;
}

.express-intro-brand em { color: #c58a82; font-weight: 400; }

.express-intro-tagline {
  color: #a27d71;
  margin-top: 13px;
  font-size: 11px;
  letter-spacing: 2.2px;
  text-transform: uppercase;
}

@keyframes express-fields {
  0% { transform: scale(.8) rotate(-8deg); opacity: .3; }
  55% { transform: scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: scale(1.25) rotate(0); }
}

@keyframes express-merge {
  0% { transform: translate(0,0) scale(.65); opacity: 0; }
  35% { opacity: .9; }
  100% { transform: translate(8vw,-4vh) scale(1.2); opacity: .55; }
}

@keyframes express-veil { to { opacity: 1; } }

@keyframes express-brand-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes express-intro-exit {
  to {
    opacity: 0;
    visibility: hidden;
    transform: scale(1.025);
    pointer-events: none;
  }
}

/* Responsive */

@media(max-width: 620px) {
  .express-shell { padding: 20px 14px 45px; }
  .express-nav { margin-bottom: 38px; }
  .express-nav-note { display: none; }
  .express-occasion { flex-basis: 122px; height: 160px; border-radius: 23px; }
  .express-occasion-track { gap: 12px; padding-left: 12px; padding-right: 12px; }
  .express-hero h1 { letter-spacing: -1.7px; }
  .express-panel { border-radius: 20px; }
  .express-result-top { align-items: flex-start; }
  .express-rail-arrow { flex-basis: 32px; width: 32px; height: 32px; }
}

@media(prefers-reduced-motion: reduce) {
  .express-intro, .express-intro * {
    animation-duration: .01ms !important;
    animation-delay: 0ms !important;
  }
}
`;

function getQuestionsForOccasion(occasion) {
  return [
    ...(QUESTION_FLOWS[occasion] || QUESTION_FLOWS.unsure).map(
      ([id, question, placeholder, type, required, options]) => ({
        id,
        question,
        placeholder,
        type,
        required,
        options,
      })
    ),
    ...COMMON_QUESTIONS,
  ];
}

function getIntention(occasion, answers) {
  const meaningfulAnswers = Object.entries(answers)
    .filter(([key, value]) => value && key !== "tone" && key !== "length")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return meaningfulAnswers || `Write a ${occasion} message.`;
}

function downloadText(message, occasion) {
  const blob = new Blob([message], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `express-${occasion}-message.txt`;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadMessageCard(message, palette) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const width = 1080;
  const padding = 100;
  const fontSize = 40;
  const lineHeight = 66;
  const maxTextWidth = width - padding * 2;

  ctx.font = `${fontSize}px Georgia, serif`;

  const words = message.trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (ctx.measureText(testLine).width > maxTextWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);

  const height = Math.max(650, padding * 2 + lines.length * lineHeight + 80);

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = palette.text;
  ctx.font = `${fontSize}px Georgia, serif`;
  ctx.textBaseline = "top";

  lines.forEach((line, index) => {
    ctx.fillText(line, padding, padding + index * lineHeight);
  });

  const link = document.createElement("a");
  link.download = "express-message-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function App() {
  const [occasion, setOccasion] = useState("birthday");
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);

  const occasionTrackRef = useRef(null);

  const questions = useMemo(
    () => getQuestionsForOccasion(occasion),
    [occasion]
  );

  const currentQuestion = questions[step];

  const filteredOccasions = OCCASIONS.filter((item) =>
    item.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  function scrollOccasions(direction) {
    if (!occasionTrackRef.current) return;

    occasionTrackRef.current.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  }

  function selectOccasion(id) {
    setOccasion(id);
    setView("questions");
    setAnswers({});
    setStep(0);
    setError("");
  }

  function updateAnswer(id, value) {
    setAnswers((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  function nextStep() {
    if (
      currentQuestion?.required &&
      !String(answers[currentQuestion.id] || "").trim()
    ) {
      setError("Add a little detail before continuing, or go back and change your answer.");
      return;
    }

    setError("");

    if (step < questions.length - 1) {
      setStep((previous) => previous + 1);
    } else {
      generateMessage();
    }
  }

  function previousStep() {
    setError("");

    if (step > 0) {
      setStep((previous) => previous - 1);
    } else {
      setView("home");
    }
  }

  async function generateMessage() {
    setLoading(true);
    setView("loading");
    setError("");

    try {
      const intention = getIntention(occasion, answers);

      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, intention, answers }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `The server returned an error (${response.status}).`
        );
      }

      const generated =
        data.message || data.generatedMessage || data.text || data.result;

      if (!generated || typeof generated !== "string") {
        throw new Error("The server responded, but no message was returned.");
      }

      setMessage(generated.trim());
      setView("result");
    } catch (err) {
      setError(
        err.message ||
          "Couldn't generate your message. Please check that the backend is running."
      );
      setView("questions");
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setError("");
      alert("Message copied!");
    } catch {
      setError("Couldn't copy automatically. Select the message and copy it manually.");
    }
  }

  function startAgain() {
    setAnswers({});
    setStep(0);
    setMessage("");
    setError("");
    setSearch("");
    setView("home");
  }

  return (
    <div className="express-app">
      <style>{STYLES}</style>

      {/* Four-second dissolving introduction */}
      <div className="express-intro" aria-hidden="true">
        <div className="express-intro-fields">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="express-intro-content">
          <div className="express-intro-brand">
            EXPRESS
          </div>

          <div className="express-intro-tagline">
            Intention over occasion
          </div>
        </div>
      </div>

      <div className="express-shell">
        <nav className="express-nav">
  <a href="/" className="brand-logo" aria-label="EXPRESS Home">
    EXPRESS
  </a>

  <div className="express-nav-note">
    Heartfelt, not rehearsed.
  </div>
</nav>

        {view === "home" && (
          <>
            <header className="express-hero">
              <span className="express-eyebrow">
                Say what you really mean
              </span>

              <h1>
                Some feelings
                <br />
                deserve <em>the right words.</em>
              </h1>

              <p>
                Tell us what's on your heart.
                <br />
                We'll help you put it into words that feel like you.
              </p>
            </header>

            <input
              className="express-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Have something else on your heart? Tell us..."
              aria-label="Search message occasions"
            />

            <div className="express-section-label">
              What's on your mind?
            </div>

            {filteredOccasions.length > 0 ? (
              <div className="express-rail-wrap">
                <button
                  className="express-rail-arrow"
                  onClick={() => scrollOccasions(-1)}
                  aria-label="Scroll occasions left"
                >
                  ‹
                </button>

                <div className="express-occasion-viewport">
                  <div
                    className="express-occasion-track"
                    ref={occasionTrackRef}
                  >
                    {filteredOccasions.map((item) => (
                      <button
                        key={item.id}
                        className={`express-occasion ${
                          occasion === item.id ? "active" : ""
                        }`}
                        onClick={() => selectOccasion(item.id)}
                      >
                        <span className="emoji">{item.emoji}</span>
                        <span className="occasion-name">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="express-rail-arrow"
                  onClick={() => scrollOccasions(1)}
                  aria-label="Scroll occasions right"
                >
                  ›
                </button>
              </div>
            ) : (
              <div className="express-panel">
                <h2>That feeling has a place here.</h2>

                <p className="subhead">
                  Start with your own words. EXPRESS will help you shape them.
                </p>

                <button
                  className="express-btn primary"
                  onClick={() => {
                    setAnswers({ rawIntent: search });
                    selectOccasion("unsure");
                  }}
                >
                  Write my message
                </button>
              </div>
            )}
          </>
        )}

        {view === "questions" && currentQuestion && (
          <section className="express-panel">
            <div className="express-progress">
              <div
                style={{
                  width: `${((step + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <div className="express-step">
              QUESTION {step + 1} OF {questions.length}
            </div>

            <h2>{currentQuestion.question}</h2>

            <p className="subhead">
              {currentQuestion.required
                ? "This will help us understand what you mean."
                : "Share as much or as little as you want. You can skip this."}
            </p>

            <div className="express-question">
              {currentQuestion.type === "choice" ? (
                <div className="express-options">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      className={`express-option ${
                        answers[currentQuestion.id] === option
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateAnswer(currentQuestion.id, option)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : currentQuestion.type === "textarea" ? (
                <textarea
                  className="express-field textarea"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(event) =>
                    updateAnswer(currentQuestion.id, event.target.value)
                  }
                  placeholder={currentQuestion.placeholder}
                />
              ) : (
                <input
                  className="express-field"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(event) =>
                    updateAnswer(currentQuestion.id, event.target.value)
                  }
                  placeholder={currentQuestion.placeholder}
                />
              )}
            </div>

            {error && <div className="express-error">{error}</div>}

            <div className="express-actions">
              <button className="express-btn" onClick={previousStep}>
                Back
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                {!currentQuestion.required && (
                  <button
                    className="express-btn"
                    onClick={() => {
                      setError("");

                      if (step < questions.length - 1) {
                        setStep((previous) => previous + 1);
                      } else {
                        generateMessage();
                      }
                    }}
                  >
                    Skip
                  </button>
                )}

                <button
                  className="express-btn primary"
                  onClick={nextStep}
                >
                  {step === questions.length - 1
                    ? "Write my message"
                    : "Continue"}
                </button>
              </div>
            </div>
          </section>
        )}

        {view === "loading" && (
          <section className="express-panel express-loading">
            <div className="spinner" />

            <h2>Finding your words...</h2>

            <p>
              We're listening to what you mean,
              <br />
              not just the words you typed.
            </p>
          </section>
        )}

        {view === "result" && (
          <section className="express-result">
            <div className="express-result-top">
              <div>
                <h2>Your message, from the heart.</h2>
                <p>Edit anything. Make it yours.</p>
              </div>

              <button className="express-btn" onClick={startAgain}>
                Start over
              </button>
            </div>

            <textarea
              className="express-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              aria-label="Edit your generated message"
            />

            <div className="express-tools">
              <button className="express-btn primary" onClick={copyMessage}>
                Copy message
              </button>

              <button
                className="express-btn"
                onClick={() => downloadText(message, occasion)}
              >
                Download text
              </button>

              <button
                className="express-btn"
                onClick={() =>
                  downloadMessageCard(message, selectedPalette)
                }
              >
                Download message card
              </button>

              <button className="express-btn" onClick={generateMessage}>
                Try another
              </button>
            </div>

            <div className="express-section-label">
              Card background
            </div>

            <div className="express-palette">
              {PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  title={palette.name}
                  aria-label={`${palette.name} card background`}
                  className={`express-swatch ${
                    selectedPalette.name === palette.name ? "selected" : ""
                  }`}
                  style={{ background: palette.background }}
                  onClick={() => setSelectedPalette(palette)}
                />
              ))}
            </div>
          </section>
        )}

        {error && view !== "questions" && view !== "home" && (
          <div className="express-error">{error}</div>
        )}

        <footer className="express-footer">
          EXPRESS · Heartfelt, not rehearsed.
        </footer>
      </div>
    </div>
  );
}