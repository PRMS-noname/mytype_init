FROM mongo:6.0

WORKDIR /app

# Create a shell script to handle initialization
RUN echo '#!/bin/bash\n\
if [ -f /app/init.js ]; then\n\
  echo "Initialization script found, copying to init directory..."\n\
  cp /app/init.js /docker-entrypoint-initdb.d/\n\
else\n\
  echo "No initialization script found, skipping..."\n\
fi\n\
exec "$@"' > /docker-entrypoint-initdb.d/init.sh && \
chmod +x /docker-entrypoint-initdb.d/init.sh

# Copy initialization script
COPY init.js /app/init.js

# Expose MongoDB port
EXPOSE 27017

# Use the default MongoDB command
CMD ["mongod"]

