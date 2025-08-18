import config from "../config"
import { S32PacketConfirmTransaction, S29PacketSoundEffect, getHeldItemID, getClassWithLevel, romanToInt } from "../util/util"
import { data } from "../util/data"
import { registerWhen } from "../../BloomCore/utils/Utils"

let cdMultiplier = 1;
let dupe = true;
let ticks = 0;
let text = new Text("").setScale(1).setShadow(true).setAlign("CENTER");

register("packetReceived", (packet) => {

    let soundName = packet.func_149212_c();
    let pitch = packet.func_149209_h();
    let volume = packet.func_149208_g();

    if (soundName != "fire.ignite" || pitch != 0.7460317611694336 || volume != 1) return;

    if (dupe) getReduction();

    ticks = Math.ceil(400 * cdMultiplier);
    tickCounter.register();
    tickDisplay.register();

}).setFilteredClass(S29PacketSoundEffect)

register("chat", (reduction) => {

    dupe = false;
    cdMultiplier = 1 - (reduction / 100);

}).setCriteria(/\[Mage\] Cooldown Reduction \d+% -> (\d+)%/)

register("worldLoad", () => {

    dupe = true;
    cdMultiplier = 1;
    ticks = 0;

})

function getReduction() {

    let playerClass = getClassWithLevel();

    if (playerClass.includes("Mage")) {
        let levelRoman = playerClass.split(" ").pop();
        let level = romanToInt(levelRoman);
        let classReduction = 25 + Math.floor(level / 2);
        cdMultiplier = 1 - (classReduction / 100)
    }

}

const tickCounter = register("packetReceived", () => {

    if (--ticks <= 0) {
        tickCounter.unregister();
        tickDisplay.unregister();
    }

}).setFilteredClass(S32PacketConfirmTransaction).unregister()

const tickDisplay = register("renderOverlay", () => {

    if (!config.tact) return;

    let time = (ticks / 20).toFixed(2);
    text.setString(`&6Tact CD: &b${time}s`)
    text.setScale(data.tact.scale);
    text.draw(data.tact.x, data.tact.y);

}).unregister()

registerWhen(register("renderOverlay", () => {
    
    text.setString("&6Tact CD: &b20.00s");
    text.setScale(data.tact.scale);
    text.draw(data.tact.x, data.tact.y);

}), () => config.tactGui.isOpen())

registerWhen(register("dragged", (dx, dy, x, y, bn) => {

    if (bn == 2) return;

    data.tact.x = x;
    data.tact.y = y;
    data.save();

}), () => config.tactGui.isOpen())

register("scrolled", (x, y, dir) => {

    if (!config.tactGui.isOpen()) return;

    if (dir == 1) data.tact.scale += 0.05;
    else data.tact.scale -= 0.05;
    data.save();

})

register("guiMouseClick", (x, y, bn) => {

    if (!config.tactGui.isOpen() || bn != 2) return;

    data.tact.x = Renderer.screen.getWidth() / 2;
    data.tact.y = Renderer.screen.getHeight() / 2 - 30;
    data.tact.scale = 1;
    data.save();

})