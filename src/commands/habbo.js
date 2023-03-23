const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("habbo")
    .setDescription("Search an Habbo Profile!")
    .addStringOption((option) =>
      option
        .setName("habbo")
        .setDescription("Type the Habbo Username")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The gif category")
        .addChoices(
          { name: "TR - Turkish Hotel", value: "com.tr" },
          { name: "COM - English Hotel", value: "com" },
          { name: "ES - Spanish Hotel", value: "es" },
          { name: "DE - German Hotel", value: "de" },
          { name: "FR - French Hotel", value: "fr" },
          { name: "IT - Italian Hotel", value: "it" },
          { name: "NL - Dutch Hotel", value: "nl" },
          { name: "FI - Finnish Hotel", value: "fi" },
          { name: "BR/PT - Brazilian Hotel", value: "com.br" }
        )
        .setRequired(true)
    ),
  run: async (client, interaction) => {
    const user = encodeURIComponent(interaction.options.getString("habbo"));
    const category = interaction.options.getString("category");

    axios
      .get(`https://www.habbo.${category}/api/public/users?name=${user}`)
      .then((res) => {
        axios
          .get(
            `https://www.habbo.com/api/public/users/${res.data.uniqueId}/profile`
          )
          .then((res) => {
            const data = res.data;

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Habbo Widgets")
                .setURL(
                  `https://www.habbowidgets.com/habinfo/${data.user.uniqueId}`
                )
                .setStyle(ButtonStyle.Link)
            );

            const userEmbed = new EmbedBuilder()
              .setColor("#0099ff")
              .setTitle(data.user.name)
              .setURL(`https://www.habbo.${category}/profile/${data.user.name}`)
              .setDescription(data.user.motto)
              .setThumbnail(
                `https://images.habbo.com/c_images/album1584/${data.user.selectedBadges[0].code}.gif`
              )
              .addFields(
                {
                  name: "Status",
                  value: data.user.online ? ":green_circle:" : ":red_circle: ",
                  inline: false,
                },
                {
                  name: ":calendar_spiral: Created",
                  value: moment(data.user.memberSince).format(
                    "DD.MM.YYYY HH:mm:ss"
                  ),
                  inline: true,
                },
                {
                  name: ":calendar_spiral: Last Access",
                  value: moment(data.user.lastAccessTime).format(
                    "DD.MM.YYYY HH:mm:ss"
                  ),
                  inline: true,
                },
                {
                  name: ":arrow_up: Level",
                  value:
                    data.user.currentLevel +
                    " - " +
                    data.user.currentLevelCompletePercent +
                    "%",
                  inline: true,
                }
              )
              .addFields(
                {
                  name: ":sparkles: Total Experience",
                  value: data.user.totalExperience.toString(),
                  inline: true,
                },
                {
                  name: ":diamonds: Star Gems",
                  value: data.user.starGemCount.toString(),
                  inline: true,
                }
              )
              .addFields(
                {
                  name: ":homes: Owned Rooms",
                  value: data.rooms.length.toString(),
                  inline: true,
                },
                {
                  name: ":military_medal: Badges",
                  value: data.badges.length.toString(),
                  inline: true,
                },
                {
                  name: ":people_hugging: Friends",
                  value: data.friends.length.toString(),
                  inline: true,
                }
              )
              .setImage(
                `https://www.habbo.com.tr/habbo-imaging/avatarimage?&user=${data.user.name}&action=std&direction=2&head_direction=3&img_format=png&gesture=sml&frame=1&headonly=0&size=m`
              )
              .setTimestamp()
              .setFooter({
                text: "Habbo Profile - " + data.user.name,
              });
            interaction.reply({ embeds: [userEmbed], components: [row] });
          });
      })
      .catch((err) => {
        interaction.reply({
          content: "User not found!",
          ephemeral: true,
        });
      });
  },
};
