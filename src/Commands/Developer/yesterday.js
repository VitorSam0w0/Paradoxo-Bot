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
    if (!channel) {
      return interaction.reply({
        content: "Canal de prática não encontrado! Por favor, configure o ID corretamente.",
        ephemeral: true
      });
    }

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
    const maskedLine = verse.line.replace(new RegExp("\\b" + hiddenWord + "\\b", "i"), "____");

    client.currentQuestion[userId] = {
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index
    };

    // ======================
    // ENVIA A MENSAGEM DO COMANDO
    // ======================
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply(`🎶 ${maskedLine}\n👉 Complete the missing word! (responda no canal de prática)`);

    // ======================
    // COLETOR DE MENSAGENS
    // ======================
    const collector = channel.createMessageCollector({ filter: msg => msg.author.id === userId, time: 60000 });

    collector.on("collect", async (msg) => {
      const question = client.currentQuestion[userId];
      if (!question) {
        // Se a pergunta não existir mais, para o coletor
        return collector.stop('no_question');
      }

      const userAnswer = normalize(msg.content);
      const hiddenWordNormalized = normalize(question.hiddenWord);

      if (userAnswer === hiddenWordNormalized) {
        // Resposta correta
        await msg.reply(`✅ Correct! The word **${question.hiddenWord}** means **${question.translation}**`);
        // Para o coletor com a razão "correct"
        collector.stop('correct');
      } else {
        // Resposta incorreta
        await msg.reply("❌ Not quite right, try again!");
      }
    });

    collector.on("end", async (collected, reason) => {
      const userId = interaction.user.id;
      
      if (reason === "correct") {
        const question = client.currentQuestion[userId];
        if (question) {
          // Avança para o próximo verso
          client.progress[userId] = question.index + 1;

          if (client.progress[userId] >= yesterdayLyrics.length) {
            await channel.send(`🎶 ${interaction.user} **You've completed the song!** Let's start again from the beginning.`);
            client.progress[userId] = 0;
          }

          // Limpa a pergunta atual para evitar respostas duplicadas
          client.currentQuestion[userId] = null;
        }
      } else if (reason === "time") {
        // Tempo esgotado
        interaction.followUp({ content: "⏰ Time's up! Use `/yesterday` to try again.", ephemeral: true });
        client.currentQuestion[userId] = null;
      }
    });
  },
};