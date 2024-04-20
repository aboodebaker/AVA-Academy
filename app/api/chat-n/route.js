import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

 
// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
export async function POST(req) {
  // Extract the `messages` from the body of the request


  const { messages } = await req.json()
  console.log(process.env)
 
  // const response = await fetch(`${process.env.BASE_URL}/api/chat-n/check`, {method: 'POST', body: {anything: 'anything'}})
  // const responseJson = await response.json()
  // console.log(responseJson)
  // if (responseJson.sucess == true) {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-1106',
    stream: true,
    messages
  })
  
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
  //   } else {
  //   return new NextResponse('You have reached your message limit', { status: 200 });
  // }
}
