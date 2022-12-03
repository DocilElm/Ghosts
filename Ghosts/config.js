import {
    @Vigilant,
    @SwitchProperty,
    @SelectorProperty,
    @ButtonProperty,
    Color 
} from 'Vigilance';

@Vigilant("Ghosts", "§8Ghosts §fSettings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);
    }
    @SwitchProperty({
        name: "Display",
        description: "Display Ghosts Stats",
        category: "General",
        subcategory: "General"
    })
    config_display = true
    @SelectorProperty({
        name: "Type",
        description: "Tracking Type for SessionXP and Ghosts Kills\n§4This Might Not Be Accurate",
        category: "General",
        subcategory: "General",
        options: ["XP Gained", "Book Of Stats", "Entity Killed", "Champion Enchant"]
    })
    config_type = 0;
    @ButtonProperty({
        name: "Display Location",
        description: "Changes The Display Location",
        category: "General",
        subcategory: "General",
        placeholder: "Change"
    })
    action() {
        ChatLib.command("ghostsdisplayrender", true);
    }
    @ButtonProperty({
        name: "Reset Stats",
        description: "Reset Your Ghosts Display Stats",
        category: "General",
        subcategory: "General",
        placeholder: "Change"
    })
    actionz() {
        ChatLib.command("ghosts_rs", true);
    }
}

export default new Settings();