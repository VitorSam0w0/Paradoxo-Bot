require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// ==========================
// 🎵 Letra da música "Yesterday"
// ==========================
const yesterdayLyrics = [
  { line: "Yesterday, all my troubles seemed so far away", words: ["yesterday", "troubles", "seemed", "far", "away"], translations: { yesterday: "ontem", troubles: "problemas", seemed: "pareciam", far: "longe", away: "distante" } },
  { line: "Now it looks as though they're here to stay", words: ["now", "looks", "though", "stay"], translations: { now: "agora", looks: "parece", though: "embora / como se", stay: "ficar" } },
  { line: "Oh, I believe in yesterday", words: ["believe", "yesterday"], translations: { believe: "acreditar", yesterday: "ontem" } },
  { line: "Suddenly, I'm not half the man I used to be", words: ["suddenly", "half", "used"], translations: { suddenly: "de repente", half: "metade", used: "costumava" } },
  { line: "There's a shadow hanging over me", words: ["shadow", "hanging", "over"], translations: { shadow: "sombra", hanging: "pairando", over: "sobre" } },
  { line: "Oh, yesterday came suddenly", words: ["yesterday", "came", "suddenly"], translations: { yesterday: "ontem", came: "veio", suddenly: "de repente" } },
  { line: "Why she had to go I don't know, she wouldn't say", words: ["why", "go", "know", "say"], translations: { why: "por que", go: "ir", know: "saber", say: "dizer" } },
  { line: "I said something wrong, now I long for yesterday", words: ["something", "wrong", "long", "yesterday"], translations: { something: "algo", wrong: "errado", long: "ansiar / desejar", yesterday: "ontem" } },
  { line: "Yesterday, love was such an easy game to play", words: ["yesterday", "love", "easy", "game", "play"], translations: { yesterday: "ontem", love: "amor", easy: "fácil", game: "jogo", play: "jogar" } },
  { line: "Now I need a place to hide away", words: ["now", "need", "place", "hide", "away"], translations: { now: "agora", need: "precisar", place: "lugar", hide: "esconder", away: "longe / afastado" } },
  { line: "Oh, I believe in yesterday", words: ["believe", "yesterday"], translations: { believe: "acreditar", yesterday: "ontem" } }
];

let progress = {}; // progresso por usuário
let currentQuestion = {}; // questão atual por usuário

// ==========================
// 🔹 Registrar comando /yesterday
// ==========================
const commands = [
  new SlashCommandBuilder()
    .setName("yesterday")
    .setDescription("Pratique inglês com a música Yesterday (The Beatles)")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🚀 Registrando comando /yesterday no servidor...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ Comando registrado com sucesso!");
  } catch (error) {
    console.error(error);
  }
})();

// ==========================
// 🔹 Interações
// ==========================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "yesterday") {
    if (!progress[interaction.user.id]) progress[interaction.user.id] = 0;

    const index = progress[interaction.user.id];
    const verse = yesterdayLyrics[index];

    const hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    const maskedLine = verse.line.replace(new RegExp(hiddenWord, "i"), "____");

    currentQuestion[interaction.user.id] = {
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index
    };

    await interaction.reply(`🎶 ${maskedLine}\n👉 Complete the missing word!`);
  }
});

// ==========================
// 🔹 Mensagens de resposta
// ==========================
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const question = currentQuestion[message.author.id];
  if (!question) return;

  if (message.content.toLowerCase().includes(question.hiddenWord.toLowerCase())) {
    message.reply(
      `✅ Correct!\n**${question.hiddenWord}** = ${question.translation}`
    );

    // avança para o próximo verso
    progress[message.author.id] = question.index + 1;

    if (progress[message.author.id] >= yesterdayLyrics.length) {
      message.channel.send("🔄 You've reached the end of the song. Starting again...");
      progress[message.author.id] = 0;
    }

    currentQuestion[message.author.id] = null;
  } else {
    message.reply("❌ Not quite right, try again!");
  }
});

client.once("ready", () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
