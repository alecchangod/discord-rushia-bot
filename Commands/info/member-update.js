const { QuickDB } = require("quick.db");
const member = new QuickDB({ filePath: "database/members.sqlite" });
const wait = require("node:timers/promises").setTimeout;
const split = require("../../function/common/split.js");

module.exports = {
  name: "Member Updates",
  aliases: ["member-update"],
  description: "log member changes",
  run: async (client, oldMember, newMember, secret, trans, b_trans) => {
    let _;
    // Check if was saved at database
    const rolehasRecord = await member.get(
      `${newMember.guild.id}_${newMember.user.id}_roles`
    );
    const namehasRecord = await member.get(
      `${newMember.guild.id}_${newMember.user.id}`
    );
    const usernameRecord = await member.get(`${newMember.user.id}_username`);

    // Few logging channels
    const newrecord = await client.channels.fetch(secret.newrecord_log_channel);
    const rolelog = await client.channels.fetch(secret.role_log_channel);
    const usernamelog = await client.channels.fetch(
      secret.username_log_channel
    );

    // Get translations
    const adding = b_trans.strings.find((it) => it.name === "adding").trans;
    const b_m_add = b_trans.strings.find((it) => it.name === "m_add").trans;
    const b_m_rm = b_trans.strings.find((it) => it.name === "m_rm").trans;
    const added = b_trans.strings.find((it) => it.name === "added").trans;
    const b_r_changed = b_trans.strings.find(
      (it) => it.name === "r_changed"
    ).trans;
    const b_now_is = b_trans.strings.find((it) => it.name === "now_is").trans;
    const b_n_change = b_trans.strings.find(
      (it) => it.name === "n_change"
    ).trans;
    const b_n_now_is = b_trans.strings.find(
      (it) => it.name === "n_now_is"
    ).trans;
    const b_n_removed = b_trans.strings.find(
      (it) => it.name === "n_removed"
    ).trans;
    const b_u_change = b_trans.strings.find(
      (it) => it.name === "u_change"
    ).trans;

    const m_add = trans.strings.find((it) => it.name === "m_add").trans;
    const m_rm = trans.strings.find((it) => it.name === "m_rm").trans;
    const r_changed = trans.strings.find((it) => it.name === "r_changed").trans;
    const now_is = trans.strings.find((it) => it.name === "now_is").trans;
    const n_change = trans.strings.find((it) => it.name === "n_change").trans;
    const n_now_is = trans.strings.find((it) => it.name === "n_now_is").trans;
    const n_removed = trans.strings.find((it) => it.name === "n_removed").trans;
    const u_change = trans.strings.find((it) => it.name === "u_change").trans;

    // Save if not yet saved
    if (!rolehasRecord && newMember.guild.id) {
      split(
        `${newMember.guild.name}(${newMember.guild.id})\n ${newMember.user.tag} ${adding}`,
        newrecord,
        _,
        _,
        true
      );
      let role_id_added = [];
      let role_added = [];
      newMember.roles.cache.forEach(async (role) => {
        if (
          !rolehasRecord ||
          !JSON.stringify(rolehasRecord).includes(role.id)
        ) {
          role_id_added.push(role.id);
          role_added.push(`@\`\`${role.name}\`\``);
        }
      });
      (async () => {
        await member.set(
          `${newMember.guild.id}_${newMember.user.id}_roles`,
          role_id_added
        );
        split(
          `${newMember.guild.name}(${newMember.guild.id})\n${
            newMember.user.tag
          } ${b_m_add} ${role_added.join(", ")}`,
          newrecord,
          _,
          _,
          true
        );
      })();

      split(
        `${newMember.guild.name}(${newMember.guild.id})\n${newMember.user.tag} ${added}`,
        newrecord,
        _,
        _,
        true
      );
    }

    if (!namehasRecord && newMember.guild.id) {
      const authorTag = `${newMember.user.discriminator === "0" ? "@" : ""}${
        newMember.displayName
      }${
        newMember.user.discriminator === "0"
          ? ""
          : `#${newMember.user.discriminator}`
      }`;
      (async () => {
        await member.set(
          `${newMember.guild.id}_${newMember.user.id}`,
          authorTag
        );
      })();

      split(
        `${newMember.guild.name}(${newMember.guild.id})\n${authorTag} ${added}`,
        newrecord,
        _,
        _,
        true
      );
    }

    // Find log channel
    const log = newMember.guild.channels.cache.find(
      (ch) => ch.name.toLowerCase() === "log"
    );

    // Check for roles changes
    // Get saved roles id
    let recorded = await member.get(
      `${newMember.guild.id}_${newMember.user.id}_roles`
    );

    // Wait for 1 second for new record if recorded was null
    if (!recorded) {
      await wait(1000);
      recorded = await member.get(
        `${newMember.guild.id}_${newMember.user.id}_roles`
      );
    }

    // Removal
    const removedRoles = oldMember.roles.cache.filter(
      (role) => !newMember.roles.cache.has(role.id)
    );
    if (removedRoles.size) {
      const roleNames = removedRoles.map((r) => r.name).toString();
      if (roleNames.length) {
        await member.pull(
          `${newMember.guild.id}_${newMember.user.id}_roles`,
          removedRoles.map((r) => r.id)
        );
        const newr = `${newMember.user.tag} ${m_rm} @\`\`${roleNames}\`\``;
        const b_newr = `${newMember.user.tag} ${b_m_rm} @\`\`${roleNames}\`\``;
        split(
          `**${b_r_changed}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_newr}`,
          rolelog,
          _,
          _,
          true
        );
        if (log) split(`**${r_changed}**\n\n${newr}`, log, _, _, true);
      }
    }

    // Addition
    const addedRoles = newMember.roles.cache.filter(
      (role) => !oldMember.roles.cache.has(role.id)
    );
    if (addedRoles.size) {
      const roleNames = addedRoles.map((r) => r.name).toString();
      if (roleNames.length) {
        await member.push(
          `${newMember.guild.id}_${newMember.user.id}_roles`,
          addedRoles.map((r) => r.id)
        );
        const rmr = `${newMember.user.tag} ${m_add} @\`\`${roleNames}\`\``;
        const b_rmr = `${newMember.user.tag} ${b_m_add} @\`\`${roleNames}\`\``;
        split(
          `**${b_r_changed}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_rmr}`,
          rolelog,
          _,
          _,
          true
        );
        if (log) split(`**${r_changed}**\n\n${rmr}`, log, _, _, true);
      }
    }

    // Check for name changes and save new username
    // Username changes
    if (newMember.user.tag && usernameRecord != newMember.user.tag) {
      const authorTag = `${newMember.user.discriminator === "0" ? "@" : ""}${
        newMember.user.username
      }${
        newMember.user.discriminator === "0"
          ? ""
          : `#${newMember.user.discriminator}`
      }`;
      (async () => {
        await member.set(`${newMember.user.id}_username`, authorTag);
      })();
      const name = `${usernameRecord} ${now_is} ${authorTag}`;
      const b_name = `${usernameRecord} ${b_now_is} ${authorTag}`;
      // Only send message when really changed name and old record wasn't null
      if (!usernameRecord) return;
      if (usernameRecord != authorTag) {
        split(
          `**${b_u_change}**\n\n${newMember.guild.name}(${newMember.guild.id})\n ${b_name}`,
          usernamelog,
          _,
          _,
          true
        );
        if (log) split(`**${u_change}**\n\n${name}`, log, _, _, true);
      }
    }
    // Display name changes
    const authorTag = `${newMember.user.discriminator === "0" ? "@" : ""}${
      newMember.displayName
    }${
      newMember.user.discriminator === "0"
        ? ""
        : `#${newMember.user.discriminator}`
    }`;
    if (
      newMember.displayName &&
      namehasRecord != authorTag &&
      newMember.guild.id
    ) {
      (async () => {
        await member.set(
          `${newMember.guild.id}_${newMember.user.id}`,
          authorTag
        );
      })();

      if (!namehasRecord) return;
      let removed_nickname =
        newMember.user.globalName === newMember.displayName;
      const name = `${removed_nickname ? authorTag : namehasRecord} ${
        removed_nickname ? n_removed.toLowerCase() : n_now_is
      } ${removed_nickname ? namehasRecord : authorTag}`;
      const b_name = `${removed_nickname ? authorTag : namehasRecord} ${
        removed_nickname ? b_n_removed.toLowerCase() : b_n_now_is
      } ${removed_nickname ? namehasRecord : authorTag}`;
      // Only send message when really changed name
      if (namehasRecord != authorTag) {
        split(
          `**${removed_nickname ? b_n_removed : b_n_change}**\n\n${
            newMember.guild.name
          }(${newMember.guild.id})\n ${b_name}`,
          usernamelog,
          _,
          _,
          true
        );
        if (log)
          split(
            `**${removed_nickname ? n_removed : n_change}**\n\n${name}`,
            log,
            _,
            _,
            true
          );
      }
    }
  },
};
