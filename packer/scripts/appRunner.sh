#!/bin/bash

sudo adduser csye6225 --shell /usr/sbin/nologin

sudo cp /tmp/csye6225.service /etc/systemd/system/csye6225.service

sudo tar -xvf /tmp/webapp-artifact.tar.gz -C /opt/

sudo npm -C /opt/webapp install

sudo mv /opt/webapp/packer/config.yaml /etc/google-cloud-ops-agent/config.yaml
sudo systemctl restart google-cloud-ops-agent

sudo chown -R csye6225:csye6225 /opt/webapp

sudo ln -s /opt/webapp/webapp.log /var/log/webapp.log

sudo chown -R csye6225:csye6225 /var/log/webapp.log

sudo chmod u+x /opt/webapp/server.js

sudo systemctl daemon-reload

sudo systemctl enable csye6225
