import { abc, data, PREFIX, short_number } from "../utils/utils"
import request from '../../requestV2'
import config from "../config"

let oldChampion = 0
let oldHeldItem = null

let xp_gained_per = 0
let session_xp = 0
let session_pet_xp = 0
let sorrow_profit = 0
let volta_profit = 0
let plasma_profit = 0
let is_in_mist = false

register("actionbar", (g) => {
    if(config.config_type !== 3 || Player.getHeldItem() == null || !Player.getHeldItem()) return

    let scoreb = Scoreboard.getLines(false)
    is_in_mist = scoreb[4].getName().includes("The Mist") || scoreb[5].getName().includes("The Mist")
    if(!is_in_mist) return

    xp_gained_per = parseFloat(g)
    
    if(!is_in_mist || !World.isLoaded()) return
    let newChampion = parseFloat(Player.getHeldItem().getNBT().toObject()["tag"]["ExtraAttributes"].champion_combat_xp) ?? null
    if(newChampion == null || !newChampion) return

    if(oldChampion == 0) oldChampion = newChampion
    if(oldHeldItem == null && Player.getHeldItem() !== null) oldHeldItem = Player.getHeldItem().getName()

    else if(oldChampion !== newChampion && oldHeldItem == Player.getHeldItem().getName()){
        session_xp += xp_gained_per
        session_pet_xp += xp_gained_per*1.5
        data.ghost_kills += 1
        data.save()
        oldChampion = newChampion
    }

}).setCriteria('${*}+${g} Combat ${*}')

register("step", () => {
    if(!config.config_display || config.config_type !== 3) return

    request({url : `https://sky.coflnet.com/api/item/price/SORROW/bin`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => sorrow_profit = JSON.parse(response).lowest).catch(error =>{ print(error)})
    request({url : `https://sky.coflnet.com/api/item/price/VOLTA/bin`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => volta_profit = JSON.parse(response).lowest).catch(error =>{ print(error)})
    request({url : `https://sky.coflnet.com/api/item/price/PLASMA/bin`,headers: { 'User-Agent': ' Mozilla/5.0' }}).then(response => plasma_profit = JSON.parse(response).lowest).catch(error =>{ print(error)})

}).setDelay(20)

register("renderOverlay", () => {
    if(!config.config_display || config.config_type !== 3) return

    if (abc.isOpen()) {
      const txt = "Click anywhere to move!"
      Renderer.drawStringWithShadow(txt, Renderer.screen.getWidth()/2 - Renderer.getStringWidth(txt)/2, Renderer.screen.getHeight()/2)
    }

    let ghost_txt = `&7Ghost Kills: &6${short_number(data.ghost_kills)}`
    let session_xp_txt = `&7Session XP: &6${short_number(session_xp.toFixed(2))}`
    let session_pet_xp_txt = `&7Session Pet XP: &6${short_number(session_pet_xp.toFixed(2))}`
    let sorrow_txt = `&9Sorrows: &6${short_number(data.sorrows_gained)}  &7Average: &6${Math.trunc(data.ghost_kills/data.sorrows_gained)}`
    let volta_txt = `&9Volta: &6${short_number(data.voltas_gained)}`
    let plasma_txt = `&9Plasma: &6${short_number(data.plasma_gained)}`
    let ghostly_txt = `&9Ghostly Boots: &6${short_number(data.ghostly_boots)}`
    let dmat = `&7Death Materialized: &6${short_number(data.death_materialized)}`
    let mf_txt = `&bMagic Find: &6+${short_number(data.magic_find)}%`
    let all_profit = (sorrow_profit*data.sorrows_gained)+(volta_profit*data.voltas_gained)+(plasma_profit*data.plasma_gained)+(77777*data.ghostly_boots)+(1000000*data.death_materialized)
    let total_profit = `&eTotal Profit: &6${short_number(all_profit)}`

    Renderer.drawStringWithShadow(`${PREFIX}\n${ghost_txt}\n${session_xp_txt}\n${session_pet_xp_txt}\n${sorrow_txt}\n${volta_txt}\n${plasma_txt}\n${ghostly_txt}\n${dmat}\n${mf_txt}\n${total_profit}`, data.x, data.y)
})