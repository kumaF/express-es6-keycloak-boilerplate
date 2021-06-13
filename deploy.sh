#!/bin/bash

sh ./setup.sh

npm install --only=production

pm2 start --name=nodeapp npm -- start