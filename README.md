# Agent Voice Response - Deepgram Text-to-Speech Integration

This project demonstrates the integration of **Agent Voice Response** with **Deepgram Text-to-Speech (TTS)**. The application sets up an Express.js server that accepts a text string from a client via HTTP POST requests, converts the text into speech using Deepgram TTS, and streams the audio back to the client in real-time.

## Prerequisites

To run this project, you will need:

1. **Node.js** and **npm** installed.
2. A **Deepgram account** with the **Text-to-Speech API** enabled.
3. An **API Key** from Deepgram with the necessary permissions for Text-to-Speech API.

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/agentvoiceresponse/avr-tts-deepgram
cd avr-tts-deepgram
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Deepgram Credentials

Set the environment variable to use your Deepgram API key in your Node.js application:

```bash
export DEEPGRAM_API_KEY="your_deepgram_api_key"
```

Alternatively, use a `.env` file to load environment variables:

```bash
DEEPGRAM_API_KEY="your_deepgram_api_key"
DEEPGRAM_TTS_MODEL=aura-asteria-en
PORT=6011
```

### 4. Configure Environment Variables

Make sure you have the following environment variables set in a `.env` file for flexible configuration:

```bash
DEEPGRAM_API_KEY="your_deepgram_api_key"
DEEPGRAM_TTS_MODEL=aura-asteria-en
PORT=6011
```

You can modify the model based on your requirements.

For more information on the available models, refer to this [link](https://developers.deepgram.com/docs/tts-models).

## How It Works

The application accepts a text input from the client via an HTTP POST request to the `/text-to-speech-stream` route, converts the text into speech using **Deepgram Text-to-Speech**, and streams the resulting audio back in `LINEAR16` encoding, suitable for integration with **Asterisk Audio Socket**.

### Key Components

- **Express.js Server**: Handles incoming HTTP POST requests with the text body and streams the audio back to the client.
- **Deepgram Text-to-Speech Client**: Converts text into speech using the TTS API.
- **Audio Streaming**: The audio data is streamed back to the client in chunks for real-time playback.

### Example Code Overview

- **Deepgram TTS Request Configuration**: Set up voice settings like language, gender, and audio encoding.
- **Audio Streaming**: The application splits the audio content into chunks and streams it back to the client using the `res.write()` method.

## Running the Application

To start the application:

```bash
node index.js
```

The server will start and listen on the port defined in the environment variable or default to `6011`.

### Sending a Text Request

You can use `curl` to send a POST request to the server with a JSON body containing a `text` field:

```bash
curl -X POST http://localhost:6011/text-to-speech-stream \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello, welcome to Agent Voice Response!"}' --output response.wav
```

The audio response will be saved in `response.wav` in the specified format.