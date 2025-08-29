module.exports = {
  data: {
    name: "yesterday",
    description: "Pratique inglês com a música Yesterday (The Beatles)",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const yesterdayLyrics = [
      { line: "Yesterday, all my troubles seemed so far away", words: ["yesterday", "troubles", "seemed", "far", "away"], translations: { yesterday: "ontem", troubles: "problemas", seemed: "pareciam", far: "longe", away: "distante" } },
      { line: "Now it looks as though they're here to stay", words: ["now", "looks", "though", "stay"], translations: { now: "agora", looks: "parece", though: "embora / como se", stay: "ficar" } },
      { line: "Oh, I believe in yesterday", words: ["believe", "yesterday"], translations: { believe: "acreditar", yesterday: "ontem" } },
      { line: "Suddenly, I'm not half the man I used to be", words: ["suddenly", "half", "used"], translations: { suddenly: "de repente", half: "metade", used: "costumava" } },
      { line: "There's a shadow hanging over me", words: ["shadow", "hanging", "over"], translations: { shadow: "sombra", hanging: "pairando", over: "sobre" } },
      { line: "Oh, yesterday came suddenly", words: ["yesterday", "came", "suddenly"], translations: { yesterday: "ontem", came: "veio", suddenly: "de repente" } },
      { line: "Why she had to go I don't know, she wouldn't say", words: ["why", "go", "know", "say"], translations: { why: "por que", go: "ir", know: "saber", say: "dizer" } },
      { line: "I said something wrong, now I long for yesterday", words: ["something", "wrong", "long", "yesterday"], translations: { something: "algo", wrong: "errado", long: "ansiar / desejar", yesterday: "ontem" } },
      { line: "Yesterday, love was such an easy game to play", words: ["yesterday", "love", "easy", "game", "play"], translations: { yesterday: "ontem", love: "amor", easy: "fácil", game: "jogo", play: "jogar" } },
      { line: "Now I need a place to hide away", words: ["now", "need", "place", "hide", "away"], translations: { now: "agora", need: "precisar", place: "lugar", hide: "esconder", away: "longe / afastado" } },
      { line: "Oh, I believe in yesterday", words: ["believe", "yesterday"], translations: { believe: "acreditar", yesterday: "ontem" } }
    ];

    // inicializa progresso
    if (!client.progress) client.progress = {};
    if (!client.currentQuestion) client.currentQuestion = {};

    const userId = interaction.user.id;
    if (!client.progress[userId]) client.progress[userId] = 0;

    const index = client.progress[userId];
    const verse = yesterdayLyrics[index];

    // palavra aleatória
    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp(hiddenWord, "i"), "____");

    client.currentQuestion[userId] = {
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index
    };

    // evita "The application did not respond"
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply(`🎶 ${maskedLine}\n👉 Complete the missing word!`);

    // Listener de respostas no chat
    const filter = (msg) => msg.author.id === userId;
    const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

    collector.on("collect", async (msg) => {
      const question = client.currentQuestion[userId];
      if (!question) return;

      const regex = new RegExp(`\\b${question.hiddenWord}\\b`, "i");
      if (regex.test(msg.content)) {
        // mostra tradução primeiro
        await msg.reply(`✅ Correct! The word **${question.hiddenWord}** means **${question.translation}**`);

        // pequena pausa antes de continuar
        setTimeout(async () => {
          // avança para próximo verso
          client.progress[userId] = question.index + 1;

          if (client.progress[userId] >= yesterdayLyrics.length) {
            await msg.channel.send("🔄 You've reached the end of the song. Starting again...");
            client.progress[userId] = 0;
          }

          client.currentQuestion[userId] = null;
          collector.stop(); // para o coletor para o usuário responder o próximo verso
        }, 1500); // 1,5s de pausa para o usuário ver a tradução
      } else {
        msg.reply("❌ Not quite right, try again!");
      }
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        interaction.followUp({ content: "⏰ Time's up! Use /yesterday to try again.", ephemeral: true });
        client.currentQuestion[userId] = null;
      }
    });
  },
};
