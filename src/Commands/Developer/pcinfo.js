const { SlashCommandBuilder } = require("discord.js");
const si = require("systeminformation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pcinfo")
    .setDescription("Mostra informações do servidor/máquina"),

  async execute(interaction) {
    // CPU
    const cpu = await si.cpu();
    // Memória
    const mem = await si.mem();
    // GPU
    const gpu = await si.graphics();
    // Placa-mãe
    const baseboard = await si.baseboard();
    // Rede
    const net = await si.networkInterfaces();

    // Monta a resposta
    const info = `
**💻 CPU:** ${cpu.manufacturer} ${cpu.brand} (${cpu.cores} núcleos)
**🖥 RAM Total:** ${(mem.total / 1024 ** 3).toFixed(2)} GB
**🖥 RAM Livre:** ${(mem.free / 1024 ** 3).toFixed(2)} GB
**🎮 GPU:** ${gpu.controllers.map(g => g.model).join(", ")}
**🛠 Placa-mãe:** ${baseboard.manufacturer} ${baseboard.model}
**🌐 Rede:** ${net.map(n => `${n.iface} (${n.speed} Mbps)`).join(", ")}
`;

    await interaction.reply("📊 **Informações da máquina:**\n" + info);
  },
};
