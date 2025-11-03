FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
        git \
        nano \
        unzip \
        zip \
        libzip-dev \
        libfreetype-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY composer.json composer.lock ./
COPY package*.json ./

RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .

COPY .env .env.prod

RUN sed -i 's/^APP_ENV=DEV/APP_ENV=PROD/' .env.prod

# Définir les variables d’environnement dans le conteneur
ENV APP_ENV=prod
ENV DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "public"]
