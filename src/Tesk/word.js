const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
require('dotenv').config();

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const channelId = process.env.CHANNEL_ID;

  setInterval(async () => {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) {
        console.error('Canal não encontrado. Verifique o ID no .env');
        return;
      }

      const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
      const wordData = await wordResponse.json();
      const randomWord = wordData[0];

      const imageUrl = `https://source.unsplash.com/600x400/?${randomWord}`;

      await channel.send({
        content: `**Word:** ${randomWord}`,
        files: [imageUrl]
      });

      console.log(`Palavra ${randomWord} enviada para o canal ${channel.name}`);

    } catch (error) {
      console.error('Erro ao buscar o canal ou enviar mensagem:', error);
    }
  }, 30000); // 1 hora = 3600000 milissegundos
});
