const musicManager = require("../utils/musicManager");

module.exports = {
  data: {
    name: "stop",
    description: "Para a música e desconecta o bot da call",
    default_member_permissions: null,
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    const queue = musicManager.getQueue(interaction.guild.id);

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          {
            title: "❌ Erro",
            description: "Você precisa estar em um canal de voz!",
            color: 0xd8303b,
          },
        ],
        ephemeral: true,
      });
    }

    if (!queue) {
      return interaction.reply({
        embeds: [
          {
            title: "❌ Erro",
            description: "Não há nenhuma música tocando!",
            color: 0xd8303b,
          },
        ],
        ephemeral: true,
      });
    }

    musicManager.deleteQueue(interaction.guild.id);

    interaction.reply({
      embeds: [
        {
          title: "⏹️ Música parada",
          description: "Desconectei do canal de voz e limpei a fila.",
          color: 0x00ffaa,
        },
      ],
    });
  },
};