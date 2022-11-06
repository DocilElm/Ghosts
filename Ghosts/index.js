/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import Settings from "./config";
import { data, PREFIX } from "./utils/utils";
import "./utils/utils";
import "./features/counter";
register("command", () => Settings.openGUI()).setName("ghosts", true);
register("step", () => {
    if (data.first_time) {
        data.first_time = false; 
        data.save();
        ChatLib.chat("");
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aDo /ghosts For Configs!`)).chat();
        new TextComponent(ChatLib.getCenteredText(`${PREFIX}&aJoin Our Discord!  &b&nDiscord&r &7(Click)`)).setClickAction("open_url").setClickValue("https://discord.gg/SK9UDzquEN").chat();
        ChatLib.chat("");
    };
}).setFps(1);