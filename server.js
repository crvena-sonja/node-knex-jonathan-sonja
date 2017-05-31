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

app.get('/restaurants/7', (req, res) => {

  knex('restaurants')
    .where('cuisine', 'Italian')
    .whereIn('address_zipcode', ['10012','10013, 10014'])
    .then(results => res.json(results));
});

app.get('/restaurants/8', (req, res) => {

  knex('restaurants').insert([{name: 'Byte Cafe',
    borough: 'Brooklyn',
    cuisine: 'coffee',
    address_building_number: '123',
    address_street: 'Atlantic Avenue',
    address_zipcode: '11231'}])
    .then(results => res.json(results));
});

app.get('/restaurants/9', (req, res) => {

  knex('restaurants').insert([{name: 'Food Place',
    borough: 'Brooklyn',
    cuisine: 'pizza',
    address_building_number: '456',
    address_street: 'Pacific Avenue',
    address_zipcode: '11001'}])
    .returning(['id','name'])
    .then(results => res.json(results));
});

app.get('/restaurants/10', (req, res) => {

  knex('restaurants').insert([{name: 'Food Place 2',
    borough: 'Brooklyn',
    cuisine: 'Burgers',
    address_building_number: '987',
    address_street: 'Atlantic Avenue',
    address_zipcode: '11231'},
  {name: 'Food Place 3',
    borough: 'Brooklyn',
    cuisine: 'Thai',
    address_building_number: '345',
    address_street: 'Atlantic Avenue',
    address_zipcode: '11231'},
  {name: 'Food Place 4',
    borough: 'Brooklyn',
    cuisine: 'steak',
    address_building_number: '236',
    address_street: 'Atlantic Avenue',
    address_zipcode: '11231'}], ['id','name'])
    .then(results => res.json(results));
});

app.get('/restaurants/11', (req, res) => {

  knex('restaurants')
  .where('nyc_restaurant_id', '30191841')
  .update({
    name: 'DJ Reynolds Pub and Restaurant3425'
  })
  .then(results => res.json(results));
});

app.get('/restaurants/12', (req, res) => {

  knex('grades')
  .where('id', '10')
  .del()
  .then(results => res.json(results));
});

app.get('/restaurants/13', (req, res) => {

  knex('restaurants')
  .where('id', '22')
  .del()
  .then(results => res.json(results))
  .catch(function(error) {
    console.error(error);
  });
});

app.get('/restaurants/14', (req, res) => {

  knex('grades')
  .where('id', '10')
  .del()
  .then(results => res.json(results));
});

app.listen(PORT);
