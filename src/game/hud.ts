import { getCameraBounds } from "./camera.ts";
// Waits for the pixel font so no text shows in a fallback font first
import "./helper/pixelFont.ts";
import { getElapsedTime } from "./helper/frameCallback.ts";
import { addResizeCallback } from "./helper/resizeCallback.ts";
import { mainCharacter } from "./characters/main/mainCharacter.ts";
import { effort } from "./effort.ts";
import { getFinishTip, getZoneShares } from "./coach.ts";
import { course } from "./course.ts";
import { getItemTip } from "./items.ts";
import { getSelectedLevel, Level, LEVELS, selectLevel } from "./levels.ts";
import { ObstacleKind } from "./obstacles/interfaces.ts";
import {
  formatDuration,
  PACE_ZONE_ORDER,
  PACE_ZONES,
  PaceZone,
} from "./pace.ts";
import { FinishRecord, loadBest } from "./personalBest.ts";
import { getCharacterPosition } from "./positions.ts";
import { RunPhase, runState } from "./runState.ts";

const byId = (id: string) => document.getElementById(id)!;

const fillText = (selector: string, text: string) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
};

// How long a speech bubble and an item tip stay up, in seconds
const bubbleDuration = 2;
const tipDuration = 3.5;
// World units above the runner's center, clear of the pickup lane
const bubbleOffsetY = 1.7;

function describeGrade(grade: number) {
  const percent = Math.round(Math.abs(grade) * 100);
  if (percent < 1) {
    return "Flat";
  }
  return `${grade > 0 ? "Uphill" : "Downhill"} ${percent}%`;
}

// Distance, clock, energy, pace and the start/finish screens,
// drawn as HTML over the canvas
export class Hud {
  private game = document.querySelector<HTMLElement>(".game")!;
  private hud = byId("hud");
  private distanceText = byId("hud-distance-text");
  private distanceFill = byId("hud-distance-fill");
  private clock = byId("hud-clock");
  private livePace = byId("hud-pace");
  private energy = byId("hud-energy");
  private energyFill = byId("hud-energy-fill");
  private hills = byId("hud-hills");
  private grade = byId("hud-grade");
  private elevationLine = byId("hud-elevation-line");
  private elevationMarker = byId("hud-elevation-marker");
  private pacePanel = byId("pace-panel");
  private paceTitle = byId("pace-title");
  private bubble = byId("bubble");
  private tip = byId("item-tip");
  private menu = byId("menu");
  private levelPicker = byId("level-picker");
  private startCard = byId("start-card");
  private finishCard = byId("finish-card");

  private paceButtons = new Map<PaceZone, HTMLButtonElement>();
  private levelButtons = new Map<string, HTMLButtonElement>();
  private shownText = new Map<HTMLElement, string>();
  private shownEnergyLevel = "";
  private shownHillFactor = 1;
  private bubbleHideAt: number | null = null;
  private tipHideAt: number | null = null;
  private gameWidth = 0;
  private gameHeight = 0;

  constructor() {
    document.querySelectorAll<HTMLElement>("[data-zone-badge]").forEach(
      (element) => {
        const zone = element.dataset.zoneBadge as PaceZone;
        const { label, secondsPerKm } = PACE_ZONES[zone];
        element.textContent = `${label} ${formatDuration(secondsPerKm)}`;
      },
    );

    this.createLevelButtons();
    this.showLevel(getSelectedLevel());
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
    if (phase === "ready") {
      // Best times may have changed since the picker was last shown
      this.showLevel(getSelectedLevel());
    }
  }

  // Fills the start card for the level picked in the level picker
  public showLevel(level: Level) {
    this.levelButtons.forEach((button, id) => {
      button.setAttribute("aria-pressed", String(id === level.id));
    });
    fillText("[data-level-intro]", level.intro);
    fillText("[data-example='pickup']", level.pickups[0]);
    fillText("[data-example='setback']", level.setbacks[0]);

    const best = loadBest(level.id);
    byId("level-best").textContent = best === null
      ? ""
      : `Your best: ${formatDuration(best)}`;
  }

  // Sets up the parts of the HUD that depend on the course
  public startRun() {
    const { level } = course;
    fillText("[data-goal-km]", String(level.distanceKm));
    this.hideTip();

    // On hills the same effort gives a different pace, so the panel
    // talks about effort and the chart shows what's coming
    const hasHills = course.stretches.length > 0;
    this.paceTitle.dataset.title = hasHills ? "Effort, pace /km" : "Pace /km";
    this.hills.hidden = !hasHills;
    if (hasHills) {
      this.drawElevation();
    }
    this.shownHillFactor = 0;
    this.updatePacePanel();
  }

