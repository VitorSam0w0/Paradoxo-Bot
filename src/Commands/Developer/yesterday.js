module.exports = {
  data: {
    name: "yesterday",
    description: "Pratique inglês com a música Yesterday (The Beatles)",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const userId = interaction.user.id;

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

    if (!client.progress) client.progress = {};
    if (!client.currentQuestion) client.currentQuestion = {};

    if (!client.progress[userId]) client.progress[userId] = 0;

    const index = client.progress[userId];
    const verse = yesterdayLyrics[index];

    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp("\\b" + hiddenWord + "\\b", "i"), "____");

    client.currentQuestion[userId] = {
      music: "yesterday",
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index
    };

    await interaction.reply({
      content: `🎶 ${maskedLine}\nUse /responder para enviar sua resposta.`,
      ephemeral: false
    });
  },
};
