import config from "../config"
import { Vec3, Rendererr, ColorUtils, javaColor, getClassWithLevel, romanToInt } from "../util/util"

const mc = Client.getMinecraft().func_175598_ae();

const rft = register("renderWorld", () => {
    let r = config.trajectoryColor.getRed()
    let g = config.trajectoryColor.getGreen()
    let b = config.trajectoryColor.getBlue()
    let a = config.trajectoryColor.getAlpha()
    let color = new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * a)

    let vecs = calculateTrajectory();

    Rendererr.INSTANCE.draw3DLine(vecs, color, 2, true);
}).unregister();

register("chat", () => {
    if (!config.rapidFireTrajectory) return;

    rft.register();
    let duration = 10;
    let playerClass = getClassWithLevel();
    if (playerClass != "EMPTY") {
        let levelRoman = playerClass.split(" ").pop();
        let level = romanToInt(levelRoman)
        duration = 5 + Math.floor(level / 10);
    }
    
    setTimeout(() => {
        rft.unregister();
    }, duration * 1000)
}).setCriteria("Used Rapid Fire!")

function calculateTrajectory() {
    let yawRad = Player.getYaw() * (Math.PI / 180);
    let pitchRad = Player.getPitch() * (Math.PI / 180);

    let x = -Math.cos(yawRad) * 0.09;
    let y = (Player.isSneaking() ? 1.54 : 1.62) - 0.09;
    let z = -Math.sin(yawRad) * 0.09;

    let [playerX, playerY, playerZ] = [mc.field_78730_l, mc.field_78731_m, mc.field_78728_n]

    let offset = new Vec3(x, y, z);
    let pos = new Vec3(playerX, playerY, playerZ).func_178787_e(offset);
    let velocityMultiplier = 2;

    let lookX = -Math.sin(yawRad) * Math.cos(pitchRad);
    let lookY = -Math.sin(pitchRad);
    let lookZ = Math.cos(yawRad) * Math.cos(pitchRad);

    let look = new Vec3(lookX, lookY, lookZ).func_72432_b();
    let motion = new Vec3(look.field_72450_a * velocityMultiplier, look.field_72448_b * velocityMultiplier, look.field_72449_c * velocityMultiplier)
    let hitResult = false;

    let lines = new ArrayList();

    for (let i = 0; i < 100; ++i) {
        if (hitResult) break;
        lines.add(pos);

        let rayTraceHit = World.getWorld()?.func_147447_a(pos, motion.func_178787_e(pos), false, true, false);
        if (rayTraceHit) {
            lines.add(rayTraceHit.field_72307_f);
            hitResult = true;
        }

        pos = pos.func_178787_e(motion);
        motion = new Vec3(motion.field_72450_a * 0.99, motion.field_72448_b * 0.99 - 0.05, motion.field_72449_c * 0.99);
    }

    return lines;
}