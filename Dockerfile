FROM php:8.2-fpm
RUN apt-get update && apt-get install -y \
		libfreetype-dev \
		libjpeg62-turbo-dev \
		libpng-dev \
	&& docker-php-ext-configure gd --with-freetype --with-jpeg \
	&& docker-php-ext-install -j$(nproc) gd
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR var/www/
COPY composer.json composer.lock ./
COPY package*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts
COPY . .

EXPOSE 80
