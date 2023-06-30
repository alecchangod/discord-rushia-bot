const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTwitterPosts(userId) {
  try {
    const response = await axios.get(`https://twitter.com/i/user/${userId}`, { maxRedirects: 69 });
    const $ = cheerio.load(response.data);

    const posts = [];

    $('.tweet').each((index, element) => {
      const tweetId = $(element).attr('data-tweet-id');
      const postText = $(element).find('.tweet-text').text().trim();
      console.log(tweetId, postText);

      posts.push({ id: tweetId, text: postText });
    });

    return posts;
  } catch (error) {
    console.error('Error occurred while scraping Twitter:', error);
    return [];
  }
}

// Usage example
const userId = '1450728242831249408'; // Replace with the desired user ID
scrapeTwitterPosts(userId)
  .then(posts => {
    console.log('Twitter Posts:', posts);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });