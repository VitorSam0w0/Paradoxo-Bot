const musicManager = require("../utils/musicManager");

module.exports = {
  data: {
    name: "play",
    description: "Toca uma música do YouTube na call",
    default_member_permissions: null,
    dm_permissions: "0",
    options: [
      {
        name: "musica",
        description: "Nome da música ou URL do YouTube",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction, client) {
    const query = interaction.options.getString("musica");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          {
            title: "❌ Erro",
            description: "Você precisa estar em um canal de voz para usar este comando!",
            color: 0xd8303b,
          },
        ],
        ephemeral: true,
      });
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has("Connect") || !permissions.has("Speak")) {
      return interaction.reply({
        embeds: [
          {
            title: "❌ Sem permissão",
            description: "Eu não tenho permissão para conectar ou falar neste canal de voz!",
            color: 0xd8303b,
          },
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const results = await musicManager.search(query);
    if (results.length === 0) {
      return interaction.editReply({
        embeds: [
          {
            title: "❌ Não encontrado",
            description: `Nenhum resultado encontrado para: **${query}**`,
            color: 0xd8303b,
          },
        ],
      });
    }

    const song = {
      ...results[0],
      requestedBy: interaction.user.id,
    };

    let queue = musicManager.getQueue(interaction.guild.id);

    if (!queue) {
      queue = musicManager.createQueue(
        interaction.guild.id,
        voiceChannel,
        interaction.channel
      );

      const connected = await musicManager.connect(queue);
      if (!connected) {
        musicManager.deleteQueue(interaction.guild.id);
        return interaction.editReply({
          embeds: [
            {
              title: "❌ Erro de conexão",
              description: "Não foi possível conectar ao canal de voz!",
              color: 0xd8303b,
            },
          ],
        });
      }

      queue.songs.push(song);
      await interaction.editReply({
        embeds: [
          {
            title: "✅ Conectado",
            description: `Iniciando reprodução de **[${song.title}](${song.url})**`,
            thumbnail: { url: song.thumbnail },
            color: 0x00ffaa,
          },
        ],
      });
      musicManager.playSong(queue);
    } else {
      queue.songs.push(song);
      await interaction.editReply({
        embeds: [
          {
            title: "✅ Adicionado à fila",
            description: `**[${song.title}](${song.url})**`,
            thumbnail: { url: song.thumbnail },
            fields: [
              { name: "Duração", value: song.duration, inline: true },
              { name: "Posição na fila", value: `${queue.songs.length}`, inline: true },
            ],
            color: 0x5865f2,
          },
        ],
      });
    }
  },
};