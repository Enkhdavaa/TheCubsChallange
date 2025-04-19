import { MainCharacterStart } from "./characters/main/characterControl.ts";
import { LoadBackground } from "./decoration/background.ts";
import { RenderScreenText } from "./decoration/screenText.ts";
import { LoadObstacles } from "./obstacles/obstacles.ts";

MainCharacterStart();
LoadBackground();
RenderScreenText();
LoadObstacles();
