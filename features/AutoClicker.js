import config from "../config"
import { acData as data } from "../util/data"
import { MouseEvent, getItemUUID, leftClick, rightClick, C09PacketHeldItemChange } from "../util/util"

register("command", (...args) => {

    if (args[0] === "add") {

        const item = Player.getHeldItem();
        if (!item) return ChatLib.chat("no item held");

        const uuid = getItemUUID(item);
        if (!uuid) return ChatLib.chat("item doesn't have uuid");
        if (data.lcItems.includes(uuid)) return ChatLib.chat("item already added");

        data.lcItems.push(uuid);
        data.save();
        return ChatLib.chat(`${item.getName()} &radded to lc autoclicker`);

    } else if (args[0] === "remove") {

        const item = Player.getHeldItem();
        if (!item) return ChatLib.chat("no item held");

        const uuid = getItemUUID(item);
        if (!uuid) return ChatLib.chat("item doesn't have uuid");

        const ind = data.lcItems.indexOf(uuid);
        if (ind < 0) return ChatLib.chat("item not added yet");

        data.lcItems.splice(ind, 1);
        data.save();
        return ChatLib.chat(`${item.getName()} &rremoved from lc autoclicker`);

    } else if (args[0] === "clear") {

        while (data.lcItems.length) data.lcItems.pop();
        data.save();
        return ChatLib.chat("lc autoclicker list cleared");
        
    }

}).setName("lcac")

register("command", (...args) => {

    if (args[0] === "add") {

        const item = Player.getHeldItem();
        if (!item) return ChatLib.chat("no item held");

        const uuid = getItemUUID(item);
        if (!uuid) return ChatLib.chat("item doesn't have uuid");
        if (data.rcItems.includes(uuid)) return ChatLib.chat("item already added");

        data.rcItems.push(uuid);
        data.save();
        return ChatLib.chat(`${item.getName()} &radded to rc autoclicker`);

    } else if (args[0] === "remove") {

        const item = Player.getHeldItem();
        if (!item) return ChatLib.chat("no item held");

        const uuid = getItemUUID(item);
        if (!uuid) return ChatLib.chat("item doesn't have uuid");

        const ind = data.rcItems.indexOf(uuid);
        if (ind < 0) return ChatLib.chat("item not added yet");

        data.rcItems.splice(ind, 1);
        data.save();
        return ChatLib.chat(`${item.getName()} &rremoved from rc autoclicker`);

    } else if (args[0] === "clear") {

        while (data.rcItems.length) data.rcItems.pop();
        data.save();
        return ChatLib.chat("rc autoclicker list cleared");

    }

}).setName("rcac")

register(MouseEvent, (event) => {

    const button = event.button;
    const state = event.buttonstate;

    if (!config.lc) return;
    if (button !== 0) return;

    if (state) {
        const item = Player.getHeldItem();
        if (!item) return;

        const uuid = getItemUUID(item);
        if (!uuid || !data.lcItems.includes(uuid)) return;

        cancel(event);
        lcac.register();
    } else {
        lcac.unregister();
    }
    
})

let startHolding;

register(MouseEvent, (event) => {

    const button = event.button;
    const state = event.buttonstate;

    if (!config.rc) return;
    if (button !== 1) return;

    if (state) {
        const item = Player.getHeldItem();
        if (!item) return;

        const uuid = getItemUUID(item);
        if (!uuid || !data.rcItems.includes(uuid)) return;

        startHolding = Date.now();
        holding.register();
    } else {
        holding.unregister();
        rcac.unregister();
    }

})

const holding = register("step", () => {

    if (Date.now() - startHolding < config.holdTime) return;

    rcac.register();
    holding.unregister();

}).unregister()

register("guiOpened", () => {

    lcac.unregister();
    rcac.unregister();
    holding.unregister();

})

register("packetSent", () => {

    const item = Player.getHeldItem();

    if (item) {
        const uuid = getItemUUID(item);
        if (uuid) {
            if (!data.lcItems.includes(uuid)) return lcac.unregister();
            if (!data.rcItems.includes(uuid)) return rcac.unregister();
        }
    }

    lcac.unregister();
    rcac.unregister();

}).setFilteredClass(C09PacketHeldItemChange)

let lastlc = 0;
let lcdelay = 1000 / (Math.random() * (config.lcMax - config.lcMin) + config.lcMin);

const lcac = register("step", () => {

    if (Date.now() - lastlc < lcdelay) return;

    leftClick();
    lastlc = Date.now();
    lcdelay = 1000 / (Math.random() * (config.lcMax - config.lcMin) + config.lcMin);

}).setFps(240).unregister()

let lastrc = 0;
let rcdelay = 1000 / (Math.random() * (config.rcMax - config.rcMin) + config.rcMin);

const rcac = register("step", () => {

    if (Date.now() - lastrc < rcdelay) return;

    rightClick();
    lastrc = Date.now();
    rcdelay = 1000 / (Math.random() * (config.rcMax - config.rcMin) + config.rcMin);

}).setFps(240).unregister()