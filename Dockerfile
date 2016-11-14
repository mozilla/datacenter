# Based on:
# https://github.com/mozilla-services/Dockerflow/blob/f376b32476c737c0ede96451b2bd2c0c085a80e2/Dockerfile

FROM node:7.1.0

# Add a non-privileged user for installing and running the application
RUN groupadd --gid 10001 app && \
    useradd --uid 10001 --gid 10001 --home /app --create-home app

WORKDIR /app

# Copy source files to the directory being served
COPY . /app

# Install requirements and clean up unneeded cache data
RUN su app -c "npm install" && \
    npm cache clear && \
    rm -rf ~app/.node-gyp

# Run
USER app
ENTRYPOINT ["npm"]
CMD ["start"]
