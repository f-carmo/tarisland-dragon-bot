export class ClientService {
    static getGuildById(client: any, guildId: any) {
        return client.guilds.cache.find((guild: any) => guild.id == guildId)
    }
}