import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OCCASIONS = [
  { id: "birthday", label: "Birthday", icon: "gift" },
  { id: "thankyou", label: "Thank you", icon: "heart" },
  { id: "apology", label: "Apology", icon: "hands" },
  { id: "anniversary", label: "Anniversary", icon: "rings" },
  { id: "miss-you", label: "I miss you", icon: "moon" },
  { id: "congratulate", label: "Congratulations", icon: "award" },
  { id: "reject", label: "Say no", icon: "dove" },
  { id: "comfort", label: "Comfort", icon: "leaf" },
  { id: "reconnect", label: "Reconnect", icon: "envelope" },
  { id: "farewell", label: "Farewell", icon: "feather" },
  { id: "anger", label: "I'm angry", icon: "flame" },
  { id: "hurt", label: "I'm hurt", icon: "bandage" },
  { id: "betrayal", label: "Betrayal", icon: "rose" },
  { id: "disappointment", label: "Disappointment", icon: "cloud" },
  { id: "boundaries", label: "Set a boundary", icon: "shield" },
  { id: "difficult", label: "Difficult conversation", icon: "candle" },
  { id: "love", label: "I love you", icon: "heart-filled" },
  { id: "encourage", label: "Encourage someone", icon: "sun" },
  { id: "celebrate", label: "Celebrate a moment", icon: "sparkles" },
  { id: "unsure", label: "Something else", icon: "quill" },
];

function OccasionIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    gift: <><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M2 8h20v4H2zM12 8v13M12 8H8a2.5 2.5 0 1 1 2.5-2.5C10.5 7 12 8 12 8ZM12 8h4a2.5 2.5 0 1 0-2.5-2.5C13.5 7 12 8 12 8Z"/></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z"/>,
    "heart-filled": <><path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z" fill="currentColor"/></>,
    hands: <><path d="M8 12 5 9l-3 3 5 6 4 2 3-2 6-7-3-2-5 4-3-1Z"/><path d="m9 12 3 2 3-2M12 7c1-2 3-3 5-3"/></>,
    rings: <><circle cx="9" cy="13" r="6"/><circle cx="16" cy="13" r="6"/><path d="m9 3 2-2 2 2-2 2z"/></>,
    moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
    award: <><circle cx="12" cy="9" r="7"/><path d="m8 15-1 8 5-3 5 3-1-8M12 5l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z"/></>,
    dove: <><path d="M3 17c5-1 7-5 9-10 2 4 5 6 9 6-3 5-8 7-14 6l-4-2Z"/><path d="m12 7 2-4M7 17l-3 3M16 13l3-2"/></>,
    leaf: <><path d="M20 4C10 3 4 7 4 14c0 4 3 6 6 6 7 0 10-7 10-16Z"/><path d="M4 21c3-6 7-9 12-12"/></>,
    envelope: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
    feather: <><path d="M20 4C12 2 5 8 5 15c0 3 2 5 5 5 7 0 13-8 10-16Z"/><path d="M3 22 14 10M8 17l-1-4M12 13l4 1"/></>,
    flame: <path d="M12 22c5 0 8-3 8-8 0-4-3-7-5-10 0 4-2 5-3 6-1-4-3-6-5-8 1 5-3 8-3 12 0 5 3 8 8 8Z"/>,
    bandage: <><rect x="4" y="4" width="16" height="16" rx="3" transform="rotate(45 12 12)"/><path d="m8 8 8 8M8 16l8-8"/></>,
    rose: <><path d="M12 21v-9M12 12c-5 0-7-4-4-7 1 3 3 3 4 1 1 2 3 2 4 0 3 3 1 7-4 6Z"/><path d="M12 17c-3-4-6-3-7-1 2 3 5 4 7 1ZM12 17c3-4 6-3 7-1-2 3-5 4-7 1Z"/></>,
    cloud: <path d="M7 18h11a4 4 0 0 0 .5-8A6.5 6.5 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z"/>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    candle: <><path d="M8 11h8v11H8zM6 22h12M12 11c-4-3 0-6 0-9 4 3 4 6 0 9Z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    sparkles: <><path d="m12 3 1.5 6.5L20 11l-6.5 1.5L12 19l-1.5-6.5L4 11l6.5-1.5L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
    quill: <><path d="M20 4C12 3 6 7 6 14c0 3 2 5 5 5 7 0 10-7 9-15Z"/><path d="M3 22 14 11M8 17l-1-4M12 13l4 1"/></>,
  };

  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="express-gold-icon"
    >
      {icons[name] || icons.sparkles}
    </svg>
  );
}

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

