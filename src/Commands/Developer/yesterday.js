require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Letra da música "Yesterday" (The Beatles)
const yesterdayLyrics = [
  {
    line: "Yesterday, all my troubles seemed so far away",
    words: ["yesterday", "troubles", "seemed", "far", "away"],
    translations: {
      yesterday: "ontem",
      troubles: "problemas",
      seemed: "pareciam",
      far: "longe",
      away: "distante"
    }
  },
  {
    line: "Now it looks as though they're here to stay",
    words: ["now", "looks", "though", "stay"],
    translations: {
      now: "agora",
      looks: "parece",
      though: "embora / como se",
      stay: "ficar"
    }
  },
  {
    line: "Oh, I believe in yesterday",
    words: ["believe", "yesterday"],
    translations: {
      believe: "acreditar",
      yesterday: "ontem"
    }
  },
  {
    line: "Suddenly, I'm not half the man I used to be",
    words: ["suddenly", "half", "used"],
    translations: {
      suddenly: "de repente",
      half: "metade",
      used: "costumava"
    }
  },
  {
    line: "There's a shadow hanging over me",
    words: ["shadow", "hanging", "over"],
    translations: {
      shadow: "sombra",
      hanging: "pairando",
      over: "sobre"
    }
  },
  {
    line: "Oh, yesterday came suddenly",
    words: ["yesterday", "came", "suddenly"],
    translations: {
      yesterday: "ontem",
      came: "veio",
      suddenly: "de repente"
    }
  },
  {
    line: "Why she had to go I don't know, she wouldn't say",
    words: ["why", "go", "know", "say"],
    translations: {
      why: "por que",
      go: "ir",
      know: "saber",
      say: "dizer"
    }
  },
  {
    line: "I said something wrong, now I long for yesterday",
    words: ["something", "wrong", "long", "yesterday"],
    translations: {
      something: "algo",
      wrong: "errado",
      long: "ansiar / desejar",
      yesterday: "ontem"
    }
  },
  {
    line: "Yesterday, love was such an easy game to play",
    words: ["yesterday", "love", "easy", "game", "play"],
    translations: {
      yesterday: "ontem",
      love: "amor",
      easy: "fácil",
      game: "jogo",
      play: "jogar"
    }
  },
  {
    line: "Now I need a place to hide away",
    words: ["now", "need", "place", "hide", "away"],
    translations: {
      now: "agora",
      need: "precisar",
      place: "lugar",
      hide: "esconder",
      away: "longe / afastado"
    }
  },
  {
    line: "Oh, I believe in yesterday",
    words: ["believe", "yesterday"],
    translations: {
      believe: "acreditar",
      yesterday: "ontem"
    }
  }
];

let progress = {}; // progresso por usuário
let currentQuestion = null;

client.once("ready", () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const msg = message.content.toLowerCase();

  // Comando !yesterday
  if (msg === "!yesterday") {
    if (!progress[message.author.id]) progress[message.author.id] = 0;

    let index = progress[message.author.id];
    let verse = yesterdayLyrics[index];

    // escolhe uma palavra aleatória do verso para esconder
    let hiddenWord = verse.words[Math.floor(Math.random() * verse.words.length)];
    let maskedLine = verse.line.replace(new RegExp(hiddenWord, "i"), "____");

    currentQuestion = {
      hiddenWord,
      translation: verse.translations[hiddenWord],
      index,
      user: message.author.id
    };

    message.channel.send(`🎶 ${maskedLine}\n👉 Complete the missing word!`);
    return;
  }

  // Checar resposta
  if (currentQuestion && currentQuestion.user === message.author.id) {
    if (msg.includes(currentQuestion.hiddenWord.toLowerCase())) {
      message.channel.send(
        `✅ Correct!\n**${currentQuestion.hiddenWord}** = ${currentQuestion.translation}`
      );

      // avança para o próximo verso
      progress[message.author.id] = currentQuestion.index + 1;

      // reinicia se chegar no fim
      if (progress[message.author.id] >= yesterdayLyrics.length) {
        message.channel.send("🔄 You've reached the end of the song. Starting again...");
        progress[message.author.id] = 0;
      }

      currentQuestion = null;
    } else {
      message.channel.send("❌ Not quite right, try again!");
    }
  }
});

client.login(process.env.BOT_ID);
