module.exports = {
  data: {
    name: "responder",
    description: "Responda à palavra faltando da música que você está praticando",
    default_member_permissions: "0",
    dm_permissions: "0",
    options: [
      {
        name: "palavra",
        description: "Digite a palavra que completa o verso",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const answer = interaction.options.getString("palavra");

    if (!client.currentQuestion || !client.currentQuestion[userId]) {
      return interaction.reply({
        content: "Você não iniciou nenhuma música ainda. Use o comando da música primeiro.",
        ephemeral: false // todos veem
      });
    }

    const question = client.currentQuestion[userId];

    function normalize(str) {
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, "").trim();
    }

    if (normalize(answer) === normalize(question.hiddenWord)) {
      await interaction.reply({
        content: `✅ Correto! A palavra **${question.hiddenWord}** significa **${question.translation}**`,
        ephemeral: false // todos veem
      });

      client.progress[userId] = question.index + 1;
      client.currentQuestion[userId] = null;

      if (client.progress[userId] >= 11) {
        client.progress[userId] = 0;
        await interaction.followUp("🎶 Você completou a música! Vamos começar de novo.");
      }
    } else {
      await interaction.reply({
        content: "❌ Errado! Tente novamente com /responder.",
        ephemeral: false // agora todos veem o erro
      });
    }
  },
};
