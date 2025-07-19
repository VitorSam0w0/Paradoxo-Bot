const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('word')
    .setDescription('Traduz uma palavra para o inglês e envia uma imagem relacionada')
    .addStringOption(option =>
      option.setName('palavra')
        .setDescription('A palavra em português')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // garante tempo extra

    try {
      const inputWord = interaction.options.getString('palavra');

      const translateResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: inputWord,
          source: 'pt',
          target: 'en',
          format: 'text'
        })
      });

      if (!translateResponse.ok) throw new Error('Falha na tradução');

      const translateData = await translateResponse.json();
      const translatedWord = translateData.translatedText;

      const imageUrl = `https://source.unsplash.com/600x400/?${translatedWord}`;

      const embed = new EmbedBuilder()
        .setTitle(`Word: ${translatedWord}`)
        .setImage(imageUrl)
        .setColor(0x00AE86)
        .setFooter({ text: `Tradução de: ${inputWord}` });

      await interaction.editReply({
        embeds: [embed]
      });

    } catch (err) {
      console.error('Erro no comando /word:', err);
      await interaction.editReply({ content: '❌ Ocorreu um erro ao traduzir ou buscar a imagem. Tente novamente!' });
    }
  }
};
