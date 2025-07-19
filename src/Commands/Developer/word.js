async execute(interaction) {
  try {
    // Se for tarefa lenta, descomente a linha abaixo
    // await interaction.deferReply();

    const word = interaction.options.getString('palavra');
    const imageUrl = `https://source.unsplash.com/600x400/?${word}`;

    await interaction.reply({
      content: `**Word:** ${word}`,
      files: [imageUrl]
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Ocorreu um erro.', ephemeral: true });
  }
}
