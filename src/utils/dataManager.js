const fs = require("fs");
const path = require("path");
let settings = fs.existsSync(path.join(__dirname, "../data/settings.json"))
  ? require("../data/settings.json")
  : {};

const saveGiveaway = (guild, messageId) => {
  settings = {
    ...settings,
    [messageId]: guild,
  };
  fs.writeFileSync(
    path.join(__dirname, "../data/settings.json"),
    JSON.stringify(settings),
    (err) => {
      if (err) console.error(err);
    }
  );
};

const getGiveaway = (messageId) => {
  return settings[messageId] ?? null;
};

const getAllGiveaways = () => {
  return settings;
};

const deleteGiveaway = (messageId) => {
  delete settings[messageId];
  fs.writeFileSync(
    path.join(__dirname, "../data/settings.json"),
    JSON.stringify(settings),
    (err) => {
      if (err) console.error(err);
    }
  );
};

module.exports = {
  saveGiveaway,
  getGiveaway,
  deleteGiveaway,
  getAllGiveaways,
};
