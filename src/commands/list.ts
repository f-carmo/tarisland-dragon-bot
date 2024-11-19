import { Client, CommandInteraction, Options, SlashCommandBuilder, TextBasedChannel, TextChannel } from "discord.js";
import { InteractionService } from "../services/interaction-service";
import { ChecklistService } from "../services/checklist-service";
import { ClientService } from "../services/client-service";
import { GuildService } from "../services/guild-service";
import { UserCharacter } from "../models/user-character";
import { ConfigService } from "../services/config-service";

export const data = new SlashCommandBuilder()
  .setName("list")
  .setDescription("Reenvia a lista atual");

export async function execute(interaction: any, client: any) {
  try {
    const guildConfig = ConfigService.getGuildConfig(await ConfigService.fileToJsonObject(), interaction.guildId);

    if (!guildConfig.channelIdList) {
      return interaction.reply({
        content: "Channel não está configurado. Contate um administrador.",
        ephemeral: true
      });   
    }

    const channel = GuildService.getChannelById(ClientService.getGuildById(client, interaction.guildId), guildConfig.channelIdList);
    const inputUsername = await InteractionService.getServerUsername(interaction);
    const checklist: UserCharacter[] = await ChecklistService.fileToJsonObject();
  
    await channel.bulkDelete(100, true);

    ChecklistService.formatMessage(checklist).forEach(async (message) => {
      await channel.send(message);
    });
    
    return interaction.reply({
      content: "Lista enviada",
      ephemeral: true
    });
  } catch (error) {
    return interaction.reply({
      content: "Algo de errado aconteceu.",
      ephemeral: true
    });
  }
}