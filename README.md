# ExpressJS Keycloak Boilerplate [NodeJS ES6]

## References

- Keycloak connect - https://www.npmjs.com/package/keycloak-connect
- Keycloak admin client - https://www.npmjs.com/package/keycloak-admin
- Open Id client - https://www.npmjs.com/package/openid-client
- Keycloak docs - https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter
- Keycloak definitions - https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_userrepresentation

## Docker images for local development

- arm build - https://hub.docker.com/r/wizzn/keycloak

  `docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=password -d wizzn/keycloak:12`

- linux/amd64 build - https://hub.docker.com/r/jboss/keycloak

  `docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=pass@123 -d jboss/keycloak:12.0.0`
