import { MainCharacterStart } from "./characters/main/characterControl.ts";
import { LoadBackground } from "./background/background.ts";
import { RenderScreenText } from "./decoration/screenText.ts";
import { LoadObstacles } from "./obstacles/obstacles.ts";
import { spawnDistanceBar } from "./characters/main/distanceBar.ts";

MainCharacterStart();
LoadBackground();
RenderScreenText();
LoadObstacles();
spawnDistanceBar();
