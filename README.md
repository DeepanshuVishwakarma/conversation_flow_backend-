# Express + Mongoose starter

## Setup

1) Install deps

```bash
npm install
```

2) Create `.env`

Copy `.env.example` to `.env` and set your MongoDB connection string:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/backend_assignment
PORT=5000
```

## Run

```bash
npm run dev
```

## Routes

- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users` body: `{ "name": "A", "email": "a@example.com" }`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`




when working with history api , ai didn't insert time for the chats ... 


implement one more end point , in question router and controller , don't change existing code , 

what u need to do is , that 
proivde an end point " previous question " , in this , 
inside controller , 
fetch user history , last questoin which he attempted , 
populate that question and return that 



in this whole project , use those statuscode which i defiened there inside utils , statics.js , instead of hardcoding , 
also instead of writting hardcoded , route path , define path in that @src/utils/statics/statics.js  and then use those variables there , in routes just like status code , 

it will be like , route.questions.next ,  route.module.getALL , so there won't be string , only the url param will be there hardcoded , like  
, route.questions.next/":moduleId" like this 

then there i defined the apperro in , error.js file  u need to use that centralized error handling in all the controllers 