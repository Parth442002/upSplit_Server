import requests
import json

url = "http://localhost:8000/auth/register/"

# Define a list of user data with different usernames and phone numbers but the same password
user_data = [
    {"username": "User1", "phoneNumber": "9026971112", "password": "Parth"},
    {"username": "User2", "phoneNumber": "9026971113", "password": "Parth"},
    {"username": "User3", "phoneNumber": "9026971114", "password": "Parth"},
    {"username": "User4", "phoneNumber": "9026971115", "password": "Parth"},
    {"username": "User5", "phoneNumber": "9026971116", "password": "Parth"},
    {"username": "User6", "phoneNumber": "9026971117", "password": "Parth"},
    {"username": "User7", "phoneNumber": "9026971118", "password": "Parth"},
    {"username": "User8", "phoneNumber": "9026971119", "password": "Parth"},
    {"username": "User9", "phoneNumber": "9026971120", "password": "Parth"},
    {"username": "User10", "phoneNumber": "9026971121", "password": "Parth"}
]

user_responses = []

for user_info in user_data:
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, data=json.dumps(user_info))

    if response.status_code == 201:
        output_string=response.content
        my_json = output_string.decode('utf8').replace("'", '"')
        user_responses.append(json.loads(my_json))
        print(f"User '{user_info['username']}' created successfully")
    else:
        print(f"Failed to create user '{user_info['username']}' with status code: {response.status_code}")
        print(response.text)

# Save user_responses to a JSON file
with open("user_responses.json", "w") as json_file:
    json.dump(user_responses, json_file, indent=4)

print("User responses saved to 'user_responses.json'")
