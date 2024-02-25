#!/bin/bash

# install node
sudo dnf module install nodejs:20 -y

# install npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bash_profile
