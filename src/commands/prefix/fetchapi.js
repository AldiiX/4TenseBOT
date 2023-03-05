const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { log } = require("../../util/utilfunctions");
const { fetchApi } = require("../../util/fetchapi");

module.exports = {
    name: "fetchapi",
    adminOnly: true,
    run: async (client, message, args) => {
        await fetchApi(client);
        message.delete();
    }
};