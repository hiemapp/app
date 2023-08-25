#!/bin/bash

# change cwd to project root
cd "$(dirname $(dirname "${BASH_SOURCE[0]}"))"

sudo pm2 stop zylaxapp
sudo pm2 save