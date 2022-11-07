import { abc, data, PREFIX, short_number } from "../utils/utils";
import request from '../../requestV2';
import config from "../config";
let oldcurrent = 0;
let oldperc = null;
let session_xp = 0;
let session_pet_xp = 0;
let sorrow_profit = 0;
let volta_profit = 0;
let plasma_profit = 0;
let is_in_mist = false;
register('actionbar', (g, total, c) => {
    let scoreb = Scoreboard.getLines(false);
    is_in_mist = scoreb[4].getName().includes("The Mist") || scoreb[5].getName().includes("The Mist");
    if(is_in_mist){
        let total_xp = parseInt(total.replace(/\D/g, ""));
        if(oldcurrent == 0) oldcurrent = total_xp;
        else if(total_xp !== oldcurrent){
            session_xp += total_xp-oldcurrent;
            session_pet_xp += (total_xp-oldcurrent)*1.5;
            data.ghost_kills += 1;
            data.save();
            oldcurrent = total_xp;
        }
    }
}).setCriteria('${*}+${gained} Combat (${total}/${current})${*}');
register("actionBar", (g, percentage) => {
    let gained = parseInt(g);
    if(percentage.includes("%")){
        let scoreb = Scoreboard.getLines(false);
        is_in_mist = scoreb[4].getName().includes("The Mist") || scoreb[5].getName().includes("The Mist");
        if(is_in_mist){
            let total_perc = percentage.replace("%","");
            if(oldperc == null) oldperc = `${total_perc}`;
            else if(total_perc !== oldperc){
                session_xp += gained;
                session_pet_xp += gained*1.5;
                data.ghost_kills += 1;
                data.save();
                oldperc = `${total_perc}`;
            }
        }
    }
}).setCriteria("${*}+${g} Combat (${percentage})${*}")
register("chat", (drop, mf) => {
    if(drop == "Plasma") data.plasma_gained += 1;
    else if(drop == "Volta") data.voltas_gained += 1;
    else if(drop == "Sorrow") data.sorrows_gained += 1;
    else if(drop == "Ghostly Boots") data.ghostly_boots += 1;
    data.magic_find = parseInt(mf);
    data.save();
}).setCriteria("RARE DROP! ${drop} (+${mf}% ✯ Magic Find)");
register("chat", () => {
    data.death_materialized += 1;
    data.save();
}).setCriteria("The ghost's death materialized 1,000,000 coins from the mists!");
register("step", () => {
    if(!config.config_display) return;
    request({url : `https://sky.coflnet.com/api/item/price/SORROW/bin`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => sorrow_profit = JSON.parse(response).lowest).catch(error =>{ print(error);});
    request({url : `https://sky.coflnet.com/api/item/price/VOLTA/bin`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => volta_profit = JSON.parse(response).lowest).catch(error =>{ print(error);});
    request({url : `https://sky.coflnet.com/api/item/price/PLASMA/bin`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => plasma_profit = JSON.parse(response).lowest).catch(error =>{ print(error);});
}).setDelay(20);
register("renderOverlay", () => {
  if(!config.config_display) return;
  if (abc.isOpen()) {
    const txt = "Click anywhere to move!"
    Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
  }
  let ghost_txt = `&7Ghost Kills: &6${short_number(data.ghost_kills)}`;
  let session_xp_txt = `&7Session XP: &6${short_number(session_xp)}`;
  let session_pet_xp_txt = `&7Session Pet XP: &6${short_number(session_pet_xp)}`;
  let sorrow_txt = `&9Sorrows: &6${short_number(data.sorrows_gained)}  &7Average: &6${Math.trunc(data.ghost_kills/data.sorrows_gained)}`;
  let volta_txt = `&9Volta: &6${short_number(data.voltas_gained)}`;
  let plasma_txt = `&9Plasma: &6${short_number(data.plasma_gained)}`;
  let ghostly_txt = `&9Ghostly Boots: &6${short_number(data.ghostly_boots)}`;
  let dmat = `&7Death Materialized: &6${short_number(data.death_materialized)}`;
  let mf_txt = `&bMagic Find: &6+${short_number(data.magic_find)}%`;
  let all_profit = (sorrow_profit*data.sorrows_gained)+(volta_profit*data.voltas_gained)+(plasma_profit*data.plasma_gained)+(77777*data.ghostly_boots)+(1000000*data.death_materialized);
  let total_profit = `&eTotal Profit: &6${short_number(all_profit)}`;
  Renderer.drawStringWithShadow(`${PREFIX}\n${ghost_txt}\n${session_xp_txt}\n${session_pet_xp_txt}\n${sorrow_txt}\n${volta_txt}\n${plasma_txt}\n${ghostly_txt}\n${dmat}\n${mf_txt}\n${total_profit}`, data.x, data.y)
});