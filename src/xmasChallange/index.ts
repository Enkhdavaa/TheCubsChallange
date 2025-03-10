import { challenge } from "./challengeText.ts";

const elements = [];

const day1Element = document.getElementById("day1");
elements.push(day1Element);
const day2Element = document.getElementById("day2");
elements.push(day2Element);
const day3Element = document.getElementById("day3");
elements.push(day3Element);
const day4Element = document.getElementById("day4");
elements.push(day4Element);
const day5Element = document.getElementById("day5");
elements.push(day5Element);
const day6Element = document.getElementById("day6");
elements.push(day6Element);
const day7Element = document.getElementById("day7");
elements.push(day7Element);
const day8Element = document.getElementById("day8");
elements.push(day8Element);
const day9Element = document.getElementById("day9");
elements.push(day9Element);
const day10Element = document.getElementById("day10");
elements.push(day10Element);
const day11Element = document.getElementById("day11");
elements.push(day11Element);
const day12Element = document.getElementById("day12");
elements.push(day12Element);

const content = document.getElementById("body-content")!;
const popover = document.getElementById("ch-popover-container");
const popoverButton = document.getElementById("popover-button");
const popoverUseElement = document.getElementById("ch-use");

popoverButton?.addEventListener("click", () => {
  if (popover != null) {
    popover.hidden = true;
    unblurContent();
  }
});

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayFormatted = year + "-" + month + "-" + day;

for (const [index, element] of elements.entries()) {
  // Check deadline
  const deadline = new Date(challenge[index].deadline);
  const currentDay = new Date(todayFormatted);
  if (element != null) {
    if (deadline < currentDay) {
      setOpenedSvg(element, (index + 1).toString());
    } else {
      if (deadline.toDateString() == currentDay.toDateString()) {
        // Make clickable
        element.parentElement!.classList.add("glow");
        element.addEventListener("click", () => {
          setDaySvg(popoverUseElement, (index + 1).toString());
          if (popover != null) {
            if (popover.hidden) {
              blurContent();
              popover.hidden = false;
            } else {
              unblurContent();
              popover.hidden = true;
            }
          }
        });
      } else {
        element.parentElement!.classList.add("dim");
      }
    }
    element.removeAttribute("hidden");
  }
}

function blurContent() {
  content.style.filter = "blur(10px)";
  document.body.style.overflow = "hidden";
}

function unblurContent() {
  content.style.filter = "blur(0px)";
  document.body.style.overflow = "auto";
}

function setDaySvg(element: HTMLElement | null, index: string) {
  const href = popoverUseElement?.getAttribute("href") ?? "";
  const fileName = href.split("#")[0];
  const newHref = fileName + "#day" + index;
  element?.setAttribute("href", newHref);
}

function setOpenedSvg(element: HTMLElement | null, index: string) {
  const href = element?.getAttribute("href") ?? "";
  const fileName = href.split("#")[0];
  const newHref = fileName + "#opened" + index;
  element?.setAttribute("href", newHref);
}
