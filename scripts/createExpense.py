import requests
import json

url = "http://localhost:8000/expenses/"

expenseData={
  "payer":"651b9caa04e47059fdd962ca", #User1
  "totalAmount":1200,
  "title":"First expense b/w User1(payer) -> User2",
  "desc":"This is the desc of the first expense",
  "participants":[
    {
      "user":"651b9cab04e47059fdd962ce", #User2
      "share":500,
      "isPayer":False,
    },
    {
      "user":"651b9caa04e47059fdd962ca", #User1- Payer
      "share":700,
      "isPayer":True,
    },
  ]
}
headers = {
        "Content-Type": "application/json",
        "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWI5Y2FhMDRlNDcwNTlmZGQ5NjJjYSIsInBob25lTnVtYmVyIjoiOTAyNjk3MTExMiIsImlhdCI6MTY5NjMwODM5NSwiZXhwIjoxNzA0OTQ4Mzk1fQ.2wBPAn447ipPajFDarzmKm5fsrTzZyEd7NjEM5doO_8"
    }
response = requests.post(url, headers=headers, data=json.dumps(expenseData))
import pdb
pdb.set_trace()
