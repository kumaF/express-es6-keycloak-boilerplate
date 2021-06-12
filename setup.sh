#!/bin/bash

apt update

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -

apt install nodejs

apt install build-essential

npm install pm2 -g

echo "nodejs 14.x installed with pm2"