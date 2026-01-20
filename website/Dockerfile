# Stage 1: Build the static HTML / CSS / JS bundle
#          This stage is responsible for using Jekyll to build the static
#          files that are ultimately served by nginx. This is not the final
#          image.
FROM node:18-bookworm AS build-image
ARG http_proxy
ARG https_proxy
ARG no_proxy

ENV http_proxy=$http_proxy \
    https_proxy=$https_proxy \
    no_proxy=$no_proxy \
    HTTP_PROXY=$http_proxy \
    HTTPS_PROXY=$https_proxy \
    NO_PROXY=$no_proxy

# Install Ruby and update certificates
RUN apt-get update && \
    apt-get install -y ruby-full build-essential ca-certificates && \
    update-ca-certificates && \
    gem install bundler

WORKDIR /app
COPY ./Gemfile /app/Gemfile
COPY ./package.json /app/package.json
RUN npm install --legacy-peer-deps chart.js && \
    bundle install

COPY . /app
RUN bundle exec jekyll build && \
    npx gulp updateUswds


# Stage 2: Build the final nginx image
#          This stage is responsible for building the final nginx image that
#          contains the static files generated in Stage 1.
FROM nginxinc/nginx-unprivileged:alpine AS runtime-image
ARG http_proxy
ARG https_proxy
ARG no_proxy

ENV http_proxy=$http_proxy \
    https_proxy=$https_proxy \
    no_proxy=$no_proxy \
    HTTP_PROXY=$http_proxy \
    HTTPS_PROXY=$https_proxy \
    NO_PROXY=$no_proxy

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/_site /usr/share/nginx/html
EXPOSE 8080