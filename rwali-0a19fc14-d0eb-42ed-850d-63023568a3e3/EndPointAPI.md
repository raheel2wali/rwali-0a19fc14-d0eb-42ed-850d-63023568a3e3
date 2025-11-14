baseUrl → http://localhost:3000
token → yahan login ke baad JWT paste karna hai (sirf string, Bearer nahi)


http://localhost:3000/api/auth/register [POST]

Body (JSON):
{
  "email": "raheel@demo.com",
  "password": "password1"
}


Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "raheel@demo.com",
    "orgId": "org-uuid",
    "role": "owner"
  }
}

http://localhost:3000/api/auth/login  [POST]

Body:

{
  "email": "raheel@demo.com",
  "password": "password1"
}


Response same structure as register.


Header sab endpoints pe:
Authorization: Bearer {{token}}
Content-Type: application/json (for POST/PUT)

http://localhost:3000/api/tasks [POST]

Body:

{
  "title": "First Task",
  "description": "Testing TurboVets challenge",
  "category": "Work",
  "status": "todo"
}


Response: created task object.


http://localhost:3000/api/tasks [GET]

No body.

Response: array of tasks:

[
  {
    "id": "task-uuid",
    "title": "First Task",
    "description": "Testing TurboVets challenge",
    "createdAt": "2025-11-12T...",
    "updatedAt": "2025-11-12T...",
    "org": { "id": "org-uuid", "name": "..." },
    "owner": { "id": "user-uuid", "email": "..." }
  }
]


http://localhost:3000/api/tasks/:id [PUT]

{
  "title": "Updated title",
  "description": "Updated description",
  "category": "Personal",
  "status": "inprogress"
}



http://localhost:3000/api/tasks/:id [DELETE]

{ "ok": true }


Audit Log (protected + role restricted)

http://localhost:3000/api/audit-log [GET]

Response: array of log entries:

[
  {
    "ts": "2025-11-12T...",
    "user": "userId:email",
    "method": "GET",
    "url": "/tasks",
    "status": "OK",
    "ms": 12,
    "msg": null
  }
]


3) Ready-made Postman collection JSON

Is JSON ko copy karo, Postman → Import → Raw text me paste kar do:

{
  "info": {
    "_postman_id": "11111111-2222-3333-4444-555555555555",
    "name": "TurboVets API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"owner@example.com\",\n  \"password\": \"Passw0rd!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          },
          "response": []
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"owner@example.com\",\n  \"password\": \"Passw0rd!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"First Task\",\n  \"description\": \"Testing TurboVets challenge\",\n  \"category\": \"Work\",\n  \"status\": \"todo\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/tasks",
              "host": ["{{baseUrl}}"],
              "path": ["tasks"]
            }
          },
          "response": []
        },
        {
          "name": "List Tasks",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "url": {
              "raw": "{{baseUrl}}/tasks",
              "host": ["{{baseUrl}}"],
              "path": ["tasks"]
            }
          },
          "response": []
        },
        {
          "name": "Update Task",
          "request": {
            "method": "PUT",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated title\",\n  \"description\": \"Updated description\",\n  \"category\": \"Personal\",\n  \"status\": \"inprogress\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/tasks/{{taskId}}",
              "host": ["{{baseUrl}}"],
              "path": ["tasks", "{{taskId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Delete Task",
          "request": {
            "method": "DELETE",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "url": {
              "raw": "{{baseUrl}}/tasks/{{taskId}}",
              "host": ["{{baseUrl}}"],
              "path": ["tasks", "{{taskId}}"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Audit Log",
      "item": [
        {
          "name": "Get Audit Log",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "url": {
              "raw": "{{baseUrl}}/audit-log",
              "host": ["{{baseUrl}}"],
              "path": ["audit-log"]
            }
          },
          "response": []
        }
      ]
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:3000" },
    { "key": "token", "value": "" },
    { "key": "taskId", "value": "" }
  ]
}
