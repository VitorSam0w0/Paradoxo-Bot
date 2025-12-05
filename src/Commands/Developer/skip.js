const musicManager = require("../utils/musicManager");

module.exports = {
  data: {
    name: "skip",
    description: "Pula para a próxima música da fila",
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

    if (!queue || queue.songs.length === 0) {
      return interaction.reply({
        embeds: [
          {
            title: "❌ Erro",
            description: "Não há nenhuma música para pular!",
            color: 0xd8303b,
          },
        ],
        ephemeral: true,
      });
    }

    const skippedSong = queue.songs[0];
    queue.player.stop();

    interaction.reply({
      embeds: [
        {
          title: "⏭️ Música pulada",
          description: `Pulou: **${skippedSong.title}**`,
          color: 0x5865f2,
        },
      ],
    });
  },
};