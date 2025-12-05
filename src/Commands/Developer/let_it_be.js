const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

module.exports = {
  data: {
    name: "let_it_be",
    description: "Pratique inglês com a música Let It Be (The Beatles)",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const member = interaction.member;

    // Verifica se o usuário está em um canal de voz
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ Você precisa estar em um canal de voz para usar este comando!",
        ephemeral: true
      });
    }

    const letItBeLyrics = [
      {
        line: "When I find myself in times of trouble",
        words: ["find", "myself", "times", "trouble"],
        translations: { find: "encontrar", myself: "eu mesmo", times: "tempos", trouble: "problema" }
      },
      {
        line: "Mother Mary comes to me",
        words: ["mother", "mary", "comes"],
        translations: { mother: "mãe", mary: "Maria", comes: "vem" }
      },
      {
        line: "Speaking words of wisdom, let it be",
        words: ["speaking", "words", "wisdom", "let", "be"],
        translations: { speaking: "falando", words: "palavras", wisdom: "sabedoria", let: "deixe", be: "ser" }
      },
      {
        line: "And in my hour of darkness",
        words: ["hour", "darkness"],
        translations: { hour: "hora", darkness: "escuridão" }
      },
      {
        line: "She is standing right in front of me",
        words: ["standing", "right", "front"],
        translations: { standing: "em pé", right: "direito / bem", front: "frente" }
      },
      {
        line: "Speaking words of wisdom, let it be",
        words: ["speaking", "words", "wisdom", "let", "be"],
        translations: { speaking: "falando", words: "palavras", wisdom: "sabedoria", let: "deixe", be: "ser" }
      },
      {
        line: "And when the broken-hearted people",
        words: ["broken-hearted", "people"],
        translations: { "broken-hearted": "partido coração / triste", people: "pessoas" }
      },
      {
        line: "Living in the world agree",
        words: ["living", "world", "agree"],
        translations: { living: "vivendo", world: "mundo", agree: "concordar" }
      },
      {
        line: "There will be an answer, let it be",
        words: ["answer", "let", "be"],
        translations: { answer: "resposta", let: "deixe", be: "ser" }
      },
      {
        line: "For though they may be parted there is",
        words: ["though", "parted"],
        translations: { though: "embora", parted: "separado" }
      },
      {
        line: "Still a chance that they will see",
        words: ["chance", "see"],
        translations: { chance: "chance / oportunidade", see: "ver" }
      },
      {
        line: "There will be an answer, let it be",
        words: ["answer", "let", "be"],
        translations: { answer: "resposta", let: "deixe", be: "ser" }
      },
      {
        line: "Let it be, let it be",
        words: ["let", "be"],
        translations: { let: "deixe", be: "ser" }
      },
      {
        line: "Whisper words of wisdom, let it be",
        words: ["whisper", "words", "wisdom", "let", "be"],
        translations: { whisper: "sussurrar", words: "palavras", wisdom: "sabedoria", let: "deixe", be: "ser" }
      }
    ];

    if (!client.progress) client.progress = {};
    if (!client.currentQuestion) client.currentQuestion = {};
    if (!client.progress[userId]) client.progress[userId] = 0;

    const index = client.progress[userId];
    const verse = letItBeLyrics[index];

    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp("\\b" + hiddenWord + "\\b", "i"), "____");

    client.currentQuestion[userId] = {
      music: "let_it_be",
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index
    };

    try {
      // Entra no canal de voz
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      // Cria o player de áudio
      const player = createAudioPlayer();

      // Caminho do arquivo de áudio
      const audioPath = path.join(__dirname, '..', '..', 'audio', 'let_it_be.mp3');
      const resource = createAudioResource(audioPath);

      // Conecta o player à conexão de voz
      connection.subscribe(player);

      // Toca o áudio
      player.play(resource);

      await interaction.reply({
        content: `🎶 Tocando **Let It Be** - The Beatles\n\n📝 Complete a frase: **${maskedLine}**\n\nUse \`/responder\` para enviar sua resposta.`,
        ephemeral: false
      });

      // Evento quando a música terminar
      player.on(AudioPlayerStatus.Idle, () => {
        // connection.destroy(); // Descomente para sair após tocar
      });

      // Evento de erro
      player.on('error', error => {
        console.error('Erro no player:', error);
      });

    } catch (error) {
      console.error('Erro ao entrar no canal de voz:', error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao tentar entrar no canal de voz.",
        ephemeral: true
      });
    }
  },
};