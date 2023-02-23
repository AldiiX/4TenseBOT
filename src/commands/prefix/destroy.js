const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { log } = require("../../util/utilfunctions");

module.exports = {
    name: "destroy",
    adminOnly: true,
    run: async (client, message, args) => {
        await log("Bot se vypíná... 🌙", "warn");
        await message.delete();

        client.destroy();
        process.kill(process.pid);
    }
};