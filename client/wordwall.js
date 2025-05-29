const words = [
  "Growth",
  "Wisdom",
  "Focus",
  "Clarity",
  "Discipline",
  "Empathy",
  "Action",
  "Creativity",
  "Persistence",
  "Balance",
  "Drive",
  "Confidence",
  "Mindset",
  "Reflection",
  "Success",
  "Vision",
  "Joy",
  "Energy",
  "Ambition",
  "Kindness",
  "Leadership",
  "Courage",
  "Learning",
  "Knowledge",
  "Freedom",
  "Potential",
  "Consistency",
  "Grit",
  "Faith",
  "Patience",
  "Resilience",
];

const wordWall = document.getElementById("word-wall");
const columns = 8;
const rows = 8;
const totalWords = columns * rows;

for (let i = 0; i < totalWords; i++) {
  const span = document.createElement("span");
  span.textContent = words[Math.floor(Math.random() * words.length)];
  span.className = "word";

  const duration = 8 + Math.random() * 6;
  const delay = Math.random() * 10;

  span.style.animationDuration = `${duration}s`;
  span.style.animationDelay = `${delay}s`;

  wordWall.appendChild(span);
}
