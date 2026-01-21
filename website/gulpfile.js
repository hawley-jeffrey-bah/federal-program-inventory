const uswds = require("uswds-extended/compile");
const path = require("path");

uswds.settings.version = 3;

uswds.paths.dist.css = path.join(__dirname, "assets/css");
uswds.paths.dist.theme = path.join(__dirname, "sass");
uswds.paths.dist.img = path.join(__dirname, "assets/img");
uswds.paths.dist.fonts = path.join(__dirname, "assets/fonts");
uswds.paths.dist.js = path.join(__dirname, "assets/js");

exports.init = uswds.init;
exports.compile = uswds.compile;
exports.watch = uswds.watch;