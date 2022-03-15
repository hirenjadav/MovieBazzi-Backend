const compression = require("compression");
const helmet = require("helmet");

export default function producton(app) {
  app.use(helmet());
  app.use(compression());
}