.express-gold-icon {
  color: #b18a50;
  filter: drop-shadow(0 2px 3px #b18a5020);
  transition: transform .3s ease, color .3s ease;
}

.express-occasion:hover .express-gold-icon {
  color: #96703d;
  transform: translateY(-3px) scale(1.08);
}

.occasion-icon {
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  min-height: 34px;
}

.express-brand-mark {
  display: block;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  object-fit: contain;
  margin-right: 7px;
  border-radius: 0;
  filter: none;
}

.brand-logo span {
  font-size: .96rem;
  letter-spacing: .19em;
  font-weight: 500;
  color: #59443b;
}

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

.express-nav-actions { display: flex; align-items: center; gap: 12px; }

@media(max-width: 620px) {
  .express-nav-actions { gap: 8px; }
  .express-nav-note { display: none; }
}

/* Compact install control: leaves the existing page layout untouched. */
.express-install-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 13px; border: 1px solid #c6a568; border-radius: 999px;
  background: #fffaf6; color: #87683d; font-size: 12px; font-weight: 600;
  white-space: nowrap; transition: background .2s ease, transform .2s ease;
}
.express-install-btn:hover { background: #f4e9d4; transform: translateY(-1px); }
.express-install-btn svg { width: 15px; height: 15px; }
@media(max-width: 620px) {
  .express-install-btn { padding: 7px 9px; font-size: 11px; }
}


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
/* Luxury message card */

.express-card {
  --card-bg: #fffaf5;
  --card-text: #302923;

  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 680px;
  min-height: 390px;
  margin: 22px auto 26px;
  padding: 58px clamp(25px, 7vw, 76px);
  background: var(--card-bg);
  color: var(--card-text);
  border: 1px solid #d8c19b;
  border-radius: 5px;
  box-shadow:
    0 20px 50px rgba(68, 48, 32, .12),
    0 3px 9px rgba(68, 48, 32, .05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.express-card::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(177, 138, 80, .48);
  pointer-events: none;
}

.express-card::after {
  content: "✦";
  position: absolute;
  top: 22px;
  color: #b18a50;
  font-size: 17px;
}

.express-card-kicker {
  color: #a17b49;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 27px;
}

.express-card-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(25px, 4vw, 34px);
  font-style: italic;
  font-weight: 400;
  margin: 0 0 24px;
  line-height: 1.3;
}

.express-card-divider {
  width: 48px;
  height: 1px;
  background: #b18a50;
  margin-bottom: 26px;
}

.express-card-body {
  width: 100%;
  max-width: 490px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 16px;
  line-height: 2;
  text-align: center;
}

.express-card-signature {
  margin-top: 34px;
  color: #a17b49;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 17px;
  font-style: italic;
}

.express-card-footer {
  margin-top: 28px;
  color: #a17b49;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.express-card[data-palette="Midnight"] {
  border-color: #b18a50;
}

.express-card[data-palette="Midnight"]::before {
  border-color: #b18a5080;
}

@media(max-width: 620px) {
 {
  .express-card {
    min-height: 350px;
    padding: 48px 25px;
  }

  .express-card-body {
    font-size: 14px;
    line-height: 1.85;
  }
}

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

.express-info-page {
  max-width: 760px;
  margin: 30px auto 0;
  padding: clamp(24px, 5vw, 44px);
  border: 1px solid #eee0d7;
  border-radius: 26px;
  background: #fffaf6;
  box-shadow: 0 18px 55px #49301a08;
}
.express-info-page .express-step { margin-bottom: 12px; }
.express-info-page h1 {
  margin: 0 0 18px;
  font: 400 clamp(32px, 5vw, 46px)/1.15 "Playfair Display", Georgia, serif;
  letter-spacing: -1px;
}
.express-info-page h2 {
  margin: 28px 0 8px;
  font: 500 18px "DM Sans", sans-serif;
}
.express-info-page p, .express-info-page li {
  color: #8e776c;
  font-size: 13px;
  line-height: 1.85;
}
.express-info-page ul { padding-left: 20px; }
.express-info-email { color: #a7756e; text-decoration: underline; }
.express-app .express-footer {
  display: block;
  text-align: center;
  margin: 54px auto 0;
  color: #b8a69b;
  font-size: 10px;
  letter-spacing: .7px;
}
.express-footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 14px;
}
.express-app .express-footer-links button {
  appearance: none;
  border: 0;
  padding: 4px;
  background: transparent;
  color: #a18a7f;
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.express-footer-links button:hover { color: #a7756e; }
@media (max-width: 560px) {
  .express-footer-links { gap: 10px; }
}

/* Three-second maximum intro: preserve the moving dissolve, shorten only its duration. */

.express-intro {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #fffaf7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: express-intro-exit .5s 2.5s cubic-bezier(.7,0,.2,1) forwards;
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
  animation: express-fields 2.8s ease-in-out both;
}

.express-intro::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #fffaf7aa, #f2dfd855, #fffaf7aa);
  opacity: 0;
  animation: express-veil .5s 2.3s ease forwards;
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
  animation: express-merge 2.8s ease-in-out both;
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

@keyframes express-page-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* Keep the branded intro transition intact on every page load. */
@media (prefers-reduced-motion: reduce) {
  .express-app .express-intro,
  .express-app .express-intro::before,
  .express-app .express-intro::after,
  .express-app .express-intro *,
  .express-app .express-intro-fields i {
    animation-duration: 4s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
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

  const width = 1200;
  const padding = 110;
  const maxWidth = width - padding * 2;

  const paragraphs = message.trim().split(/\n+/);
  const fontSize = 34;
  const lineHeight = 57;

  ctx.font = `${fontSize}px Georgia, serif`;

  const lines = [];

  paragraphs.forEach((paragraph, index) => {
    const words = paragraph.trim().split(/\s+/);
    let line = "";

    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;

      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });

    if (line) lines.push(line);

    if (index !== paragraphs.length - 1) {
      lines.push("");
    }
  });

  const textHeight = lines.length * lineHeight;
  const height = Math.max(850, textHeight + 500);

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  // Outer gold border
  ctx.strokeStyle = "#B18A50";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Inner delicate border
  ctx.strokeStyle = "rgba(177,138,80,0.55)";
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  // Top ornament
  ctx.fillStyle = "#B18A50";
  ctx.textAlign = "center";
  ctx.font = "30px Georgia, serif";
  ctx.fillText("✦", width / 2, 105);

  // Card heading
  ctx.fillStyle = "#A17B49";
  ctx.font = "600 17px Arial, sans-serif";
  ctx.fillText("A LITTLE SOMETHING FROM THE HEART", width / 2, 160);

  ctx.fillStyle = palette.text;
  ctx.font = "italic 46px Georgia, serif";
  ctx.fillText("Words worth sharing", width / 2, 230);

  // Divider
  ctx.strokeStyle = "#B18A50";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 35, 270);
  ctx.lineTo(width / 2 + 35, 270);
  ctx.stroke();

  // Message text
  ctx.fillStyle = palette.text;
  ctx.font = `${fontSize}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const startY = 330 + Math.max(0, (height - textHeight - 500) / 2);

  lines.forEach((line, index) => {
    if (line) {
      ctx.fillText(line, width / 2, startY + index * lineHeight, maxWidth);
    }
  });

  // Signature and footer
  ctx.fillStyle = "#A17B49";
  ctx.font = "italic 27px Georgia, serif";
  ctx.fillText("With warmth, always.", width / 2, height - 160);

  ctx.font = "14px Arial, sans-serif";
  ctx.fillText("E X P R E S S   ·   WORDS THAT FEEL LIKE YOU", width / 2, height - 105);

  const link = document.createElement("a");
  link.download = "express-message-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function App() {
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIntroVisible(false), 2500);
    return () => window.clearTimeout(introTimer);
  }, []);

  const [occasion, setOccasion] = useState("birthday");
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [view, setView] = useState("home");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);
  const [infoPage, setInfoPage] = useState("about");

  const [installPrompt, setInstallPrompt] = useState(
    () => window.__EXPRESS_INSTALL_PROMPT__ || null
  );
  const [isInstalled, setIsInstalled] = useState(false);
  useEffect(() => {
    // main.jsx captures this event before React mounts; adopt it here too.
    if (window.__EXPRESS_INSTALL_PROMPT__) {
      setInstallPrompt(window.__EXPRESS_INSTALL_PROMPT__);
    }

    const onBeforeInstall = (event) => {
      event.preventDefault();
      window.__EXPRESS_INSTALL_PROMPT__ = event;
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstallClick() {
    const promptEvent = installPrompt || window.__EXPRESS_INSTALL_PROMPT__;
    if (!promptEvent) {
      // Browser install prompts are conditional. Never let the button silently no-op.
      const userAgent = navigator.userAgent || "";
      const instructions = /iPhone|iPad|iPod/i.test(userAgent)
        ? "On iPhone or iPad, open EXPRESS in Safari, tap Share, then choose Add to Home Screen."
        : /Android/i.test(userAgent)
          ? "In Chrome, open the ⋮ menu and choose Install app or Add to Home screen."
          : "In Chrome or Edge, open the ⋮ menu and choose Install EXPRESS or Install page as app. If that option is absent, the browser has not marked the site installable yet.";
      window.alert(`Install EXPRESS\\n\\n${instructions}`);
      return;
    }

    try {
      // prompt() must be called directly from the user's click gesture.
      const promptResult = promptEvent.prompt();
      setInstallPrompt(null);
      window.__EXPRESS_INSTALL_PROMPT__ = null;
      await promptResult;
      const choice = await promptEvent.userChoice;
      if (choice?.outcome === "accepted") setIsInstalled(true);
    } catch (error) {
      console.error("EXPRESS install prompt failed:", error);
    } finally {
      setInstallPrompt(null);
      window.__EXPRESS_INSTALL_PROMPT__ = null;
    }
  }
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
      <div
        className="express-intro"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at 16% 24%, rgba(197,138,130,.28), transparent 42%)," +
            "radial-gradient(ellipse at 82% 72%, rgba(213,170,163,.34), transparent 46%)," +
            "radial-gradient(ellipse at 54% 8%, rgba(240,217,203,.6), transparent 38%)," +
            "#fffaf7",
          pointerEvents: "none",
          opacity: introVisible ? 1 : 0,
          transition: "opacity 500ms ease",
        }}
      >
        <div className="express-intro-fields">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div
          className="express-intro-content"
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: 28,
            color: "#5a443b",
            animation: "express-brand-in 1s .25s both",
          }}
        >
          <div
            className="express-intro-brand"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(43px, 8vw, 75px)",
              color: "#5a443b",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            EXPRESS
          </div>

          <div
            className="express-intro-tagline"
            style={{
              color: "#a27d71",
              marginTop: 13,
              fontSize: 11,
              letterSpacing: 2.2,
              textTransform: "uppercase",
            }}
          >
            Intention over occasion
          </div>
        </div>
      </div>

      <div
        className="express-shell"
        style={{
          opacity: introVisible ? 0 : 1,
          transition: "opacity 700ms ease",
          position: "relative",
        }}
      >
        <nav className="express-nav">
          <a href="/" className="brand-logo" aria-label="EXPRESS Home">
            <img src="/favicon.svg" alt="" className="express-brand-mark" />
            <span>EXPRESS</span>
          </a>

          <div className="express-nav-actions">
            <div className="express-nav-note">
              Heartfelt, not rehearsed.
            </div>
            {!isInstalled && (
              <button className="express-install-btn" onClick={handleInstallClick} aria-label="Install EXPRESS">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
                </svg>
                Install
              </button>
            )}
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
                        <span className="occasion-icon">
                          <OccasionIcon name={item.icon} />
                        </span>
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

        {view === "info" && (
          <section className="express-info-page">
            <div className="express-step">EXPRESS · {infoPage.toUpperCase()}</div>
            {infoPage === "about" && (
              <>
                <h1>Words that feel like you.</h1>
                <p>EXPRESS — Intention over occasion — is an independently operated writing project created to help people put genuine thoughts and feelings into words. Choose a situation, share the context you are comfortable providing, and shape an AI-assisted draft into a message that feels like your own.</p>
                <h2>Made to help you express, not replace you</h2>
                <p>EXPRESS offers writing assistance for celebrations, gratitude, apologies, boundaries, and difficult conversations. The result is a starting draft, not a substitute for your judgment. Read it, edit it, and decide whether it represents what you mean.</p>
                <button className="express-btn primary" onClick={() => setView("home")}>Write something heartfelt</button>
              </>
            )}
            {infoPage === "contact" && (
              <>
                <h1>Get in touch.</h1>
                <p>Questions, feedback, or a thought about how EXPRESS could be better? Send a note by email.</p>
                <p><a className="express-info-email" href="mailto:ellame2048@gmail.com">ellame2048@gmail.com</a></p>
              </>
            )}
            {infoPage === "privacy" && (
              <>
                <h1>Privacy Policy</h1>
                <p><strong>Effective date: November 8, 2026</strong></p>
                <p>This notice describes the current version of EXPRESS, an independently operated project. It is intended to explain the information handled when you use the message-writing feature. Please read it before submitting personal details.</p>
                <h2>Information you enter</h2>
                <p>When you ask EXPRESS to create a message, the app sends the selected occasion and the answers you provide to its server. Please do not submit passwords, payment-card details, government identification numbers, confidential information, or details about another person that you do not have permission to share.</p>
                <h2>How your request is used</h2>
                <p>Your submitted details are used to generate the requested draft. The server sends the prompt and details to Google Gemini, an AI service provided by Google. Google processes that request under its applicable service terms and privacy information. Review Google’s current terms before using the feature.</p>
                <h2>Storage and retention</h2>
                <p>The current application code does not connect to a database or implement user accounts to save message requests or generated drafts. The app returns the generated text to your browser; copying or downloading it is your choice. This does not mean that no technical records exist: the website, server, or AI provider may process operational logs or other technical information according to their configurations and policies. I have not independently verified every hosting-provider retention setting.</p>
                <h2>Cookies, analytics, and advertising</h2>
                <p>The current application code reviewed for this notice does not intentionally integrate Google Analytics, advertising trackers, or a cookie-based analytics system. Hosting infrastructure may still use essential technical mechanisms or collect service logs. This statement should be updated if tracking or additional third-party services are introduced.</p>
                <h2>Children and general use</h2>
                <p>EXPRESS is intended for a general audience. It is not designed to collect children’s personal information. Because the service uses an external AI provider, do not submit a child’s personal details or sensitive information. Before enabling accounts or deliberately targeting children, the service and this notice must be reviewed for applicable child-data requirements and consent processes.</p>
                <h2>Your choices and privacy requests</h2>
                <p>You may choose what to enter and can stop using the service at any time. To ask a question or make a privacy-related request, email <a className="express-info-email" href="mailto:ellame2048@gmail.com">ellame2048@gmail.com</a>. As the current app does not provide user accounts or a request-history database, it may not be able to retrieve a past prompt or draft.</p>
                <h2>Future changes</h2>
                <p>This policy describes the current, no-account version only. If EXPRESS adds accounts, subscriptions, payments, saved content, or other data processing, this notice and the app’s consent and security practices must be updated before those features launch. Changes to this policy will be reflected here with a revised effective date.</p>
                <h2>Contact</h2>
                <p>EXPRESS is operated independently. For privacy questions, contact <a className="express-info-email" href="mailto:ellame2048@gmail.com">ellame2048@gmail.com</a>.</p>
              </>
            )}
            {infoPage === "terms" && (
              <>
                <h1>Terms of Use</h1>
                <p><strong>Effective date: November 8, 2026</strong></p>
                <p>These terms apply to your use of EXPRESS — Intention over occasion — an independently operated AI-assisted writing service. By using the service, you agree to these terms. If you do not agree, please do not use it.</p>
                <h2>What EXPRESS provides</h2>
                <p>EXPRESS helps create drafts based on the occasion and details you provide. It is a writing aid, not a person, professional adviser, or a guarantee of how another person will react.</p>
                <h2>Your responsibility</h2>
                <p>You are responsible for the information you submit, reviewing generated text, editing it before sharing, and deciding whether it is appropriate. Do not submit information you do not have permission to share or information that is highly sensitive.</p>
                <h2>AI-generated results</h2>
                <p>Outputs may be inaccurate, incomplete, generic, or unsuitable. EXPRESS does not guarantee any particular quality, outcome, recipient response, or uninterrupted availability. Do not rely on the service for legal, medical, mental-health, emergency, or other professional advice.</p>
                <h2>Acceptable use</h2>
                <p>You must not use EXPRESS for unlawful activity, threats, harassment, fraud, impersonation, or to violate another person’s rights. Do not attempt to disrupt, reverse engineer, or misuse the service or its infrastructure.</p>
                <h2>Intellectual property</h2>
                <p>You retain responsibility for the material you submit. AI-generated text may not be unique and similar outputs may be generated for other users. To the extent permitted by applicable law and subject to third-party rights, you may use and adapt the output for your purposes.</p>
                <h2>Service changes and disclaimers</h2>
                <p>EXPRESS may be changed, suspended, or discontinued. The service is provided on an “as available” basis to the extent permitted by law. Nothing in these terms excludes a consumer right or liability that cannot lawfully be excluded.</p>
                <h2>Updates</h2>
                <p>These terms may be updated as the service evolves. The effective date will be changed when an updated version is published. New account, subscription, or payment features will require additional terms before launch.</p>
                <h2>Contact</h2>
                <p>Questions about these terms can be sent to <a className="express-info-email" href="mailto:ellame2048@gmail.com">ellame2048@gmail.com</a>.</p>
              </>
            )}
            <div className="express-actions">
              <button className="express-btn" onClick={() => setView("home")}>Back to EXPRESS</button>
            </div>
          </section>
        )}

        <footer
          className="express-footer"
          style={{ display: "block", width: "100%", textAlign: "center", margin: "54px auto 0", color: "#b8a69b", fontSize: "10px", letterSpacing: ".7px" }}
        >
          EXPRESS · Heartfelt, not rehearsed.
          <div className="express-footer-links" aria-label="Site information" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px", marginTop: "14px" }}>
            {["about", "contact", "privacy", "terms"].map((page) => (
              <button
                key={page}
                style={{ appearance: "none", border: 0, padding: "4px", background: "transparent", color: "#a18a7f", fontSize: "11px", textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer" }}
                onClick={() => { setInfoPage(page); setView("info"); }}
              >
                {page === "about" ? "About" : page === "contact" ? "Contact" : page === "privacy" ? "Privacy" : "Terms"}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}