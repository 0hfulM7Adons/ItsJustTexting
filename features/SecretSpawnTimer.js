import config from "../config"
import { S32PacketConfirmTransaction, START_MESSAGE } from "../util/util"
import { data } from "../util/data"
import { registerWhen } from "../../BloomCore/utils/Utils"
import { onScoreboardLine } from "../../BloomCore/utils/Events"

let ticks = 20;
let text = new Text("").setScale(2).setShadow(true).setAlign("CENTER");

const tickCounter = register("packetReceived", () => {

    if (--ticks == 0) ticks = 20;

}).setFilteredClass(S32PacketConfirmTransaction)

const tickDisplay = register("renderOverlay", () => {

    if (!config.sst) return;

    let color = ticks < 10 ? ticks < 5 ? "&c" : "&6" : "&a";
    text.setString(`${color}${ticks}`);
    text.setScale(data.sst.scale);
    text.draw(data.sst.x, data.sst.y);

}).unregister()

const checkSolo = register("tick", () => {

    if (partySize() < 0) return;
    if (partySize() > 1 && config.soloOnly) return checkSolo.unregister();
    
    tickDisplay.register();
    checkSolo.unregister();

}).unregister()

function partySize() {

    let match = TabList?.getNames()[0]?.removeFormatting()?.match(/Party \((\d)\)/);
    if (!match) return -1;
    return match[1];

}

onScoreboardLine((line, text) => {
    
    if (line != 6) return;
    ticks = 20;

})

register("chat", () => {

    if (!config.sst) return;

    checkSolo.register();
    ticks = 20;

}).setCriteria(START_MESSAGE)

register("chat", (message) => {

    if (!message.includes("[BOSS] Maxor")) return;

    tickDisplay.unregister();

}).setCriteria("${message}")

register("worldLoad", () => {

    tickDisplay.unregister();

})

registerWhen(register("renderOverlay", () => {
    
    text.setString("&a20");
    text.setScale(data.sst.scale);
    text.draw(data.sst.x, data.sst.y);

}), () => config.sstGui.isOpen())

registerWhen(register("dragged", (dx, dy, x, y, bn) => {

    if (bn == 2) return;

    data.sst.x = x;
    data.sst.y = y;
    data.save();

}), () => config.sstGui.isOpen())

register("scrolled", (x, y, dir) => {

    if (!config.sstGui.isOpen()) return;

    if (dir == 1) data.sst.scale += 0.05;
    else data.sst.scale -= 0.05;
    data.save();

})

register("guiMouseClick", (x, y, bn) => {

    if (!config.sstGui.isOpen() || bn != 2) return;

    data.sst.x = Renderer.screen.getWidth() / 2;
    data.sst.y = Renderer.screen.getHeight() / 2 + 20;
    data.sst.scale = 2;
    data.save();

})