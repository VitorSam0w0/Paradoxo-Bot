const { SlashCommandBuilder } = require("discord.js");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pcinfo")
    .setDescription("Mostra informações do servidor/máquina"),

  async execute(interaction) {
    const info = {
      Sistema: os.type(),
      Versão: os.release(),
      Arquitetura: os.arch(),
      Processador: os.cpus()[0].model,
      "Núcleos (lógicos)": os.cpus().length,
      "Memória total (GB)": (os.totalmem() / 1024 ** 3).toFixed(2),
      "Memória livre (GB)": (os.freemem() / 1024 ** 3).toFixed(2),
      "Tempo ligado (h)": (os.uptime() / 3600).toFixed(1),
    };

    let result = Object.entries(info)
      .map(([k, v]) => `**${k}:** ${v}`)
      .join("\n");

    await interaction.reply({
      content: "📊 **Configurações da máquina:**\n" + result,
      ephemeral: false, // se quiser que só tu veja, troca pra true
    });
  },
};
