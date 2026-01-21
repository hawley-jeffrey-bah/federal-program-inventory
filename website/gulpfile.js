const uswds = require("uswds-extended/compile");
const path = require("path");

uswds.settings.version = 3;

uswds.paths.dist.css = path.join(__dirname, "assets/css");
uswds.paths.dist.theme = path.join(__dirname, "sass");

exports.init = uswds.init;
exports.compile = uswds.compile;
exports.watch = uswds.watch;