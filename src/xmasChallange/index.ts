import { challenge } from "./challengeText.ts";

// Resolved through Vite so the build points at the hashed asset
const svgFile = new URL(
  "../../assets/challenge/svg/challenge.svg",
  import.meta.url,
).href;
const svgNamespace = "http://www.w3.org/2000/svg";

const container = document.getElementById("challenges")!;

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayFormatted = year + "-" + month + "-" + day;
const currentDay = new Date(todayFormatted);

for (const [index, { deadline }] of challenge.entries()) {
  const dayNumber = (index + 1).toString();
  const card = createCard(dayNumber);

  // Days that haven't started yet stay locked
  if (new Date(deadline) > currentDay) {
    card.disabled = true;
    card.classList.add("dim");
  } else {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("flipped");
      card.classList.toggle("glow", flipped);
      card.setAttribute("aria-pressed", flipped.toString());
    });
  }

  container.appendChild(card);
}

function createCard(dayNumber: string) {
  const card = document.createElement("button");
  card.className = "ch-card";
  card.setAttribute("aria-label", "Challenge day " + dayNumber);
  card.setAttribute("aria-pressed", "false");

  const inner = document.createElement("div");
  inner.className = "ch-card-inner";
  inner.appendChild(createFace("ch-card-front", "#day" + dayNumber));
  inner.appendChild(createFace("ch-card-back", "#opened" + dayNumber));

  card.appendChild(inner);
  return card;
}

function createFace(className: string, symbol: string) {
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("class", "ch-svg ch-card-face " + className);
  svg.setAttribute("viewBox", "0 0 256 256");

  const use = document.createElementNS(svgNamespace, "use");
  use.setAttribute("href", svgFile + symbol);

  svg.appendChild(use);
  return svg;
}
