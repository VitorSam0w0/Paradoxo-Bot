module.exports = {
  data: {
    name: "never_gonna_give_you_up",
    description: "Pratique inglês com a música Never Gonna Give You Up (Rick Astley)",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const userId = interaction.user.id;

    const lyrics = [
      {
        line: "We're no strangers to love",
        words: ["strangers", "love"],
        translations: { strangers: "estranhos", love: "amor" }
      },
      {
        line: "You know the rules and so do I",
        words: ["rules", "know", "do"],
        translations: { rules: "regras", know: "saber", do: "faço" }
      },
      {
        line: "A full commitment's what I'm thinking of",
        words: ["full", "commitment", "thinking"],
        translations: { full: "completo", commitment: "compromisso", thinking: "pensando" }
      },
      {
        line: "You wouldn't get this from any other guy",
        words: ["wouldn't", "get", "other", "guy"],
        translations: { wouldn't: "não iria", get: "conseguir", other: "outro", guy: "cara" }
      },
      {
        line: "I just wanna tell you how I'm feeling",
        words: ["tell", "feeling"],
        translations: { tell: "contar", feeling: "sentimento" }
      },
      {
        line: "Gotta make you understand",
        words: ["make", "understand"],
        translations: { make: "fazer", understand: "entender" }
      },
      {
        line: "Never gonna give you up",
        words: ["never", "give", "up"],
        translations: { never: "nunca", give: "dar", up: "desistir" }
      },
      {
        line: "Never gonna let you down",
        words: ["never", "let", "down"],
        translations: { never: "nunca", let: "deixar", down: "na mão" }
      },
      {
        line: "Never gonna run around and desert you",
        words: ["never", "run", "desert"],
        translations: { never: "nunca", run: "correr", desert: "abandonar" }
      },
      {
        line: "Never gonna make you cry",
        words: ["never", "make", "cry"],
        translations: { never: "nunca", make: "fazer", cry: "chorar" }
      },
      {
        line: "Never gonna say goodbye",
        words: ["never", "say", "goodbye"],
        translations: { never: "nunca", say: "dizer", goodbye: "adeus" }
      },
      {
        line: "Never gonna tell a lie and hurt you",
        words: ["never", "tell", "lie", "hurt"],
        translations: { never: "nunca", tell: "contar", lie: "mentira", hurt: "machucar" }
      }
    ];

    if (!client.progress) client.progress = {};
    if (!client.currentQuestion) client.currentQuestion = {};

    if (!client.progress[userId]) client.progress[userId] = 0;

    const index = client.progress[userId];
    const verse = lyrics[index];

    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp("\\b" + hiddenWord + "\\b", "i"), "____");

    client.currentQuestion[userId] = {
      music: "never_gonna_give_you_up",
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
