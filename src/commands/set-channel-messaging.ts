import { Client, CommandInteraction, Guild, Options, PermissionsBitField, SlashCommandBuilder, TextBasedChannel, TextChannel } from "discord.js";
import { InteractionService } from "../services/interaction-service";
import { ChecklistService } from "../services/checklist-service";
import { ClientService } from "../services/client-service";
import { GuildService } from "../services/guild-service";
import { UserCharacter } from "../models/user-character";
import { ConfigService } from "../services/config-service";

export const data = new SlashCommandBuilder()
  .setName("setchannel")
  .setDescription("Define o channel que o bot usara para enviar a lista")
  .addStringOption(option => 
    option
      .setName("channel")
      .setDescription("O nome do channel que o bot vai utilizar para gerenciar a lista")
      .setRequired(true)
  );
  export async function execute(interaction: CommandInteraction, client: any) {
    if (InteractionService.isAdmin(interaction)) {

        const guildConfigList = await ConfigService.fileToJsonObject()
        const guildConfigs = ConfigService.getGuildConfig(guildConfigList, interaction.guildId);
        const guild = ClientService.getGuildById(client, interaction.guildId);
        const channel = GuildService.getChannelByName(guild, InteractionService.getInteractionInputValueByName(interaction, 'channel'));

        guildConfigs.channelIdList = channel.id;

        ConfigService.updateConfig(guildConfigList, guildConfigs);
        ConfigService.save(guildConfigList);

        return interaction.reply('Channel definido com sucesso!');
    } else {
        return interaction.reply('Você não tem permissão para usar esse comando');
    }
  }