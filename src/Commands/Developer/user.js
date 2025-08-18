const user = interaction.user;

const info = `
👤 Usuário: ${user.username}
🆔 ID: ${user.id}
🔖 Tag: ${user.tag}
🖼 Avatar: [Link](${user.displayAvatarURL({ dynamic: true })})
🎖 Flags: ${user.flags?.toArray().join(", ") || "Nenhuma"}
`;

await interaction.reply(info);
