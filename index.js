/**
 * index.js
 * This file is the main entrypoint for the application.
 * @see https://www.gcareri.com
 */
const express = require('express');
const { createClient } = require('@deepgram/sdk');

require('dotenv').config();

const app = express();

// Create a Deepgram client with your API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const config = {
  model: process.env.DEEPGRAM_TTS_MODEL || "aura-asteria-en", // [modelname]-[voicename]-[language]-[version]
  encoding: "linear16",
  container: "none", // When using VoIP (Voice over Internet Protocol), we recommend adding container=none to your request to prevent request header information being misinterpreted as audio, which can result in static or click sounds.
  sample_rate: 8000
};
console.log("Deepgram Speech Configuration Loaded", config);

app.use(express.json());

/**
 * Handle incoming HTTP POST request with JSON body containing a text string,
 * and streams the text-to-speech audio response back to the client.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
const handleTextToSpeech = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  res.setHeader('Content-Type', 'audio/l16');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Make a request and configure the request with options (such as model choice, audio configuration, etc.)
    const response = await deepgram.speak.request(
      { text },
      config
    );

    // Get the audio stream and headers from the response
    const stream = await response.getStream();

    if (stream) {
      const reader = stream.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
      }

      const dataArray = chunks.reduce(
        (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
        new Uint8Array(0)
      );

      for (let i = 0; i < dataArray.length; i += 320) {
        const chunk = dataArray.slice(i, i + 320);
        res.write(chunk);
      }

      res.end();
    } else {
      res.status(500).json({ message: 'Error receiving audio stream' });
    }
  } catch (error) {
    console.error('Error calling Deepgram TTS API:', error.message);
    res.status(500).json({ message: 'Error communicating with Deepgram TTS' });
  }
}

app.post('/text-to-speech-stream', handleTextToSpeech);

const port = process.env.PORT || 6011;
app.listen(port, () => {
  console.log(`Deepgram Text to Speech listening on port ${port}`);
});