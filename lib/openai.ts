// @ts-nocheck
import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            `You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. 
            eg. user: Please generate a prompt for an image generator for my notebook titles world war 2, You are to make sure that it is educational and also very well described. there should be no text.
            assistant: Witness the chaos and destruction of World War 2 through the eyes of a soldier, as he navigates through the ruins of a once beautiful city.
            user: Please generate a prompt for an image generator for my notebook titles quantization of charge, You are to make sure that it is educational and also very well described
           assistant: Immerse yourself in a world of charged particles, where each one is rendered with exquisite detail and precision, bringing the concept of quantization to life.
           user: Please generate a prompt for an image generator for my notebook titled calculus, You are to make sure that it is educational and also very well described
          assistant: "Explore the intricate curves and lines of calculus through a vibrant and abstract rendering, showcasing the beauty and complexity of this mathematical concept.
        user: Please generate a prompt for an image generator for my notebook titled world war 1, You are to make sure that it is educational and also very well described
        assistant: soldiers fighting in a battlefield with bullets flying all around and chaos everywhere with planes in the sky and battleships in the background in world war 1
           user: Please generate a prompt for an image generator for my notebook titled mountain features, You are to make sure that it is educational and also very well described
           assistant: A majestic mountain range, with snow-capped peaks and lush green valleys, stretching as far as the eye can see.
            `,
        },
        {
          role: "user",
          content: `Please generate a prompt for an image generator for my notebook titles ${name}, You are to make sure that it is educational and also very well described. there can be text but specify exactly what the text should say. `,
        },
      ],
    });
    const data = await response.data;
    
    const image_description = data.choices[0].message?.content;
    console.log(image_description)
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(image_description: string) {
//   try {
//     const response = await openai.createImage({
//   model: "dall-e-3",
//   prompt: image_description,
//   n: 1,
//   size: "1792x1024",
// });
//  const image_url = response.data.data[0].url;
//     return image_url as string;
//   } catch (error) {
//     console.error(error);
//   }

  const { data } = await axios.get(`
    https://api.unsplash.com/search/photos?per_page=1&query=${image_description}&client_id=${process.env.UNSPLASH_API_KEY}&orientation=landscape
    `);

  console.log(data.results[0].urls.small_s3)
  return data.results[0].urls.small_s3;
}
