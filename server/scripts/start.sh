#!/bin/bash

# change cwd to project root
cd "$(dirname $(dirname "${BASH_SOURCE[0]}"))"

pm2 stop zylaxapp 2> /dev/null 
sudo pm2 start dist/app.js --name zylaxapp
sudo pm2 save
