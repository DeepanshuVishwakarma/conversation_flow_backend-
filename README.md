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



crud-repo.js 
now instead of directly calling db from controller , use this repository pattern , u might want to update or add a few new method there , or u might want to create different repo for each , modules user questions , just extand them with this crudrep0 so child class will use the crud repo method , but the object inside controller will be specic to that feature like question , if there is any other new method , we can define it in that specific repo , instead of making fuss of defining everything , 

This is exmaple 
const CrudRepository = require("./crud-repository");
const Room = require("../models/Room");

class RoomRepository extends CrudRepository {
  constructor() {
    super(Room);
  }
}

module.exports = RoomRepository;

just make these update to code , nothing facncy new  , like don't change logi , just calling of db should be done throu repo , not in controller 








now do one thing more , for each folder , like controller , route  , repo , module , 

i want to create one index.js file inside each fodler like for example repository

there import all them repo, question , module , user

and then export them all at once 

so instead of this mess , 3 line import , we will have one line imprt 
@questionController.js (3-5) 

we can do it like 

{ questoinrepo , modulerepo ,  userrepo }from index.js , in one line 
do this in whole project where ever it is possible 

for this whole project i want to generate frontend using react js , and tailwind , and other importatn things , needed , my frontend is very small , nothing big 

first i want two screen login signup , 
if that appears , 

frontend will fetch all modules , so it has to call one api , 
router.get(route.modules.root, auth, getAllModules);


once loded , then i want to 
show one screen that will appear on screen , it will give three options to choose module ... 

between module one - two three ,
based on what user selectes , then what i will do is 

router.get(`${route.modules.root}:moduleId`, auth, getQuestion);
this will be called 
 

 