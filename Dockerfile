FROM php:8.2-fpm

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    git \
    nano \
    unzip \
    zip \
    libzip-dev \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libicu-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install -j$(nproc) intl gd pdo_mysql zip \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copier Composer depuis l'image officielle
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copier uniquement les fichiers nécessaires à l’installation
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copier le reste du code
COPY . .

# Créer un fichier .env.prod propre à la prod
COPY .env .env.prod
RUN sed -i 's/^APP_ENV=dev/APP_ENV=prod/' .env.prod \
 && echo "APP_SECRET=2dde61a257dee0e26825a7fdfbc54291" >> .env.prod

# Définir les variables d’environnement dans le conteneur
ENV APP_ENV=prod
ENV APP_SECRET=2dde61a257dee0e26825a7fdfbc54291
ENV DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"

# Exposer le port FPM (9000 par défaut)
EXPOSE 9000

# Démarrer PHP-FPM (processus principal)
CMD ["php-fpm"]
