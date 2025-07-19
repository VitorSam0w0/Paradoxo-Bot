const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('word')
    .setDescription('Envia a palavra em inglês com imagem')
    .addStringOption(option =>
      option.setName('palavra')
        .setDescription('A palavra em inglês')
        .setRequired(true)
    ),

  async execute(interaction) {
    const word = interaction.options.getString('palavra');
    const imageUrl = `https://source.unsplash.com/600x400/?${word}`;

    const embed = new EmbedBuilder()
      .setTitle(`Word: ${word}`)
      .setImage(imageUrl)
      .setColor(0x00AE86);

    await interaction.reply({
      embeds: [embed]
    });
  }
};
