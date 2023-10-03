import requests
import json

url = "http://localhost:8000/expenses/651ba343de44418eab724307/"

headers = {
        "Content-Type": "application/json",
        "x-access-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWI5Y2FhMDRlNDcwNTlmZGQ5NjJjYSIsInBob25lTnVtYmVyIjoiOTAyNjk3MTExMiIsImlhdCI6MTY5NjMwODM5NSwiZXhwIjoxNzA0OTQ4Mzk1fQ.2wBPAn447ipPajFDarzmKm5fsrTzZyEd7NjEM5doO_8"
    }
response = requests.delete(url, headers=headers)
import pdb
pdb.set_trace()
