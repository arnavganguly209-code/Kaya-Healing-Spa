module.exports = {
  apps: [
    {
      name: "kaya-healing-spa",
      cwd: "/var/www/kaya-healing-spa",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3005",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: "3005",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
