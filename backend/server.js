require('dotenv').config();

const databaseName = 'metaVerse';

const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
// eslint-disable-next-line no-undef
mongoose.connect(process.env.DATABASE_URL + databaseName, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.databaseName = databaseName;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database ' + db.databaseName));

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const gameLotRouter = require('./routes/gameLotRoute');
const userRouter = require('./routes/usersRoute');

app.use('/gamelots', gameLotRouter);
app.use('/users', userRouter);

app.listen(port, () => {
  console.log('Server is running on port: ', port);
});
