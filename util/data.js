import PogObject from "../../PogData/index"

export const data = new PogObject("Astra", {
    sst: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 20,
        scale: 2
    },
    tact: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 - 30,
        scale: 2
    }
}, "data/data.json")

export const waypointData = new PogObject("Astra", {
    waypoints: [],
    rings: []
}, "data/waypoints.json")

export const acData = new PogObject("Astra", {
    lcItems: [],
    rcItems: []
}, "data/autoclicker.json")

export default data;