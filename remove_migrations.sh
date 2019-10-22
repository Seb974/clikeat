#!/bin/bash

# change directory to symfony project
cd ap_hero/src/Migrations
rm *.php
cd ../..

php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console make:migration
