# Banco
Banco A Github Repository API integration Application enabled with proxy and server side caching

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
nodejs 8+

```

### Installing
1. Clone the banco repo from git hub 
2. switch to banco folder
3. Inastall the node_modules by typing the command : #npm i
4. Once all the dependencies are installed 
5. Run the server with : #npm run server 
6. Then switch to browser, the server would be runnning on http://localhost:3000 , change the port in test,js if required.

# Consuming API Service from banco from postman

```

    1. Get Git hub Repos of Github User  
    URL : localhost:3000/api/users/github/<github username>
    Method : GET 
    Access : Public
    
    2. Get Access token with git hub username
    URL : localhost:3000/api/auth  | 
    Method : POST
    Access : Public
    RAW POST body: {"user_name":"sab30"}
    Content-Type : app;licaton/json
    
    3. Access notificatios api via token 
    URL : localhost:3000/api/notifications
    Method : GET 
    Access : Private
    Content-Type : app;licaton/json
    Headers : x-auth-token : JWT token received form the above 2
    
    4. Proxy API - In progress
    5. Caaching User Results - In Progress

```
