#!/bin/bash

sudo adduser csye6225 --shell /usr/sbin/nologin

sudo cp /tmp/csye6225.service /etc/systemd/system/csye6225.service

sudo tar -xvf /tmp/webapp-artifact.tar.gz -C /opt/

sudo npm -C /opt/webapp install

sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod u+x /opt/webapp/server.js

sudo systemctl daemon-reload

sudo systemctl enable csye6225
