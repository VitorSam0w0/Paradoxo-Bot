const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gemini')
    .setDescription('Faça uma pergunta para a IA Gemini')
    .addStringOption(option =>
      option
        .setName('pergunta')
        .setDescription('O que você quer perguntar?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const pergunta = interaction.options.getString('pergunta');
    const apiKey = process.env.GEMINI_API_KEY;

    // Verifica se a chave foi configurada
    if (!apiKey) {
      return interaction.reply({
        content: '❌ A chave `GEMINI_API_KEY` não foi configurada nas Secrets do Replit.',
        ephemeral: true,
      });
    }

    // Avisa o Discord que a resposta pode demorar um pouco (a API pode levar alguns segundos)
    await interaction.deferReply();

    try {
      const model = 'gemini-2.5-flash'; // pode trocar por outro modelo, ex: gemini-3-pro
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: pergunta }],
            },
          ],
        }),
      });

      const data = await response.json();

      // Trata erros retornados pela própria API do Gemini
      if (!response.ok) {
        console.error('Erro da API Gemini:', data);
        const mensagemErro = data?.error?.message || 'Erro desconhecido ao consultar o Gemini.';
        return interaction.editReply(`❌ Erro ao consultar o Gemini: ${mensagemErro}`);
      }

      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!texto) {
        return interaction.editReply('⚠️ O Gemini não retornou nenhuma resposta. Tente reformular a pergunta.');
      }

      // O Discord tem limite de 4096 caracteres em embeds (2000 em mensagens normais)
      // Aqui usamos embed e cortamos caso passe do limite
      const textoFinal = texto.length > 4000 ? texto.slice(0, 4000) + '...' : texto;

      const embed = new EmbedBuilder()
        .setColor('#4285F4') // azul do Google
        .setTitle('✨ Gemini AI')
        .addFields(
          { name: '❓ Pergunta', value: pergunta.length > 1024 ? pergunta.slice(0, 1021) + '...' : pergunta },
          { name: '💬 Resposta', value: textoFinal }
        )
        .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Erro inesperado no comando gemini:', error);
      await interaction.editReply('❌ Ocorreu um erro inesperado ao tentar falar com o Gemini.');
    }
  },
};