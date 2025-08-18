import config from "./config"

import "./features/TrapWaypoint"
import "./features/SecretSpawnTimer"
import "./features/TacCd"
import "./features/AutoSwap"
import "./features/BossWaypoints"
import "./features/RelicTriggerbot"
import "./features/AutoClicker"

register("command", () => {
    return config.openGUI();
}).setName("ijt")