import requests

# NOTE: you must manually set API_KEY below using information retrieved from your IBM Cloud account (https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/ml-authentication.html)
API_KEY = "Hzu1CSJ3TsdMWxbysnvnMbRHF4UVZtQfQUjZu5BOQz6y"
token_response = requests.post('https://iam.cloud.ibm.com/identity/token', data={"apikey":API_KEY, "grant_type": 'urn:ibm:params:oauth:grant-type:apikey'})
mltoken = token_response.json()["access_token"]

header = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + mltoken}

# NOTE: manually define and pass the array(s) of values to be scored in the next line
payload_scoring = {"input_data": [{"fields": ["Age","Gender","Previous_Test_Scores","Current_GPA","Study_Hours_per_Day","Extracurricular_Participation"], "values": [[14,"Female",85,3.8,2,"Yes"]]}]}

response_scoring = requests.post('https://us-south.ml.cloud.ibm.com/ml/v4/deployments/b1c92f02-e7d1-4d9d-ba9b-29894540a322/predictions?version=2021-05-01', json=payload_scoring,
 headers={'Authorization': 'Bearer ' + mltoken})
print("Scoring response")
predicted_value = response_scoring.json()['predictions'][0]['values'][0][0]
print(predicted_value)