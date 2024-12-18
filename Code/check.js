const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// NOTE: you must manually enter your API_KEY below using information retrieved from your IBM Cloud account (https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/ml-authentication.html)
const API_KEY = "Hzu1CSJ3TsdMWxbysnvnMbRHF4UVZtQfQUjZu5BOQz6y";

function getToken(errorCallback, loadCallback) {
	const req = new XMLHttpRequest();
	req.addEventListener("load", loadCallback);
	req.addEventListener("error", errorCallback);
	req.open("POST", "https://iam.cloud.ibm.com/identity/token");
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("Accept", "application/json");
	req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", loadCallback);
	oReq.addEventListener("error", errorCallback);
	oReq.open("POST", scoring_url);
	oReq.setRequestHeader("Accept", "application/json");
	oReq.setRequestHeader("Authorization", "Bearer " + token);
	oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	oReq.send(payload);
}

getToken((err) => console.log(err), function () {
	let tokenResponse;
	try {
		tokenResponse = JSON.parse(this.responseText);
        console.log("Token:",tokenResponse.access_token)
	} catch(ex) {
		// TODO: handle parsing exception
	}
	// NOTE: manually define and pass the array(s) of values to be scored in the next line
	const payload = '{"input_data": [{"fields": ["Age","Gender","Previous_Test_Scores","Current_GPA","Study_Hours_per_Day","Extracurricular_Participation"], "values": [[14,"Female",85,3.8,2,"Yes"]]}]}'
	;
	const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/b1c92f02-e7d1-4d9d-ba9b-29894540a322/predictions?version=2021-05-01";
	apiPost(scoring_url, tokenResponse.access_token, payload, function (resp) {
		let parsedPostResponse;
		try {
			parsedPostResponse = JSON.parse(this.responseText);
			console.log("Scoring response:", parsedPostResponse);

			// Extracting the predicted values
			const predictions = parsedPostResponse.predictions[0];
			const predictedValue = predictions.values;
			console.log("Predicted Value:", predictedValue[0][0]);
		} catch (ex) {
			// TODO: handle parsing exception
		}
	}, function (error) {
		console.log(error);
	});
});