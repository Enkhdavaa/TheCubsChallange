import { challange } from "./challangeText.ts";

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

const popover = document.getElementById("ch-popover");
const popoverText = document.getElementById("popover-text");
const popoverButton = document.getElementById("popover-button");

popoverButton?.addEventListener("click", () => {
  if (popover != null) {
    popover.hidden = true;
  }
});

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayFormatted = year + "-" + month + "-" + day;

for (const [index, element] of elements.entries()) {
  // Check deadline
  const deadline = new Date(challange[index].deadline);
  const currentDay = new Date(todayFormatted);

  if (deadline < currentDay) {
    if (element != null) {
      element.style.backgroundColor = "red";
      element.innerHTML = "";
    }
  } else {
    // Make clickable
    element?.addEventListener("click", () => {
      const challangeText = challange[index].ch;
      if (popover != null) {
        if (popover.hidden) {
          if (popoverText != null) {
            popoverText.innerText = challangeText;
            popover.hidden = false;
          }
        } else {
          popover.hidden = true;
        }
      }
    });
  }
}
