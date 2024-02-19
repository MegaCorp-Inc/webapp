#!/bin/bash

# Function to modify pg_hba.conf file
modify_pg_hba_conf() {
    local pg_hba_conf="/var/lib/pgsql/data/pg_hba.conf"  # Adjust path if necessary
    local old_auth_method="$1"
    local old_auth_2_method="$2"
    local new_auth_method="$3"

    # Backup pg_hba.conf
    sudo cp "$pg_hba_conf" "$pg_hba_conf.bak"

    # Replace old_auth_method with new_auth_method in pg_hba.conf
    sudo sed -i "s/\b$old_auth_method\b/$new_auth_method/" "$pg_hba_conf"
    sudo sed -i "s/\b$old_auth_2_method\b/$new_auth_method/" "$pg_hba_conf"
}

# Function to reload PostgreSQL service
reload_postgresql_service() {
    # Check if systemctl is available
    if command -v systemctl &> /dev/null; then
        sudo systemctl reload postgresql
    elif command -v service &> /dev/null; then
        sudo service postgresql reload
    else
        echo "Unable to reload PostgreSQL service. Please do it manually."
        exit 1
    fi
}

# Main script

# Modify pg_hba.conf
modify_pg_hba_conf "peer" "ident" "md5"

# Reload PostgreSQL service
reload_postgresql_service

echo "PostgreSQL authentication method updated successfully."
