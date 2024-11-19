import { PermissionsBitField } from "discord.js";

export class InteractionService {

    static getServerUsername(interaction: any) {
        return interaction.member.nickname;
    }

    static getInteractionInputByName(interaction: any, name: string) {
        return interaction.options.get(name);
    }

    static getInteractionInputValueByName(interaction: any, name: string) {
        return interaction.options.get(name).value;
    }

    static getGuildIdOrigin(interaction: any) {
        return interaction.guildId
    }

    static isAdmin(interaction: any) {
        return interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)
    }
}