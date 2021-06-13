# ExpressJS Keycloak Boilerplate [NodeJS ES6]

## Usage

- Run development server
  
  ```
  npm run dev
  ```

- Run production server
  
  ```
  npm start
  ```

- Deploy server on a VM
  ```
  ./deploy.sh
  ```

- Deploy on a cluster **[k8s templates available]**


## Docker images for local development

-   Keycloak - https://hub.docker.com/r/wizzn/keycloak **[arm build]**

    ```
    docker run --name keycloak -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=password -d wizzn/keycloak:12
    ```

-   Keycloak - https://hub.docker.com/r/jboss/keycloak **[linux/amd64 build]**

    ```
    docker run --name keycloak -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=pass@123 -d jboss/keycloak:12.0.0
    ```

-   Mongo DB

    ```
    docker run --name mongo -d -p 27017:27017 -v $HOME/mongodb/data:/data/db mongo
    ```

-   MySql DB

    ```
    docker run  --name mysql -p 3306:3306 -v $HOME/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=pass -d mysql
    ```

## References

-   Keycloak utils - http://www.keycloak.org/keycloak-nodejs-auth-utils/index.html
-   Keycloak connect - https://www.npmjs.com/package/keycloak-connect
-   Keycloak admin client - https://www.npmjs.com/package/keycloak-admin
-   Open Id client - https://www.npmjs.com/package/openid-client
-   Keycloak docs - https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter
-   Keycloak definitions - https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_userrepresentation
