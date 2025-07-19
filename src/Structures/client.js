module.exports.start = async (config) => {
  client.config = config;

  console.log("loading commands...");
  await require("./commands.js").execute(client);
  console.log("loading handler...");
  await require("./handler.js").execute(client);
  console.log("loading events...");
  await require("./events.js").execute(client);

  // Adicione aqui:
  client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channelId = process.env.CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error('Canal não encontrado. Verifique o ID no .env');
      return;
    }

    async function sendWordImage() {
      try {
        const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));
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
        console.error('Erro ao enviar a palavra e imagem:', error);
      }
    }

    await sendWordImage();

    setInterval(sendWordImage, 1800000);
  });

  await client.login(config.TOKEN);
};
