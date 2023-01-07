module.exports = {
  apps: [
    {
      name: "nestjs-boilerplate",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
