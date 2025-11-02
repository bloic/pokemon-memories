FROM php:8.2-fpm

# Installer les dépendances nécessaires pour GD (images)
RUN apt-get update && apt-get install -y \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www

# Copier les fichiers composer
COPY composer.json composer.lock ./

# Installer les dépendances PHP (sans dev)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copier le reste du code
COPY . .

# Exposer le port 80 (nginx ou php-fpm écoute)
EXPOSE 80

# Démarrer php-fpm
CMD ["php-fpm"]
