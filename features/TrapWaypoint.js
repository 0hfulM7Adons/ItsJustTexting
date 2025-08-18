import config from "../config"
import DmapDungeon from "../components/DmapDungeon"
import { componentToRealCoords } from "../components/MapUtils"
import { START_MESSAGE, RenderUtils, ColorUtils, AxisAlignedBB, javaColor } from "../util/util"

let trap;

const findTrap = register("tick", () => {

    const t = DmapDungeon.getRoomFromName("New Trap");
    if (!t) return;

    trap = t;
    findTrap.unregister();
    waypointRender.register();
    console.log("trap found")

}).unregister();

const waypointRender = register("renderWorld", () => {

    if (!config.trapWaypoint) return;

    const r = config.trapWaypointColor.getRed();
    const g = config.trapWaypointColor.getGreen();
    const b = config.trapWaypointColor.getBlue();
    const a = config.trapWaypointColor.getAlpha();
    const myColor = new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * a);

    if (!getWaypointCoords()) return;
    const [x, z] = getWaypointCoords();
    const y = 68;
    
    let box = new AxisAlignedBB(x - 0.01, y - 0.01, z - 0.01, x + 1.01, y + 1.01, z + 1.01);
    RenderUtils.INSTANCE.drawFilledAABB(box, myColor, true);

}).unregister()

function getWaypointCoords() {

    const trapCoords = componentToRealCoords(trap.center);
    const [tx, tz] = trapCoords;

    const door = trap.doors[0];
    const doorCoords = door?.getCoords();
    if (!doorCoords) return false;
    const [dx, dz] = [doorCoords[0], doorCoords[2]];

    const xDisp = tx - dx;
    const zDisp = tz - dz;

    const xOffset = config.xOffset - 1;
    const zOffset = config.zOffset - 1;
    
    if (xDisp == 0) {
        return zDisp > 0 ? [dx - xOffset, dz + zOffset] : [dx + xOffset, dz - zOffset];
    } else {
        return xDisp > 0 ? [dx + zOffset, dz + zOffset] : [dx - zOffset, dz - xOffset];
    }

}

register("chat", () => {

    if (!config.trapWaypoint) return;
    findTrap.register();

}).setCriteria(START_MESSAGE)

register("worldUnload", () => {

    trap = null;
    findTrap.unregister();
    waypointRender.unregister();

})