// /responder.js
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
      return interaction.reply({ content: "Você não iniciou nenhuma música ainda. Use o comando da música primeiro.", ephemeral: true });
    }

    const question = client.currentQuestion[userId];

    // Normaliza
    function normalize(str) {
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, "").trim();
    }

    if (normalize(answer) === normalize(question.hiddenWord)) {
      await interaction.reply(`✅ Correto! A palavra **${question.hiddenWord}** significa **${question.translation}**`);

      // Avança para próximo verso
      client.progress[userId] = question.index + 1;
      client.currentQuestion[userId] = null;

      // Se terminou a música, reinicia
      if (client.progress[userId] >= 11) { // 11 versos no exemplo, ajuste se adicionar mais
        client.progress[userId] = 0;
        await interaction.followUp("🎶 Você completou a música! Vamos começar de novo.");
      }

    } else {
      await interaction.reply("❌ Errado! Tente novamente com /responder.");
    }
  },
};
