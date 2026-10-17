module.exports = {
  apps: [
    {
      name: 'drc-pkh-fe',
      script: 'npm',
      args: 'start',
      watch: ['build'], // Thư mục build sẽ được theo dõi
      ignore_watch: ['node_modules', 'public'], // Bỏ qua các thư mục không cần theo dõi
      watch_options: {
        followSymlinks: false,
      },
      env: {
          NODE_ENV: 'development',
          PORT: 3001,
      },
    },
  ],
};
