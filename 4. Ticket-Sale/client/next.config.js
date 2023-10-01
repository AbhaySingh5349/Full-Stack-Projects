// delete client-depl pod if it exists and deployment will create new pod including this config file
// this file loads up automatically when project starts up, next read this file and watch for file changes in 300ms
module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
