const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const play = require("play-dl");

class MusicManager {
  constructor() {
    this.queues = new Map();
  }

  getQueue(guildId) {
    return this.queues.get(guildId);
  }

  createQueue(guildId, voiceChannel, textChannel) {
    const queue = {
      guildId,
      voiceChannel,
      textChannel,
      connection: null,
      player: createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      }),
      songs: [],
      volume: 100,
      playing: false,
      loop: false,
    };

    this.queues.set(guildId, queue);
    return queue;
  }

  async connect(queue) {
    const connection = joinVoiceChannel({
      channelId: queue.voiceChannel.id,
      guildId: queue.guildId,
      adapterCreator: queue.voiceChannel.guild.voiceAdapterCreator,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      queue.connection = connection;
      connection.subscribe(queue.player);

      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch {
          this.deleteQueue(queue.guildId);
        }
      });

      return true;
    } catch (error) {
      console.error("Erro ao conectar:", error);
      return false;
    }
  }

  async playSong(queue) {
    if (queue.songs.length === 0) {
      queue.textChannel.send({
        embeds: [
          {
            title: "🎵 Fila vazia",
            description: "A fila de músicas acabou! Use `/play` para adicionar mais.",
            color: 0x5865f2,
          },
        ],
      });

      setTimeout(() => {
        const currentQueue = this.getQueue(queue.guildId);
        if (currentQueue && currentQueue.songs.length === 0) {
          this.deleteQueue(queue.guildId);
        }
      }, 120000);

      return;
    }

    const song = queue.songs[0];
    queue.playing = true;

    try {
      const stream = await play.stream(song.url);
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      queue.player.play(resource);

      queue.player.once(AudioPlayerStatus.Idle, () => {
        if (queue.loop) {
          queue.songs.push(queue.songs.shift());
        } else {
          queue.songs.shift();
        }
        this.playSong(queue);
      });

      queue.player.on("error", (error) => {
        console.error("Erro no player:", error);
        queue.songs.shift();
        this.playSong(queue);
      });

      queue.textChannel.send({
        embeds: [
          {
            title: "🎶 Tocando agora",
            description: `**[${song.title}](${song.url})**`,
            thumbnail: { url: song.thumbnail },
            fields: [
              { name: "Duração", value: song.duration, inline: true },
              { name: "Pedido por", value: `<@${song.requestedBy}>`, inline: true },
            ],
            color: 0x00ffaa,
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao tocar música:", error);
      queue.songs.shift();
      this.playSong(queue);
    }
  }

  deleteQueue(guildId) {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.player.stop();
      if (queue.connection) {
        queue.connection.destroy();
      }
      this.queues.delete(guildId);
    }
  }

  async search(query) {
    try {
      if (play.yt_validate(query) === "video") {
        const info = await play.video_info(query);
        return [
          {
            title: info.video_details.title,
            url: info.video_details.url,
            duration: info.video_details.durationRaw,
            thumbnail: info.video_details.thumbnails[0]?.url || "",
          },
        ];
      }

      const results = await play.search(query, { limit: 5 });
      return results.map((video) => ({
        title: video.title,
        url: video.url,
        duration: video.durationRaw,
        thumbnail: video.thumbnails[0]?.url || "",
      }));
    } catch (error) {
      console.error("Erro na busca:", error);
      return [];
    }
  }
}

module.exports = new MusicManager();