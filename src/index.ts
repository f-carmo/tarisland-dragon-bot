import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands"
import { commands } from "./commands/index"
import { config } from "./config"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});


client.once("ready", async () => {
  const guilds = client.guilds.cache;
  for (const [guildId] of guilds) {
    await deployCommands({ guildId }); // Seu método de deploy de comandos
  }

  console.log("Discord bot is ready! 🤖");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction, client);
  }
});

client.login(config.DISCORD_TOKEN);
