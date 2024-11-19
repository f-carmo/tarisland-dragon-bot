import fs from "fs/promises";
import { GuildConfig } from "../models/guilds-config";

export class ConfigService {
    private static caminho = "src/assets/servers-configs.json";

    static async fileToJsonObject() : Promise<GuildConfig[]> {
        
        const stats = await fs.stat(this.caminho);
        if (stats.size === 0) {
            return [];
        }

        return JSON.parse(await fs.readFile(this.caminho, "utf-8"));
    }

    static async save(novoObjeto: any) {
        try {
            await fs.writeFile(this.caminho, JSON.stringify(novoObjeto, null, 2), "utf-8");
        } catch (error) {
            console.error(error);
        }
    }

    static getGuildConfig (list: GuildConfig[], guildId: any) {
        if (Array.isArray(list)) {
            const guildConfig = list.find((guildConfig: GuildConfig) => guildConfig.guildId == guildId);

            if (!guildConfig) {
                return this.createNewGuildConfig(guildId);                
            }

            return guildConfig
        } else {
            list = [];
            return this.createNewGuildConfig(guildId);
        }
    }

    static createNewGuildConfig(guildId: string) {
        const newGuildConfig: GuildConfig = {
            guildId: guildId,
            channelIdList: ''
        }
        return newGuildConfig;
    }

    static updateConfig(configs: GuildConfig[], updatedGuildConfig: GuildConfig) {
        const index = configs.findIndex(guildConfig => guildConfig.guildId == updatedGuildConfig.guildId);

        if (index !== -1) {
            configs[index] = updatedGuildConfig;
        } else {
            configs.push(updatedGuildConfig);
        }
    }
}