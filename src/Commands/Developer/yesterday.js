module.exports = {
  data: {
    name: "yesterday",
    description: "Pratique inglês com a música Yesterday (The Beatles)",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    // ======================
    // CONFIGURAÇÃO DO CANAL
    // ======================
    const practiceChannelId = "1411043041677938822"; // Coloque o ID do canal onde o bot vai coletar mensagens
    const channel = client.channels.cache.get(practiceChannelId);
    if (!channel) return interaction.reply({ content: "Canal de prática não encontrado!", ephemeral: true });

    // ======================
    // LETRA DA MÚSICA
    // ======================
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

    // ======================
    // FUNÇÃO DE NORMALIZAÇÃO
    // ======================
    function normalize(str) {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/gi, "")
        .trim();
    }

    // ======================
    // INICIALIZA PROGRESSO
    // ======================
    if (!client.progress) client.progress = {};
    if (!client.currentQuestion) client.currentQuestion = {};

    const userId = interaction.user.id;
    if (!client.progress[userId]) client.progress[userId] = 0;

    const index = client.progress[userId];
    const verse = yesterdayLyrics[index];

    // Palavra aleatória
    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp(hiddenWord, "i"), "____");

    client.currentQuestion[userId] = {
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index
    };

    // ======================
    // ENVIA A MENSAGEM DO COMANDO
    // ======================
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply(`🎶 ${maskedLine}\n👉 Digite apenas a palavra que falta! (responda no canal específico). Exemplo: se for "yesterday", digite só isso.`);

    // ======================
    // COLETOR DE MENSAGENS
    // ======================
    const collector = channel.createMessageCollector({ filter: msg => msg.author.id === userId, time: 60000 });

    collector.on("collect", async (msg) => {
      const question = client.currentQuestion[userId];
      if (!question) return;

      const userAnswerNormalized = normalize(msg.content);
      const hiddenWordNormalized = normalize(question.hiddenWord);

      // Split em palavras e verifica se a palavra escondida está presente (mais flexível)
      const userWords = userAnswerNormalized.split(/\s+/).filter(word => word.length > 0);
      if (userWords.includes(hiddenWordNormalized)) {
        // Mostra tradução
        await msg.reply(`✅ Correto! A palavra **${question.hiddenWord}** significa **${question.translation}**`);

        setTimeout(async () => {
          // Avança para próximo verso
          client.progress[userId] = question.index + 1;

          if (client.progress[userId] >= yesterdayLyrics.length) {
            await msg.channel.send("🔄 Você chegou ao final da música. Reiniciando...");
            client.progress[userId] = 0;
          }

          client.currentQuestion[userId] = null;
          collector.stop();
        }, 1500); // pausa para ver a tradução
      } else {
        // Mensagem de erro a cada tentativa errada
        await msg.reply("❌ Não está certo, tente novamente!");
      }
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        interaction.followUp({ content: "⏰ Tempo esgotado! Use /yesterday para tentar novamente.", ephemeral: true });
        client.currentQuestion[userId] = null;
      }
    });
  },
};