  public showResult({ previousBest, isNewBest }: FinishRecord) {
    const { level } = course;
    const seconds = runState.getRaceSeconds();
    fillText("[data-level-finish]", level.finishTitle);
    fillText("[data-level-context]", level.typicalFinish);
    byId("finish-time").textContent = formatDuration(seconds);
    byId("finish-pace").textContent = formatDuration(
      seconds / level.distanceKm,
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

  // Shows what a pickup or setback teaches, the first time it comes up
  public showTip(name: string, kind: ObstacleKind) {
    const { label, tip } = getItemTip(name, kind);
    this.tip.dataset.kind = kind;
    byId("item-tip-label").textContent = label;
    byId("item-tip-text").textContent = tip;
    this.tip.classList.add("is-visible");
    this.tipHideAt = getElapsedTime() + tipDuration;
  }

  // Shows a speech bubble over the runner; null keeps it up until replaced
  public say(text: string, seconds: number | null = bubbleDuration) {
    this.bubble.textContent = text;
    this.bubble.classList.add("is-visible");
    this.bubbleHideAt = seconds === null ? null : getElapsedTime() + seconds;
  }

  public update() {
    this.setText(this.distanceText, runState.getDistanceKm().toFixed(1));
    this.distanceFill.style.transform = `scaleX(${runState.getProgress()})`;
    this.setText(this.clock, formatDuration(runState.getRaceSeconds()));

    // The pace actually run right now: slower uphill, nothing while waiting
    const speed = mainCharacter.getWorldSpeed();
    const hillFactor = mainCharacter.getHillFactor();
    this.setText(
      this.livePace,
      speed === 0 ? "Waiting" : `${
        formatDuration(PACE_ZONES[effort.zone].secondsPerKm / hillFactor)
      } /km`,
    );
    if (hillFactor !== this.shownHillFactor) {
      this.shownHillFactor = hillFactor;
      this.updatePaceTimes(hillFactor);
    }

    if (!this.hills.hidden) {
      this.setText(
        this.grade,
        describeGrade(course.getGrade(runState.getDistanceUnits())),
      );
      this.elevationMarker.setAttribute(
        "x",
        (runState.getProgress() * 100 - 1.5).toFixed(1),
      );
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

    const now = getElapsedTime();
    if (this.bubbleHideAt !== null && now >= this.bubbleHideAt) {
      this.bubble.classList.remove("is-visible");
      this.bubbleHideAt = null;
    }
    if (this.tipHideAt !== null && now >= this.tipHideAt) {
      this.hideTip();
    }
  }

  // Writes text only when it changed, to keep each frame cheap
  private setText(element: HTMLElement, text: string) {
    if (this.shownText.get(element) !== text) {
      this.shownText.set(element, text);
      element.textContent = text;
    }
  }

  private hideTip() {
    this.tip.classList.remove("is-visible");
    this.tipHideAt = null;
  }

  private createLevelButtons() {
    LEVELS.forEach((level) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-button";
      button.dataset.level = level.id;
      // Keyboard players use the arrow keys; focus would steal Space
      button.tabIndex = -1;
      button.textContent = level.name;
      this.levelPicker.appendChild(button);
      this.levelButtons.set(level.id, button);
    });

    // Picking a run must not also start it
    this.levelPicker.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const button = (event.target as HTMLElement).closest<HTMLElement>(
        ".level-button",
      );
      if (button?.dataset.level) {
        selectLevel(button.dataset.level);
      }
    });
  }

  private createPaceButtons() {
    // Fastest on top, like a gear lever
    [...PACE_ZONE_ORDER].reverse().forEach((zone) => {
      const { label } = PACE_ZONES[zone];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pace-button";
      button.dataset.zone = zone;
      // Keyboard players use the arrow keys; focus would steal Space
      button.tabIndex = -1;
      button.innerHTML = `<span>${label}</span><span class="pace-time"></span>`;
      this.pacePanel.appendChild(button);
      this.paceButtons.set(zone, button);
    });
    this.updatePaceTimes(1);

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

  // Same effort, different pace: uphill every button shows a slower time
  private updatePaceTimes(hillFactor: number) {
    this.paceButtons.forEach((button, zone) => {
      button.querySelector(".pace-time")!.textContent = formatDuration(
        PACE_ZONES[zone].secondsPerKm / hillFactor,
      );
    });
  }

  private updatePacePanel() {
    this.pacePanel.classList.toggle("is-exhausted", effort.isExhausted);
    this.paceTitle.textContent = effort.isExhausted
      ? "Out of breath"
      : this.paceTitle.dataset.title ?? "Pace /km";
    this.paceButtons.forEach((button, zone) => {
      button.setAttribute("aria-pressed", String(zone === effort.zone));
      button.disabled = effort.isExhausted && zone !== "walk";
    });
  }

  // Elevation chart across the whole course, 100 wide and 24 tall
  private drawElevation() {
    const profile = course.getElevationProfile();
    const heights = profile.map(({ meters }) => meters);
    const low = Math.min(...heights);
    const range = Math.max(1, Math.max(...heights) - low);
    const points = profile.map(({ units, meters }) => {
      const x = (units / course.goalUnits) * 100;
      const y = 22 - ((meters - low) / range) * 18;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    this.elevationLine.setAttribute("points", points.join(" "));
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
