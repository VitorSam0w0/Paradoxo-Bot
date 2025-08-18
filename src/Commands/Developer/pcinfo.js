const os = require("os");

module.exports = {
  name: "pcinfo",
  description: "Mostra as informações do servidor/máquina",
  run: async (client, message, args) => {
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

    message.reply("📊 **Configurações da máquina:**\n" + result);
  },
};
