const { SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgpt')
    .setDescription('Faz uma pergunta para o GPT-4 e recebe a resposta')
    .addStringOption(option =>
      option.setName('pergunta')
        .setDescription('O que você quer perguntar?')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const pergunta = interaction.options.getString('pergunta');

    try {
      const response = await fetch('https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY // coloque sua key no .env
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: pergunta }],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (!response.ok || !data.choices || !data.choices.length) {
        return interaction.editReply('❌ Não consegui obter resposta do GPT.');
      }

      const answer = data.choices[0].message.content;

      await interaction.editReply(answer);

    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Ocorreu um erro ao tentar se comunicar com a API.');
    }
  }
};
