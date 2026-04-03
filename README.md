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
 

 



 backend is almost done , frontend u need to create from scratch , since i only created empty folder , please go through backend and generate frontend for this project ,

for this whole project i want to generate frontend using react js , and tailwind , and other importatn things , needed , my frontend is very small , nothing big 

first i want two screen login signup , 
if that appears , 

frontend will fetch all modules , so it has to call one api , 
router.get(route.modules.root, auth, getAllModules);
reponse is here 
{
    "modules": [
        {
            "_id": "69cec38448e881833dcfd9af",
            "name": "Mental Wellbeing",
            "module_id": "mod_1",
            "startQuestion": "69cec38148e881833dcfd962",
            "__v": 0
        },
        {
            "_id": "69cec38848e881833dcfd9fe",
            "name": "Career Growth",
            "module_id": "mod_2",
            "startQuestion": "69cec38448e881833dcfd9b1",
            "__v": 0
        },
        {
            "_id": "69cec38b48e881833dcfda4d",
            "name": "Fitness & Health",
            "module_id": "mod_3",
            "startQuestion": "69cec38848e881833dcfda00",
            "__v": 0
        }
    ]
}



once loded , then i want to 
show one screen that will appear on screen , it will give three options to choose module ... 

between module one - two three ,
based on what user selectes , then what i will do is 

router.get(`${route.modules.root}:moduleId`, auth, getQuestion);

this will be called 
show loading , when loading is done 
this returns one question  ,  so that question should appear on ui , 
this is the response of that api 

{
    "module": {
        "name": "Career Growth",
        "moduleId": "mod_2"
    },
    "startQuestion": {
        "options": {
            "yes": {
                "nextQuestion": "69cec38448e881833dcfd9b3"
            },
            "no": {
                "nextQuestion": "69cec38448e881833dcfd9b5"
            }
        },
        "_id": "69cec38448e881833dcfd9b1",
        "question": "Welcome to Career Growth. Are you ready to analyze your progress?",
        "question_id": "m2_q1",
        "isCheckPoint": false,
        "__v": 0
    }
}

simulatanoious on same screen on right side we will show history of that module so this is the api 
http://localhost:5000/api/modules/history/mod_2, 

response 
{
    "moduleId": "mod_2",
    "chatHistory": [
        {
            "questionId": "69cec38148e881833dcfd964",
            "question": "[Mental Wellbeing] Level 2 - Is your primary concern regarding motivation?",
            "selectedOption": "yes",
            "answeredAt": "2026-04-03T12:00:03.739Z",
            "_id": "69cfabc3629422bde118206e"
        },
        {
            "questionId": "69cec38148e881833dcfd968",
            "question": "[Mental Wellbeing] Level 3 - Is your primary concern regarding conflict?",
            "selectedOption": "yes",
            "answeredAt": "2026-04-03T12:18:29.033Z",
            "_id": "69cfb0159314c9d455199484"
        },
        {
            "questionId": "69cec38148e881833dcfd970",
            "question": "[Mental Wellbeing] Level 4 - Is your primary concern regarding exhaustion?",
            "selectedOption": "yes",
            "answeredAt": "2026-04-03T12:18:51.838Z",
            "_id": "69cfb02b9314c9d45519948e"
        },
        {
            "questionId": "69cec38248e881833dcfd980",
            "question": "[Result] Based on your Mental Wellbeing path, we recommend focusing on exhaustion improvement.",
            "selectedOption": "yes",
            "answeredAt": "2026-04-03T12:25:23.957Z",
            "_id": "69cfb1b3bf7e7cbfcc17cf20"
        }
    ]
}


and show these chats there , 

show that like a chatsystme .. question left side , then on below that provided answer , right side 

if click on question then that question should appear on left side of screen where we are showing other question , 
call this api .... 
/api/questions/:moduleId/:questionId
example - > GET http://localhost:5000/api/questions/mod_2/69cec38448e881833dcfd9b1


{
    "module": {
        "name": "Career Growth",
        "moduleId": "mod_2"
    },
    "question": {
        "options": {
            "yes": {
                "nextQuestion": "69cec38448e881833dcfd9b3"
            },
            "no": {
                "nextQuestion": "69cec38448e881833dcfd9b5"
            }
        },
        "_id": "69cec38448e881833dcfd9b1",
        "question": "Welcome to Career Growth. Are you ready to analyze your progress?",
        "question_id": "m2_q1",
        "isCheckPoint": false,
        "__v": 0
    }
}


where u show the screen there should optoins bellow , as provided in queston , nad then one submit button , when u click that , u call this api 
http://localhost:5000/api/questions/next


body {
  "currentQuestionId": "69cec38448e881833dcfd9b1",
  "answer": "yes",
  "moduleId": "mod_2"
}

response 
{
    "isComplete": false,
    "nextQuestion": {
        "_id": "69cec38448e881833dcfd9b3",
        "question": "[Career Growth] Level 2 - Is your primary concern regarding skills?",
        "options": [
            "yes",
            "no"
        ]
    }
}


a previous question button 
api -> http://localhost:5000/api/questions/previous/question

response 

{
    "moduleId": "mod_2",
    "previousQuestion": {
        "options": {
            "yes": {
                "nextQuestion": "69cec38448e881833dcfd9b3"
            },
            "no": {
                "nextQuestion": "69cec38448e881833dcfd9b5"
            }
        },
        "_id": "69cec38448e881833dcfd9b1",
        "question": "Welcome to Career Growth. Are you ready to analyze your progress?",
        "question_id": "m2_q1",
        "isCheckPoint": false,
        "__v": 0
    },
    "selectedOption": "yes",
    "answeredAt": "2026-04-03T13:43:30.706Z"
}
show this question on question screeen , with options .. 

u will also provide options to change module , show the list and let user change module , 
and as module changes then u will call history for that module and show that in section ...
and also this api 

router.get(`${route.modules.root}:moduleId`, auth, getQuestion);
again the default question will come on screen , so u need to show that on screen , with changed module history , 

implement all this apis , 


## Rules
use custom hook to call api , for example 
import { useState } from "react";
import axios from "./axios";
import { BASE_URL } from "../service/apis";
export default function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendRequest = async ({
    url,
    method,
    body = null,
    headers = {},
    rawHeader = null,
  }) => {
    setIsLoading(true);
    try {
      // console.log("body inside useHttp", body);

      const response = await axios({
        url,
        method,
        data: body,
        headers: rawHeader || {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        setData(response.data);
      }
    } catch (err) {
      // console.error(err?.response?.data);
      // console.log(err);
      setError(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    }
    setIsLoading(false);
  };

  return { isLoading, error, data, sendRequest, setError, setData };
}
- Show spinner when any API is loading
- Show red error message if API returns error
- Protected routes — redirect to /login if no token
- Keep UI simple, functionality is priority