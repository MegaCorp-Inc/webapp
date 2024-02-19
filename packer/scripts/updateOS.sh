#!/bin/bash

sudo dnf update -y
sudo dnf install vim-enhanced -y

sudo firewall-cmd --zone=public --add-port=22/tcp --permanent
sudo firewall-cmd --reload
