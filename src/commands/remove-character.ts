import { SlashCommandBuilder } from "discord.js";
import { InteractionService } from "../services/interaction-service";
import { ChecklistService } from "../services/checklist-service";
import { ClientService } from "../services/client-service";
import { GuildService } from "../services/guild-service";
import { UserCharacter } from "../models/user-character";
import { ConfigService } from "../services/config-service";

export const data = new SlashCommandBuilder()
  .setName("removechar")
  .setDescription("Remove um personagem da lista.")
  .addStringOption(option => 
    option
      .setName("nickname")
      .setDescription("O nome do personagem que completou o rush")
      .setRequired(true)
  );

export async function execute(interaction: any, client: any) {
  try {
    const guildConfig = ConfigService.getGuildConfig(await ConfigService.fileToJsonObject(), interaction.guildId);

    if (!guildConfig.channelIdList) {
      return interaction.reply({
        content: "Channel não está configurado. Contate um administrador.",
        ephemeral: true
      });   
    }

    if (InteractionService.isAdmin(interaction)) {
      const channel = GuildService.getChannelById(ClientService.getGuildById(client, interaction.guildId), guildConfig.channelIdList);
      const characterNickname = await InteractionService.getInteractionInputValueByName(interaction, "nickname");
      const inputUsername = await InteractionService.getServerUsername(interaction);
      const checklist: UserCharacter[] = await ChecklistService.fileToJsonObject();
      const userInfo = await ChecklistService.getUserInfo(checklist, inputUsername);

      ChecklistService.removeCharacterFromList(userInfo, characterNickname);
      ChecklistService.updateChecklist(checklist, userInfo);
      ChecklistService.save(checklist);
          
      await channel.bulkDelete(100, true);
      ChecklistService.formatMessage(checklist).forEach(async (message) => {
        await channel.send(message);
      });

      return interaction.reply({
        content: "Check removido com sucesso!",
        ephemeral: true
      });
    } else {
      return interaction.reply({
        content: "Você não tem permissão para usar esse comando.",
        ephemeral: true
      });
    }

  } catch (error) {
    return interaction.reply({
      content: "Algo de errado aconteceu.",
      ephemeral: true
    });
  }
}