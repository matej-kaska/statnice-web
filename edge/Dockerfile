FROM alpine:3
RUN apk add --no-cache brotli nginx nginx-mod-http-brotli

RUN mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/run/nginx /var/log/nginx

COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]