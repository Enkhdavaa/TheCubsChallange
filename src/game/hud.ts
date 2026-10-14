import { getCameraBounds } from "./camera.ts";
// Waits for the pixel font so no text shows in a fallback font first
import "./helper/pixelFont.ts";
import { getElapsedTime } from "./helper/frameCallback.ts";
import { addResizeCallback } from "./helper/resizeCallback.ts";
import { effort } from "./effort.ts";
import { getFinishTip, getZoneShares } from "./coach.ts";
import { currentLevel } from "./levels.ts";
import {
  formatDuration,
  PACE_ZONE_ORDER,
  PACE_ZONES,
  PaceZone,
} from "./pace.ts";
import { FinishRecord } from "./personalBest.ts";
import { getCharacterPosition } from "./positions.ts";
import { RunPhase, runState } from "./runState.ts";

const byId = (id: string) => document.getElementById(id)!;

const fillText = (selector: string, text: string) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
};

// How long a speech bubble stays up, in seconds
const bubbleDuration = 2;
// World units above the runner's center, clear of the pickup lane
const bubbleOffsetY = 1.7;

// Distance, clock, energy, pace and the start/finish screens,
// drawn as HTML over the canvas
export class Hud {
  private game = document.querySelector<HTMLElement>(".game")!;
  private hud = byId("hud");
  private distanceText = byId("hud-distance-text");
  private distanceFill = byId("hud-distance-fill");
  private clock = byId("hud-clock");
  private energy = byId("hud-energy");
  private energyFill = byId("hud-energy-fill");
  private pacePanel = byId("pace-panel");
  private paceTitle = byId("pace-title");
  private bubble = byId("bubble");
  private menu = byId("menu");
  private startCard = byId("start-card");
  private finishCard = byId("finish-card");

  private paceButtons = new Map<PaceZone, HTMLButtonElement>();
  private shownDistance = "";
  private shownClock = "";
  private shownEnergyLevel = "";
  private bubbleHideAt: number | null = null;
  private gameWidth = 0;
  private gameHeight = 0;

  constructor() {
    fillText("[data-goal-km]", String(currentLevel.distanceKm));
    fillText("[data-level-name]", currentLevel.name);
    fillText("[data-level-intro]", currentLevel.intro);
    fillText("[data-level-finish]", currentLevel.finishTitle);
    fillText("[data-level-context]", currentLevel.typicalFinish);
    document.querySelectorAll<HTMLElement>("[data-zone-badge]").forEach(
      (element) => {
        const zone = element.dataset.zoneBadge as PaceZone;
        const { label, secondsPerKm } = PACE_ZONES[zone];
        element.textContent = `${label} ${formatDuration(secondsPerKm)}`;
      },
    );

    this.createPaceButtons();
    effort.onChange((event) => {
      switch (event) {
        case "zone":
          this.updatePacePanel();
          this.say(PACE_ZONES[effort.zone].feeling);
          break;
        case "exhausted":
          this.updatePacePanel();
          this.say("Out of breath… walking it off", null);
          break;
        case "recovered":
          this.updatePacePanel();
          this.say("Okay, easy does it");
          break;
        case "boost":
          this.flash(this.energy, "is-up");
          break;
        case "drain":
          this.flash(this.energy, "is-down");
          break;
      }
    });

    const measure = () => {
      this.gameWidth = this.game.clientWidth;
      this.gameHeight = this.game.clientHeight;
      this.positionBubble();
    };
    measure();
    addResizeCallback(measure);
  }

  public showPhase(phase: RunPhase) {
    // The title and a card show between runs; the HUD shows during one
    this.menu.classList.toggle("is-visible", phase !== "running");
    this.startCard.hidden = phase !== "ready";
    this.finishCard.hidden = phase !== "finished";
    this.hud.classList.toggle("is-visible", phase === "running");
  }

  public showResult({ previousBest, isNewBest }: FinishRecord) {
    const seconds = runState.getRaceSeconds();
    byId("finish-time").textContent = formatDuration(seconds);
    byId("finish-pace").textContent = formatDuration(
      seconds / currentLevel.distanceKm,
    );

    let best = "";
    if (previousBest !== null) {
      best = isNewBest
        ? `New personal best! Previous: ${formatDuration(previousBest)}`
        : `Your best: ${formatDuration(previousBest)}`;
    }
    byId("finish-best").textContent = best;

    this.showZoneBreakdown();
    byId("finish-tip").textContent = getFinishTip();
  }

