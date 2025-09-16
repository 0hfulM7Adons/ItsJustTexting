export const RenderUtils = Java.type("me.odinmain.utils.render.RenderUtils");
export const Rendererr = Java.type("me.odinmain.utils.render.Renderer");
export const ColorUtils = Java.type("me.odinmain.utils.render.Color");
export const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
export const javaColor = Java.type("java.awt.Color");
export const Vec3 = Java.type("net.minecraft.util.Vec3");

export const MouseEvent = Java.type("net.minecraftforge.client.event.MouseEvent");
export const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");

export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand");

export const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");
export const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");

export const C09PacketHeldItemChange = Java.type("net.minecraft.network.play.client.C09PacketHeldItemChange");

export const START_MESSAGE = "[NPC] Mort: Here, I found this map when I first entered the dungeon.";

export const regions = {
    p1: [42, 105, 220, 230, 12, 84],
    p2: [20, 85, 163, 213, 0, 107],
    gpad: [20, 42, 170, 172, 0, 22],
    pillars: [33, 60, 165, 195, 31, 76],
    ppillar: [87, 114, 163, 172, 31, 76],
    ppad: [87, 127, 163, 172, 85, 107],
    ypad: [21, 52, 165, 177, 85, 107],
    s1: [89, 113, 106, 143, 30, 122],
    s2: [19, 111, 106, 143, 121, 145],
    s3: [-6, 20, 106, 143, 50, 143],
    s4: [-2, 89, 106, 143, 30, 51],
    drop: [36, 73, 58, 96, 95, 122],
    mid: [46, 63, 58, 96, 68, 85],
    p5: [14, 99, 5, 8, 52, 134]
};

export function isPlayerInBox(x1, x2, y1, y2, z1, z2) {
    const x = Player.getX();
    const y = Player.getY();
    const z = Player.getZ();

    return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
            y >= Math.min(y1, y2) && y <= Math.max(y1, y2) &&
            z >= Math.min(z1, z2) && z <= Math.max(z1, z2));
};

export function getHeldItemID() {
    const item = Player.getHeldItem();
    const itemId = item?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("id");
    return itemId;
};

export function getItemUUID(item) {
	return item?.getNBT()?.getCompoundTag("tag")?.getCompoundTag("ExtraAttributes")?.getString("uuid");
}

export const removeUnicode = (string) => typeof(string) !== "string" ? "" : string.replace(/[^\u0000-\u007F]/g, "")

export function getClassWithLevel() {
    let index = TabList?.getNames()?.findIndex(line => line?.toLowerCase()?.includes(Player.getName()));
    if (index == -1) return "EMPTY";
    
    let match = TabList?.getNames()[index]?.removeFormatting().match(/(?:\[\d+\]\s*)?(?:.+?) \((.+?)\)/)
    if (!match) return "EMPTY";
    
    return removeUnicode(match[1]);
};

const romanMap = {
    I: 1,
    V: 5,
    X: 10,
    L: 50
};

export function romanToInt(roman) {
    let total = 0;
    let prev = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
        const value = romanMap[roman[i]];
        if (value < prev) {
            total -= value;
        } else {
            total += value;
            prev = value;
        }
    }

    return total;
}

export function leftClick() {
    const leftClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147116_af", null);
	leftClickMethod.setAccessible(true);
	leftClickMethod.invoke(Client.getMinecraft(), null);
}

export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);
} 

const gameSettings = Client.getMinecraft().field_71474_y;
export function releaseForward() {
    KeyBinding.func_74510_a(gameSettings.field_74351_w.func_151463_i(), false);
}