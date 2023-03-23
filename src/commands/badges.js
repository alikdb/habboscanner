const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("badge")
    .setDescription("Search badges")
    .addStringOption((option) =>
      option.setName("code").setDescription("Search a badge").setRequired(true)
    ),
  run: async (client, interaction) => {
    const code = interaction.options.getString("code");
    axios
      .get(`https://apihabbo.com/api/badges?code=${code}`)
      .then((res) => {
        console.log(res.data);
        const badgeData = res.data;
        const countryBadges = [];
        badgeData.data.forEach((badge) => {
          countryBadges[badge.hotel] = badge;
        });

        console.log(countryBadges);

        const embed = new EmbedBuilder()
          .setTitle(code.toUpperCase())
          .setThumbnail(
            `https://images.habbo.com/c_images/album1584/${code.toUpperCase()}.gif`
          )
          .setColor("#0099ff")
          .addFields(
            {
              name: ":flag_tr:",
              value: countryBadges["com.tr"]
                ? `**Name:** ${countryBadges["com.tr"].name}\n**Description:** ${countryBadges["com.tr"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_us:",
              value: countryBadges["com"]
                ? `**Name:** ${countryBadges["com"].name}\n**Description:** ${countryBadges["com"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_es:",
              value: countryBadges["es"]
                ? `**Name:** ${countryBadges["es"].name}\n**Description:** ${countryBadges["es"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_de:",
              value: countryBadges["de"]
                ? `**Name:** ${countryBadges["de"].name}\n**Description:** ${countryBadges["de"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_fr:",
              value: countryBadges["fr"]
                ? `**Name:** ${countryBadges["fr"].name}\n**Description:** ${countryBadges["fr"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_it:",
              value: countryBadges["it"]
                ? `**Name:** ${countryBadges["it"].name}\n**Description:** ${countryBadges["it"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_nl:",
              value: countryBadges["nl"]
                ? `**Name:** ${countryBadges["nl"].name}\n**Description:** ${countryBadges["nl"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_fi:",
              value: countryBadges["fi"]
                ? `**Name:** ${countryBadges["fi"].name}\n**Description:** ${countryBadges["fi"].description}`
                : "Not Found",
              inline: true,
            },
            {
              name: ":flag_br:",
              value: countryBadges["br"]
                ? `**Name:** ${countryBadges["com.br"].name}\n**Description:** ${countryBadges["com.br"].description}`
                : "Not Found",
              inline: true,
            }
          );
        interaction.reply({ embeds: [embed] });
      })
      .catch((err) => {
        const embed = new EmbedBuilder()
          .setTitle("Badge Not Found")
          .setDescription("The badge you searched for was not found.")
          .setColor("#ff0000")
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
      });
  },
};
