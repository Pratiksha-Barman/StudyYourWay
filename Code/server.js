import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const API_KEY = 'Hzu1CSJ3TsdMWxbysnvnMbRHF4UVZtQfQUjZu5BOQz6y';

app.use(cors());

// Function to fetch IBM IAM token
async function getToken() {
  try {
    const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IBM IAM token:', error);
    throw error;
  }
}

// Route to get token
app.get('/get-token', async (req, res) => {
  try {
    const tokenResponse = await getToken();
    res.json(tokenResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to make ML predictions
app.post('/ml-predictions', async (req, res) => {
  const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/b1c92f02-e7d1-4d9d-ba9b-29894540a322/predictions?version=2021-05-01";
  console.log("Request Body:", JSON.stringify(req.body));

  try {
    const tokenResponse = await getToken();
    const token = tokenResponse.access_token;
    console.log("Token:",token)

    const response = await fetch(scoring_url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    console.log('Data received from predictions API:', data);
    const predictedValue = data.predictions[0].values[0][0]; // Extract predicted value
    res.json(predictedValue); // Send predicted value back to client
  } catch (error) {
    console.error('Error making ML predictions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
