import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @NumberProperty,
} from '../Vigilance/index';

@Vigilant("ItsJustTexting", "§9bro its just texting", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["Trap", "Secret Spawn Timer", "Tact Insert Cooldown", "Auto Swap", "Boss Waypoints", "Relic Triggerbot", "Auto Clicker"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {

    /*
    GUIs
    */

    sstGui = new Gui();
    tactGui = new Gui();

    /*
    Trap
    */

    @SwitchProperty({
        name: "Tac Trap Waypoint",
        description: "Draws waypoint at center of door, use offset to customize if you use a different spot",
        category: "Trap"
    })
    trapWaypoint = false;

    @ColorProperty({
        name: "Waypoint Color",
        category: "Trap"
    })
    trapWaypointColor = new Color(1, 0, 0, 1);

    @SelectorProperty({
        name: "X Offset",
        description: "Not literally X direction, but +1 means 1 block to the right of the center",
        category: "Trap",
        options: [
            "-1",
            "0",
            "+1"
        ]
    })
    xOffset = 1;

    @SelectorProperty({
        name: "Z Offset",
        description: "Not literally Z direction, but +1 means 1 block forward towards the trap room",
        category: "Trap",
        options: [
            "-1",
            "0",
            "+1"
        ]
    })
    zOffset = 1;

    /*
    Secret Spawn Timer
    */

    @SwitchProperty({
        name: "Secret Spawn Timer",
        category: "Secret Spawn Timer"
    })
    sst = false;

    @ButtonProperty({
        name: "Move Secret Spawn Timer",
        category: "Secret Spawn Timer",
        placeholder: "Move"
    })
    MoveSstGui() {
        this.sstGui.open();
    }

    @SwitchProperty({
        name: "Solo Only",
        description: "Only show the timer in solo runs",
        category: "Secret Spawn Timer"
    })
    soloOnly = false;

    /*
    Tact Insert Cooldown
    */

    @SwitchProperty({
        name: "Tactical Insertion Cooldown Timer",
        category: "Tact Insert Cooldown"
    })
    tact = false;

    @ButtonProperty({
        name: "Move Tact Insert Cooldown Timer",
        category: "Tact Insert Cooldown",
        placeholder: "Move"
    })
    MoveTactGui() {
        this.tactGui.open();
    }


    /*
    Auto Swap
    */

    @SwitchProperty({
        name: "Main Toggle",
        category: "Auto Swap",
        subcategory: "General"
    })
    autoSwap = false;

    @SwitchProperty({
        name: "Storm LB Swap",
        category: "Auto Swap",
        subcategory: "General"
    })
    lbSwap = false;

    @TextProperty({
        name: "Maxor Swap",
        category: "Auto Swap",
        subcategory: "Swaps",
        placeholder: "hyperion"
    })
    maxor = "hyperion";

    @TextProperty({
        name: "Storm Swap",
        category: "Auto Swap",
        subcategory: "Swaps",
        placeholder: "volcano"
    })
    storm = "volcano";

    @TextProperty({
        name: "Necron Swap",
        category: "Auto Swap",
        subcategory: "Swaps",
        placeholder: "hyperion"
    })
    necron = "hyperion";

    /*
    Boss Waypoints
    */

    @SwitchProperty({
        name: "Toggle",
        category: "Boss Waypoints",
        subcategory: "General"
    })
    bwp = false;

    @SwitchProperty({
        name: "Jump Rings",
        category: "Boss Waypoints",
        subcategory: "General"
    })
    jumpRings = false;

    @SwitchProperty({
        name: "EE2 Jump Line",
        category: "Boss Waypoints",
        subcategory: "General"
    })
    ee2Line = false;

    @SelectorProperty({
        name: "Line Starting Point",
        category: "Boss Waypoints",
        subcategory: "General",
        options: [
            "Stair",
            "Full Block"
        ]
    })
    lineMode = 0;

    @SwitchProperty({
        name: "Show Through Blocks",
        category: "Boss Waypoints",
        subcategory: "Color"
    })
    phase = false;

    @ColorProperty({
        name: "Waypoint Color",
        category: "Boss Waypoints",
        subcategory: "Color"
    })
    bwpColor = new Color(0, 1, 0, 1);

    @ColorProperty({
        name: "Jump Ring Color",
        category: "Boss Waypoints",
        subcategory: "Color"
    })
    ringColor = new Color(1, 0, 0, 1);

    /*
    Relic Triggerbot
    */

    @SwitchProperty({
        name: "Relic Pickup Triggerbot",
        category: "Relic Triggerbot"
    })
    relicPickup = false;

    @SwitchProperty({
        name: "Relic Place Triggerbot",
        category: "Relic Triggerbot",
    })
    relicPlace = false;

    /*
    Auto Clicker
    */

    @SwitchProperty({
        name: "Left Click",
        category: "Auto Clicker",
        subcategory: "Left Click"
    })
    lc = false;

    @NumberProperty({
        name: "Min CPS",
        category: "Auto Clicker",
        subcategory: "Left Click",
        min: 1,
        max: 20
    })
    lcMin = 16;

    @NumberProperty({
        name: "Max CPS",
        category: "Auto Clicker",
        subcategory: "Left Click",
        min: 1,
        max: 20
    })
    lcMax = 20;

    @SwitchProperty({
        name: "Right Click",
        category: "Auto Clicker",
        subcategory: "Right Click"
    })
    rc = false;

    @NumberProperty({
        name: "Min CPS",
        category: "Auto Clicker",
        subcategory: "Right Click",
        min: 1,
        max: 30
    })
    rcMin = 16;

    @NumberProperty({
        name: "Max CPS",
        category: "Auto Clicker",
        subcategory: "Right Click",
        min: 1,
        max: 30
    })
    rcMax = 20;

    @SliderProperty({
        name: "Hold Confirmation Time",
        description: "Need to hold right click for this long before autoclicker starts",
        category: "Auto Clicker",
        subcategory: "Right Click",
        min: 0,
        max: 1000
    })
    holdTime = 200;

    /*
    Constructor
    */

    constructor() {
        this.initialize(this);
    }
    
}

export default new Settings();