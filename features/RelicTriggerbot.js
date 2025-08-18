import config from "../config"
import { rightClick, EntityArmorStand } from "../util/util"

let relic;
const relicCoords = {

    Green: { x: 49, y: 7, z: 44 },
    Red: { x: 51, y: 7, z: 42 },
    Purple: { x: 54, y: 7, z: 41 },
    Orange: { x: 57, y: 7, z: 42 },
    Blue: { x: 59, y: 7, z: 44 }
    
};

let lastClick = 0;

register("tick", () => {

    if (!config.relicPickup) return;
    if (Date.now() - lastClick < 4000) return;

    const la = Player.lookingAt();
    if (!(la instanceof Entity)) return;

    const mcEntity = la.entity;
    if (!(mcEntity instanceof EntityArmorStand)) return;

    const helmet = mcEntity.func_82169_q(3);
    if (!helmet) return;
    const helmetName = ChatLib.removeFormatting(new Item(helmet).getName());
    if (!helmetName.includes("Relic")) return;

    rightClick();
    lastClick = Date.now();

})

register("chat", (name, relicPicked) => {

    if (!config.relicPlace) return;
    if (name != Player.getName()) return;
    relic = relicPicked;
    placeRelic.register();

}).setCriteria(/(\w+) picked the Corrupted (\w+) Relic!/)

const placeRelic = register("DrawBlockHighlight", () => {

    const la = Player.lookingAt();
    if (!la || !(la instanceof Block)) return;

    let [x, y, z] = [la.getX(), la.getY(), la.getZ()];

    let coords = relicCoords[relic];
    if (coords.x != x || (coords.y != y && coords.y != y + 1) || coords.z != z) return;

    if (!Player.getHeldItem()?.getName()?.includes("Relic")) Player.setHeldItemIndex(8);

    rightClick();
    placeRelic.unregister();

}).unregister()

register("worldLoad", () => {

    placeRelic.unregister();
    relic = null;
    
})