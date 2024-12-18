response_scoring = {
    'predictions': [
        {
            'fields': ['prediction', 'probability'],
            'values': [
                [1.0, [0.012439906597137451, 0.9875600934028625]]
            ]
        }
    ]
}

predicted_value = response_scoring['predictions'][0]['values'][0][0]
print(predicted_value)
