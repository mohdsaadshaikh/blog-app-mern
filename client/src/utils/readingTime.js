export const estimateReadingTime = (text) => {
  const wordsPerMinute = 200; // Average reading speed
  const textLength = text.split(/\s+/).length; // Number of words
  const minutes = Math.ceil(textLength / wordsPerMinute);
  return minutes;
};
