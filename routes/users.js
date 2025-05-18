var express = require('express');
var router = express.Router();
const axios = require("axios");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const classifierFolder = path.join(__dirname, '../classifiers');

if (!fs.existsSync(classifierFolder)) {
  fs.mkdirSync(classifierFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, classifierFolder); 
  },
  filename: (req, file, cb) => {
      cb(null, 'peta_pdf.pdf'); 
  }
});

const upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
  res.render("user/chat_bot")
  return
});

router.post('/get_question', async function(req, res, next) {
  try {
    const text = req.body.question;
    const response = await axios.post("http://127.0.0.1:8000/ask_question", 
      { question: text },  
      { headers: { "Content-Type": "application/json" } }
    );    
    const data = response.data;
    let answer = data.response;

    const sourcesMatch = answer.match(/Sources: Pages ([\d, ]+)/);

    const sources = sourcesMatch ? sourcesMatch[1] : 'N/A';

    answer = answer.replace(/Sources: Pages [\d, ]+/, "").trim();

    // console.log("RESPONSE : ",answer)
    // console.log("SOURCE : ",sources)

    res.json({
      answer: answer,
      sources: sources
    });
  } catch (error) {
      console.error("Error: ", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/extract_pdf', function(req, res, next) {
  res.render("user/extract_pdf")
  return
});

router.post('/upload_pdf', upload.single('pdfFile'), async (req, res) => {
  try {
      const contextTopic = req.body.contextTopic.trim();
      const pdfPresent = req.file ? true : false;

      if (!contextTopic || contextTopic === "") {
          return res.status(400).send("Enter a valid context topic.");
      }

      console.log("CONTEXT:", contextTopic);

      const fitResponse = await axios.post("http://127.0.0.1:8000/fit_content", {
          contextTopic,
          pdfPresent
      });

      console.log("FIT RESPONSE:", fitResponse.data);

      if (fitResponse.status === 200) {
        console.log("YES, IT'S A SUCCESS")
        res.json({ success: true, redirectUrl: "/" });
      } else {
          res.status(500).json({ error: "Error processing content" });
      }
  } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