  public update() {
    const distance = runState.getDistanceKm().toFixed(1);
    if (distance !== this.shownDistance) {
      this.shownDistance = distance;
      this.distanceText.textContent = distance;
    }
    this.distanceFill.style.transform = `scaleX(${runState.getProgress()})`;

    const clock = formatDuration(runState.getRaceSeconds());
    if (clock !== this.shownClock) {
      this.shownClock = clock;
      this.clock.textContent = clock;
    }

    const energyShare = effort.getEnergyShare();
    this.energyFill.style.transform = `scaleX(${energyShare})`;
    const energyLevel = energyShare > 0.5
      ? "high"
      : energyShare > 0.25
      ? "mid"
      : "low";
    if (energyLevel !== this.shownEnergyLevel) {
      this.shownEnergyLevel = energyLevel;
      this.energy.dataset.level = energyLevel;
    }

    if (this.bubbleHideAt !== null && getElapsedTime() >= this.bubbleHideAt) {
      this.bubble.classList.remove("is-visible");
      this.bubbleHideAt = null;
    }
  }

  private createPaceButtons() {
    // Fastest on top, like a gear lever
    [...PACE_ZONE_ORDER].reverse().forEach((zone) => {
      const { label, secondsPerKm } = PACE_ZONES[zone];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pace-button";
      button.dataset.zone = zone;
      // Keyboard players use the arrow keys; focus would steal Space
      button.tabIndex = -1;
      button.innerHTML =
        `<span>${label}</span><span class="pace-time">${
          formatDuration(secondsPerKm)
        }</span>`;
      this.pacePanel.appendChild(button);
      this.paceButtons.set(zone, button);
    });

    // Picking a pace must not also make the runner jump
    this.pacePanel.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const button = (event.target as HTMLElement).closest<HTMLElement>(
        ".pace-button",
      );
      if (button) {
        effort.selectZone(button.dataset.zone as PaceZone);
      }
    });
  }

  private updatePacePanel() {
    this.pacePanel.classList.toggle("is-exhausted", effort.isExhausted);
    this.paceTitle.textContent = effort.isExhausted
      ? "Out of breath"
      : "Pace /km";
    this.paceButtons.forEach((button, zone) => {
      button.setAttribute("aria-pressed", String(zone === effort.zone));
      button.disabled = effort.isExhausted && zone !== "walk";
    });
  }

  private showZoneBreakdown() {
    const shares = getZoneShares();
    const bar = byId("finish-zone-bar");
    const legend = byId("finish-zone-legend");
    bar.replaceChildren();
    legend.replaceChildren();

    PACE_ZONE_ORDER.filter((zone) => shares[zone] >= 0.005).forEach((zone) => {
      const segment = document.createElement("span");
      segment.dataset.zone = zone;
      segment.style.flexGrow = String(shares[zone]);
      bar.appendChild(segment);

      const item = document.createElement("span");
      item.dataset.zone = zone;
      item.textContent = `${PACE_ZONES[zone].label} ${
        Math.round(shares[zone] * 100)
      }%`;
      legend.appendChild(item);
    });
  }

  // Shows a speech bubble over the runner; null keeps it up until replaced
  private say(text: string, seconds: number | null = bubbleDuration) {
    this.bubble.textContent = text;
    this.bubble.classList.add("is-visible");
    this.bubbleHideAt = seconds === null ? null : getElapsedTime() + seconds;
  }

  // Anchors the bubble above where the runner stands
  private positionBubble() {
    const { left, right, top, bottom } = getCameraBounds();
    const position = getCharacterPosition();
    const x = ((position.x - left) / (right - left)) * this.gameWidth;
    const y = ((top - position.y - bubbleOffsetY) / (top - bottom)) *
      this.gameHeight;
    this.bubble.style.left = `${x}px`;
    this.bubble.style.top = `${y}px`;
  }

  private flash(element: HTMLElement, className: string) {
    element.classList.remove("is-up", "is-down");
    // Reading layout restarts the CSS animation
    void element.offsetWidth;
    element.classList.add(className);
  }
}
