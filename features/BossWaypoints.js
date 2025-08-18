import config from "../config"
import { waypointData as data } from "../util/data"
import { RenderUtils, ColorUtils, AxisAlignedBB, javaColor, Vec3, MouseEvent, KeyBinding } from "../util/util"

let editMode = false;
let ringEditMode = false;
let inRing = false;
let force = false;
let confirm = false;

const mc = Client.getMinecraft().func_175598_ae();

register("command", (...args) => {

    switch (args[0]) {
        case "edit":
            if (ringEditMode) {
                ringEditMode = false;
                ChatLib.chat(`Ring edit mode: ${ringEditMode}`);
            }
            editMode = !editMode;
            editMode ? editListener.register() : editListener.unregister();
            return ChatLib.chat(`Edit mode: ${editMode}`);
        case "rings":
            if (editMode) {
                editMode = false;
                ChatLib.chat(`Edit mode: ${editMode}`);
            }
            ringEditMode = !ringEditMode;
            ringEditMode ? editListener.register() : editListener.unregister();
            return ChatLib.chat(`Ring edit mode: ${ringEditMode}`);
        case "force":
            force = !force;
            force ? waypointRenderer.register() : waypointRenderer.unregister();
            force ? jump.register() : jump.unregister();
            return ChatLib.chat(`Force render waypoints: ${force}`);
        case "reset":
            if (!confirm) {
                confirm = true;
                setTimeout(() => confirm = false, 5000);
                return ChatLib.chat("Are you sure you want to reset your waypoints? Run bwp reset again within 5 seconds to reset all waypoints");
            } else {
                data.waypoints = [];
                data.save();
                return ChatLib.chat("Waypoints reset");
            }
        default: 
            return ChatLib.chat(`/bwp [edit|rings|force|reset]`);
    }

}).setName("bwp")

const editListener = register(MouseEvent, (event) => {

    const button = event.button;
    const state = event.buttonstate;

    if (!state || button != 1) return;

    const lookingAt = Player.lookingAt();
    if (!lookingAt instanceof Block) return;

    const [x, y, z] = [lookingAt.x, lookingAt.y, lookingAt.z];
    if (!x || !y || !z) return;
    editMode ? handleWaypoint(x, y, z) : handleRing(x, y, z);

    cancel(event);

}).unregister()

const waypointRenderer = register("renderWorld", () => {

    const r1 = config.bwpColor.getRed();
    const g1 = config.bwpColor.getGreen();
    const b1 = config.bwpColor.getBlue();
    const a1 = config.bwpColor.getAlpha();
    const bwpColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1);

    for (let w of data.waypoints) {
        let box = new AxisAlignedBB(w.x - 0.01, w.y - 0.01, w.z - 0.01, w.x + 1.01, w.y + 1.01, w.z + 1.01);
        RenderUtils.INSTANCE.drawFilledAABB(box, bwpColor, !config.phase);
    }

    const r2 = config.ringColor.getRed();
    const g2 = config.ringColor.getGreen();
    const b2 = config.ringColor.getBlue();
    const a2 = config.ringColor.getAlpha();
    const ringColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2);
    const lineColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * 255);

    if (!config.jumpRings) return;
    for (let r of data.rings) {
        let box = new AxisAlignedBB(r.x - 0.01, r.y - 0.01, r.z - 0.01, r.x + 1.01, r.y + 1.01, r.z + 1.01);
        RenderUtils.INSTANCE.drawFilledAABB(box, ringColor, !config.phase);
    }

    if (!config.ee2Line) return;
    let vec1 = config.lineMode == 0 ? new Vec3(68.5, 109, 127.5) : new Vec3(68, 109, 128);
    let vec2 = new Vec3(59, 109, 130);
    let points = new ArrayList();
    points.add(vec1);
    points.add(vec2);
    RenderUtils.INSTANCE.drawLines(points, lineColor, 4, true);

}).unregister()

const jump = register("renderWorld", () => {

    if (!config.jumpRings) return;
    if (Client.isInGui()) return;

    const [playerX, playerY, playerZ] = [mc.field_78730_l, mc.field_78731_m, mc.field_78728_n]

    let rings = data.rings;
    for (let r of rings) {

        let distX = playerX - r.x;
        let distY = playerY - r.y;
        let distZ = playerZ - r.z;

        if (distX > 0 && distX < 1 && distY >= 1 && distY < 1.1 && distZ > 0 && distZ < 1 && !inRing) {
            inRing = true;
            edgeJump.register();
        } else {
            inRing = false;
        }

    }

}).unregister()

const edgeJump = register("renderWorld", () => {

    let ID = World.getBlockAt(Player.getX(), Player.getY() - 0.1, Player.getZ()).type.getID();
    
    if (ID == 0) {
        Client.scheduleTask(0, () => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), true) });
        Client.scheduleTask(2, () => { KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74314_A.func_151463_i(), false) });
        edgeJump.unregister()
    }

}).unregister()

function handleWaypoint(x, y, z) {

    if (data.waypoints.length > 0) {
        for (let i = 0; i < data.waypoints.length; ++i) {
            let w = data.waypoints[i];
            if (x == w.x && y == w.y && z == w.z) {
                data.waypoints.splice(i, 1);
                data.save();
                return ChatLib.chat(`Removed waypoint at ${x}, ${y}, ${z}`)
            }
        }
    }

    const toPush = {
        x: x,
        y: y,
        z: z
    }
    data.waypoints.push(toPush);
    data.save();
    return ChatLib.chat(`Added waypoint at ${x}, ${y}, ${z}`);

}

function handleRing(x, y, z) {

    if (data.rings.length > 0) {
        for (let i = 0; i < data.rings.length; ++i) {
            let w = data.rings[i];
            if (x == w.x && y == w.y && z == w.z) {
                data.rings.splice(i, 1);
                data.save();
                return ChatLib.chat(`Removed ring at ${x}, ${y}, ${z}`)
            }
        }
    }

    const toPush = {
        x: x,
        y: y,
        z: z
    }
    data.rings.push(toPush);
    data.save();
    return ChatLib.chat(`Added ring at ${x}, ${y}, ${z}`);

}

register("chat", () => {

    if (config.bwp) {
        waypointRenderer.register();
        jump.register();
    }

}).setCriteria("[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!")

register("worldLoad", () => {

    waypointRenderer.unregister();
    jump.unregister();

})