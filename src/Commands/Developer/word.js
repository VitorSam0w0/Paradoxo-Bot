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
    const inputWord = interaction.options.getString('palavra');

    // Traduz a palavra para inglês usando LibreTranslate
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

    const translateData = await translateResponse.json();
    const translatedWord = translateData.translatedText;

    const imageUrl = `https://source.unsplash.com/600x400/?${translatedWord}`;

    const embed = new EmbedBuilder()
      .setTitle(`Word: ${translatedWord}`)
      .setImage(imageUrl)
      .setColor(0x00AE86)
      .setFooter({ text: `Tradução de: ${inputWord}` });

    await interaction.reply({
      embeds: [embed]
    });
  }
};
