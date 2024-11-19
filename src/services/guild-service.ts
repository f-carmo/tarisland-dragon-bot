export class GuildService {
    static getChannelByName(guild: any, name: string) {
        return guild.channels.cache.filter((channel: any) => channel.name == name).first();
    }

    static getChannelById(guild: any, id: string) {
        return guild.channels.cache.filter((channel: any) => channel.id == id).first();
    }
}