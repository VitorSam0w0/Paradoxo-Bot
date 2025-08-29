module.exports = {
  data: {
    name: "let_it_be",
    description: "Pratique inglês com a música Let It Be (The Beatles)",
    default_member_permissions: "0",
    dm_permissions: "0",
  },
  async execute(interaction, client) {
    const userId = interaction.user.id;

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

    await interaction.reply({
      content: `🎶 ${maskedLine}\nUse /responder para enviar sua resposta.`,
      ephemeral: false // todos veem
    });
  },
};
