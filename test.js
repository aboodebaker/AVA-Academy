const { S3 } = require("@aws-sdk/client-s3");
const fss = require("fs");
const fs = require('fs/promises');
// const PDFDocument = require("pdf-lib");
const axios = require("axios");
const QRCode = require("qrcode");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const { collapseTextChangeRangesAcrossMultipleVersions } = require("typescript");
const pdfjsLib = require('pdfjs-dist');

async function downloadFromS3(file_key) {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-north-1",
        credentials: {
          accessKeyId: "AKIAZPTUSDRWY6SBZ3HB",
          secretAccessKey: "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",
        },
      });
      const params = {
        Bucket: "ava-academy",
        Key: file_key,
      };

      const obj = await s3.getObject(params);
      const file_name = `/tmp/elliott${Date.now().toString()}.pdf`;

      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(file_name);
        file.on("open", function (fd) {
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(file_name);
          });
        });
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}

 async function searchYoutube(searchQuery) {
  try {
    searchQuery = encodeURIComponent(searchQuery);
    const  body =  await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=AIzaSyDWnwmOnjgQJVVH_iWQqh5sJshCrjOQTpg&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );
  console.log(body)
//   const data = await body.json()
//   console.log(data)
    // if (!data || !data.items || data.items.length === 0) {
    //   console.log("No YouTube videos found for the search query.");
    //   return null;
    // }
    // return data.items[0].id.videoId;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    throw error;
  }
}

// Function to extract table of contents from PDF
async function extractTOC(pdfData) {
  const pdfBuffer = new Uint8Array(pdfData.buffer); // Convert Buffer to Uint8Array
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise; // Pass Uint8Array to pdfjs-dist
  const toc = [];

  const outline = await pdf.getOutline();

  console.log(outline)
  if (outline) {
    for (let i = 0; i < outline.length; i++) {
      const dest = outline[i].dest;
      if (dest) {
        const pageNumber = await pdf.getPageIndex(dest) + 1;
        toc.push({ title: outline[i].title, pageNumber });
      }
    }
  }

  return toc;
}


 async function generateQRCode(text) {
  try {
    const qrCodeBuffer = await QRCode.toDataURL(text);
    return qrCodeBuffer;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

 async function embedQRAndLinksInPDF(subtopics, topics, pageNumberMap) {
  try {
    // const pdfBytes = await downloadFromS3("uploads/1706727891666document.pdf.pdf");
    const pdfData = await fs.readFile('./testdoc3.pdf');
    const pdfDoc = await PDFDocument.load(pdfData);

    const pagesno = await pdfDoc.getPageCount()
    
    for (let i = 0; i < pagesno; i++) {
      let page = await pdfDoc.getPage(i)

      let output = await strict_output(
        'You are an ai summariser. summarise the page. you are to use the exact json format required',
        `your content to summarise is: ${page} `,
        {
          summary: "your summary",
          topic:"topic of the content"
        }

      )

      console.log(output)


    }

    console.log(toc)
    // Embed QR codes and links for topics
    for (const topic of topics) {
      const topicLink = `https://ava-academy.vercel.app/topic/${topic}`;
      const pageNumber = pageNumberMap.get(topic);
      const qrCodeUrl = await generateQRCode(topicLink);
      const qrImage = await pdfDoc.embedPng(qrCodeUrl);

      const page = pdfDoc.getPage(pageNumber-1);
      const { width, height } = page.getSize();




      page.drawImage(qrImage, {
        x: width - 50,
        y: height - 100, // Adjust as needed
        width: 50,
        height: 50,
      });

      page.drawText(topic, {
        x: width- 120,
        y: height - 50, // Adjust as needed
        size: 12,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        color: rgb(0, 0, 0),
      });
    }

    // Embed QR codes and links for subtopics
    // for (const subtopic of subtopics) {
    //   const videoId = await searchYoutube(subtopic);
    //   const subtopicLink = `https://www.youtube.com/watch?v=${videoId}`;
    //   const pageNumber = pageNumberMap.get(subtopic);
    //   const qrCodeUrl = await generateQRCode(subtopicLink);
    //   const qrImage = await pdfDoc.embedPng(qrCodeUrl);

    //   const page = pdfDoc.getPage(pageNumber);
    //   const { width, height } = page.getSize();

    //   page.drawImage(qrImage, {
    //     x: 50,
    //     y: height - 150, // Adjust as needed
    //     width: 50,
    //     height: 50,
    //   });

    //   page.drawText(subtopic, {
    //     x: 120,
    //     y: height - 100, // Adjust as needed
    //     size: 12,
    //     font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    //     color: rgb(0, 0, 0),
    //   });
    // }

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    fss.writeFileSync('./edited.pdf', modifiedPdfBytes);

    // Now you can save or upload the modified PDF as needed
  } catch (error) {
    console.error("Error embedding QR codes and links in PDF:", error);
  }
}

// Usage example:
const subtopics = ["Subtopic 1", "Subtopic 2"];
const topics = ["Topic 1", "Topic 2"];
// Assuming you have a Map with topic/subtopic as key and page number as value
const pageNumberMap = new Map([
  ["Topic 1", 1],
  ["Topic 2", 3],
  ["Subtopic1", 2],
  ["Subtopic2", 4],
]);

embedQRAndLinksInPDF(subtopics, topics, pageNumberMap);


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "MxuTvCGwiGUSP47jSG0TT3BlbkFJAJ0HlwNscgNpIHuW5Uqi",
});
const openai = new OpenAIApi(configuration);



