// https://medium.com/@sumbul.first/generative-ai-enabled-web-app-81820cbe25d6

import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';

export async function fetchNewAffirmation(conversation) {
    showLoadingAnimation();

    try {
        const response = await client.send(new ConverseCommand({ modelId, messages: conversation }));
        const affirmation = response.output.message.content[0].text;
        // set the affirmation in HTML
        document.querySelector("#ai-output").innerHTML = affirmation;
    } catch (err) {
        console.error(err);
        document.querySelector("#ai-output").innerHTML = err;
    }
}

// Shows a loading animation while fetching a new affirmation
function showLoadingAnimation() {
    document.querySelector("#ai-output").innerHTML = '<div class="loading-spinner"></div>';
}

// Called on page load (or refresh), fetches a new affirmation
export async function init() {
    try {
        // get the user's credentials from environment variables
        const creds = await fetchCredentials();
        // instantiate the BedrockRuntimeClient
        client = await createBedrockClient(creds);

    } catch(err) {
        console.error(err);
        document.querySelector("#ai-output").innerHTML = err;
    }

    const affirmationButton = document.querySelector("#get-response");
    affirmationButton.addEventListener("click", fetchNewAffirmation);
}

let client = null;
async function createBedrockClient(creds) {
    client = await new BedrockRuntimeClient({
        credentials: creds.credentials,
        region: creds.region
    });
    return client;
}

async function fetchCredentials() {
    return {
        region: "us-east-1",
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
            sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN
        },
    };
}
