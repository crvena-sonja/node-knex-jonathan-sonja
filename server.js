const express = require('express');
const bodyParser = require('body-parser');

const { DATABASE, PORT } = require('./config');

const knex = require('knex')(DATABASE);

const app = express();
app.use(bodyParser.json());

app.get('/restaurants/1', (req, res) => {

  knex.select('*')
    .from('restaurants')
    .then(results => res.json(results));
});

app.get('/restaurants/2', (req, res) => {

  knex('restaurants')
    .where('cuisine', 'Italian')
    .then(results => res.json(results));
});

app.get('/restaurants/3', (req, res) => {

  knex.select('id', 'name', 'cuisine', 'borough')
    .from('restaurants')
    .limit(10)
    .then(results => res.json(results));
});

app.get('/restaurants/4', (req, res) => {

  knex('restaurants').count('id')
    .where('cuisine', 'Thai')
    .then(results => res.json(results));
});

app.get('/restaurants/5', (req, res) => {

  knex('restaurants').count('id')
    .then(results => res.json(results));
});

app.get('/restaurants/6', (req, res) => {

  knex('restaurants').count('id')
    .where({
      cuisine: 'Thai',
      address_zipcode: '11372'})
    .then(results => res.json(results));
});


app.listen(PORT);
