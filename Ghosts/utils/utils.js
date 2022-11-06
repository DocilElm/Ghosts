import PogObject from "PogData";
export let data = new PogObject("Ghosts", {
    "ghost_kills": 0,
    "sorrows_gained": 0,
    "voltas_gained": 0,
    "plasma_gained": 0,
    "ghostly_boots": 0,
    "death_materialized": 0,
    "magic_find": 0,
    "x": 0,
    "y": 0,
    "first_time": true
}, ".ghosts_data.json");
export const PREFIX = "&8[Ghosts] ";
export const short_number = (num) => {
    if(num == undefined) return;
    return num.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
export let abc = new Gui()
register("command", () => {
    abc.open();
}).setName("ghostsdisplayrender");
register("dragged", (dx, dy, x, y) => {
      if (!abc.isOpen()) return
      data.x = x
      data.y = y
      data.save()
});
register("command", () => {
    data.ghost_kills = 0;
    data.sorrows_gained = 0;
    data.voltas_gained = 0;
    data.plasma_gained = 0;
    data.ghostly_boots = 0;
    data.death_materialized = 0;
    data.save();
}).setName("ghosts_rs");