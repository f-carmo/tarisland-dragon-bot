import { SlashCommandBuilder } from "discord.js";
import { InteractionService } from "../services/interaction-service";
import { ChecklistService } from "../services/checklist-service";
import { UserCharacter } from "../models/user-character";
import { ConfigService } from "../services/config-service";

export const data = new SlashCommandBuilder()
  .setName("resetlist")
  .setDescription("Reseta completamente a lista atual.");

export async function execute(interaction: any, client: any) {
  try {
    const guildConfig = ConfigService.getGuildConfig(await ConfigService.fileToJsonObject(), interaction.guildId);
    if (InteractionService.isAdmin(interaction)) {
      const checklist: UserCharacter[] = await ChecklistService.fileToJsonObject();

      ChecklistService.save([]);

      return interaction.reply({
        content: "Lista resetada com sucesso!",
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