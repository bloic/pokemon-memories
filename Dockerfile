FROM php:8.2-fpm

# Installe les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
        git \
        unzip \
        zip \
        libzip-dev \
        libfreetype-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copie Composer depuis l'image officielle
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Définit le répertoire de travail
WORKDIR /var/www

# Copie les fichiers de dépendances pour tirer parti du cache Docker
COPY composer.json composer.lock ./
COPY package*.json ./

# Installe les dépendances PHP sans les dev
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copie le reste du code
COPY . .

# Expose le port 80 (pour FPM, souvent utile si un nginx sera lié)
EXPOSE 80

# Par défaut, php-fpm démarre automatiquement dans cette image
