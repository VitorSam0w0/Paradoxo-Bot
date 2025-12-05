const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

const lyrics = [
  { line: "We're no strangers to love", words: ["strangers", "love"] },
  { line: "You know the rules and so do I", words: ["rules", "know", "do"] },
  { line: "A full commitment's what I'm thinking of", words: ["full", "commitment", "thinking"] },
  { line: "You wouldn't get this from any other guy", words: ["wouldn't", "get", "other", "guy"] },
  { line: "I just wanna tell you how I'm feeling", words: ["wanna", "tell", "feeling"] },
  { line: "Gotta make you understand", words: ["Gotta", "make", "understand"] },
  { line: "Never gonna give you up", words: ["Never", "gonna", "give", "up"] },
  { line: "Never gonna let you down", words: ["Never", "gonna", "let", "down"] },
  { line: "Never gonna run around and desert you", words: ["gonna", "run", "around", "desert"] },
  { line: "Never gonna make you cry", words: ["gonna", "make", "cry"] }
];

const translations = {
  strangers: "estranhos",
  love: "amor",
  rules: "regras",
  know: "saber",
  do: "faço",
  full: "completo",
  commitment: "compromisso",
  thinking: "pensando",
  "wouldn't": "não iria",
  get: "conseguir",
  other: "outro",
  guy: "cara",
  wanna: "querer",
  tell: "contar",
  feeling: "sentimento",
  Gotta: "tenho que",
  make: "fazer",
  understand: "entender",
  Never: "Nunca",
  gonna: "vai",
  give: "dar",
  up: "acima",
  let: "deixar",
  down: "abaixo",
  run: "correr",
  around: "ao redor",
  desert: "abandonar",
  cry: "chorar"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("never_gonna_give_you_up")
    .setDescription("Pratique inglês com a música Never Gonna Give You Up (Rick Astley)"),
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

    if (!client.progress) client.progress = {};
    if (!client.currentQuestion) client.currentQuestion = {};
    if (!client.progress[userId]) client.progress[userId] = 0;

    const index = client.progress[userId];
    if (index >= lyrics.length) {
      await interaction.reply("🎉 Você completou a música! Use o comando novamente para praticar de novo.");
      client.progress[userId] = 0;
      return;
    }

    const verse = lyrics[index];
    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp(hiddenWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i"), "____");

    client.currentQuestion[userId] = {
      music: "never_gonna_give_you_up",
      hiddenWord,
      translation: translations[hiddenWord],
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
      const audioPath = path.join(__dirname, '..', '..', 'audio', 'never_gonna_give_you_up.mp3');
      const resource = createAudioResource(audioPath);

      // Conecta o player à conexão de voz
      connection.subscribe(player);

      // Toca o áudio
      player.play(resource);

      await interaction.reply({
        content: `🎶 Tocando **Never Gonna Give You Up** - Rick Astley\n\n📝 Adivinhe a palavra: **${maskedLine}**\n\nUse \`/responder <palavra>\` para enviar sua resposta.`,
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
  }
};