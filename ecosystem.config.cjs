module.exports = {
  apps: [
    {
      name: "kaya-healing-spa",
      cwd: "/var/www/kaya-healing-spa",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3005",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: "3005",
      },
    },
  ],
};
