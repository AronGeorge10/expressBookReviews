const axios = require('axios');

async function getBooks() {
  try {
    const response = await axios.get(
      'https://arongeorgeja-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'
    );
    console.log("List of Books:", response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

getBooks();
