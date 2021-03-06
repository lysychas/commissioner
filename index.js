const app = require('./server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});

process.on('SIGTERM', () => {
  app.close(() => {
    console.log('Process terminated')
  })
})