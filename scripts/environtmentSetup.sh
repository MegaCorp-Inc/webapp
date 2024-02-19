#!/bin/bash

# install node
dnf module install nodejs:20 -y

# install npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# install postgres
sudo dnf module enable postgresql:15 -y
sudo dnf install postgresql-server -y
sudo postgresql-setup --initdb

# start postgresql server
sudo systemctl start postgresql

# enable systemctl to start server when bootup
sudo systemctl enable postgresql

echo export POSTGRESQL_USER=postgres >> ~/.bash_profile
echo export POSTGRESQL_PASSWORD=2123 >> ~/.bash_profile
echo export POSTGRESQL_DB=postgres >> ~/.bash_profile
echo export POSTGRESQL_HOST=localhost >> ~/.bash_profile
echo export PORT=3000 >> ~/.bash_profile 

source ~/.bash_profile

sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$POSTGRESQL_PASSWORD';"
