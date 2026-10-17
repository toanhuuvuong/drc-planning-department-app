#!/bin/bash

if [ -f ~/.ssh/ssh_agent_env ]; then
    source ~/.ssh/ssh_agent_env > /dev/null
fi

PROJECT_DIR="/home/khanh/DRC/pkh-fe/drc-planning-department-app"


cd $PROJECT_DIR

export PATH=$PATH:/usr/bin:/usr/local/bin
export SSH_AUTH_SOCK=$(eval echo "$SSH_AUTH_SOCK")


git fetch


if [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ]; then
  echo "Có cập nhật mới, tiến hành pull và build lại."


  git pull


  npm install


  npm run build


  /home/khanh/.nvm/versions/node/v20.10.0/bin/pm2 restart 8
else
  echo "Không có cập nhật mới."
fi
