FROM php:8.2-fmp-alpine
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR var/www/
COPY composer.json composer.lock ./
COPY package*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts
COPY . .

EXPOSE 80