async function strict_output(
  system_prompt,
  user_prompt,
  output_format,
  default_category = "",
  output_value_only = false,
  model = "gpt-3.5-turbo",
  temperature = 1,
  num_tries = 5,
  verbose = false
) {
  // if the user input is in a list, we also process the output as a list of json
  const list_input = Array.isArray(user_prompt);
  // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
  const dynamic_elements = /<.*?>/.test(JSON.stringify(output_format));
  // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
  const list_output = /\[.*?\]/.test(JSON.stringify(output_format));

  // start off with no error message
  let error_msg = "";

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt = `\nYou are to output ${
      list_output && "an array of objects in"
    } the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    // if output_format contains dynamic elements, process it accordingly
    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    // if input is in a list format, ask it to generate json in a list
    if (list_input) {
      output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
    }

    // Use OpenAI to get a response
    const response = await openai.createChatCompletion({
      temperature: temperature,
      model: model,
      messages: [
        {
          role: "system",
          content: system_prompt + output_format_prompt + error_msg,
        },
        { role: "user", content: user_prompt.toString() },
      ],
      
    });

    let res =
      response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";

    // ensure that we don't replace away apostrophes in text
    res = res.replace(/(\w)"(\w)/g, "$1'$2");

    if (verbose) {
      console.log(
        "System prompt:",
        system_prompt + output_format_prompt + error_msg
      );
      console.log("\nUser prompt:", user_prompt);
      console.log("\nGPT response:", res);
    }

    // try-catch block to ensure output format is adhered to
    try {
      let output = JSON.parse(res);

      if (list_input) {
        if (!Array.isArray(output)) {
          throw new Error("Output format not in an array of json");
        }
      } else {
        output = [output];
      }

      // check for each element in the output_list, the format is correctly adhered to
      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          // unable to ensure accuracy of dynamic output header, so skip it
          if (/<.*?>/.test(key)) {
            continue;
          }

          // if output field missing, raise an error
          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          // check that one of the choices given for the list of words is an unknown
          if (Array.isArray(output_format[key])) {
            const choices = output_format[key];
            // ensure output is not a list
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            // output the default category (if any) if GPT is unable to identify the category
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            // if the output is a description format, get only the label
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        // if we just want the values for the outputs
        if (output_value_only) {
          output[index] = Object.values(output[index]);
          // just output without the list if there is only one element
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
      console.log("An exception occurred:", e);
      console.log("Current invalid json format ", res);
    }
  }

  return [];
}
