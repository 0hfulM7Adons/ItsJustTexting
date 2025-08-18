import config from "../config"

import { MouseEvent, regions, isPlayerInBox  } from "../util/util"

let swapping = false;

register(MouseEvent, (event) => {

    const button = event.button;
    const state = event.buttonstate;

    if (button != 1) return;
    if (state) return;

    const heldItemName = Player?.getHeldItem()?.getName()?.toLowerCase();
    if (!heldItemName) return;

    if (heldItemName.toLowerCase().includes("bonemerang")) {
        Client.scheduleTask(1, () => performSwap(getSwap()))
    } else if (heldItemName.toLowerCase().includes("breath") && config.lbSwap) {
        Client.scheduleTask(1, () => performSwap("terminator"))
    }

})

function performSwap(item) {

    if (!config.autoSwap) return;

    let ind = Player?.getInventory()?.getItems()?.findIndex(i => i?.getName()?.toLowerCase()?.includes(item))

    if (swapping) return;
    
    if (ind < 0) return;
    if (ind > -1 && ind < 8) {
        swapping = true;
        ChatLib.chat(`swapping to ${ind}`)
        Player.setHeldItemIndex(ind);
        swapping = false;
    }

}

function getSwap() {
    if (isPlayerInBox(...regions.p1)) return config.maxor;
    else if (isPlayerInBox(...regions.p2)) return config.storm;
    else if (isPlayerInBox(...regions.mid)) return config.necron;
}