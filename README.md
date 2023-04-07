# sls-ms-docx-to-pdf

This is a very interesting projetct!

Here we get some docx from S3 inside AWS and transform it in a PDF and save it back in S3.

# How it works?

We have two Serverless Framework projects. One of them receives the DOCX file and saves it in the S3, the other (which we call him inside the first one) grabs a S3 DOCX file and converts it into a PDF file using some libraries.

### Why we need two projects ??

Good question! When we are generating a PDF with the library Puppeteer it uses internaly a thing called Chromium (the OSS one they use to make Google Chrome) and this thing when it comes to generate a PDF it needs some features from the operational system. From the scracht the Lambda SO do not have this features inside its operational system. To solve this problem we use a thing called Lambda Layers, which add A LOT of space inside our lambda. That's why two projects, so that the size of the one with the layer doesn't limit the size of the other project.

## Important 

Always when you are dealing with PDFs and stuff like that <strong>The environment matters!</strong>

This is why I needed to add a layer to the lambda that generates de PDF.
Any doubts, open a issue in this project, Or send me a message in my linkedin
