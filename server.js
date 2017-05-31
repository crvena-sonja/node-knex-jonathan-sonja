'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Treeize   = require('treeize');
const tree  = new Treeize();

const { DATABASE, PORT } = require('./config');

const knex = require('knex')(DATABASE);

const app = express();
app.use(bodyParser.json());

app.get('/restaurants/d1', (req, res) => {

  knex.select('*')
    .from('restaurants')
    .then(results => res.json(results));
});

app.get('/restaurants/d2', (req, res) => {

  knex('restaurants')
    .where('cuisine', 'Italian')
    .then(results => res.json(results));
});

app.get('/restaurants/d3', (req, res) => {

  knex.select('id', 'name', 'cuisine', 'borough')
    .select(knex.raw('CONCAT(address_building_number, \' \', address_street, \' \', address_zipcode ) as address'))
    .from('restaurants')
    .limit(10)
    .then(results => res.json(results));
});

app.get('/restaurants/d4', (req, res) => {

  knex('restaurants').count('id')
    .where('cuisine', 'Thai')
    .then(results => res.json(results));
});

app.get('/restaurants/d5', (req, res) => {

  knex('restaurants').count('id')
    .then(results => res.json(results));
});

app.get('/restaurants/d6', (req, res) => {

  knex('restaurants').count('id')
    .where({
      cuisine: 'Thai',
      address_zipcode: '11372'})
    .then(results => res.json(results));
});

app.get('/restaurants/d7', (req, res) => {

  knex('restaurants')
    .where('cuisine', 'Italian')
    .whereIn('address_zipcode', ['10012','10013, 10014'])
    .then(results => res.json(results));
});

app.get('/restaurants/d8', (req, res) => {

  knex('restaurants').insert([{name: 'Byte Cafe',
    borough: 'Brooklyn',
    cuisine: 'coffee',
    address_building_number: '123',
    address_street: 'Atlantic Avenue',
    address_zipcode: '11231'}])
    .then(results => res.json(results));
});

app.get('/restaurants/d9', (req, res) => {

  knex('restaurants').insert([{name: 'Food Place',
    borough: 'Brooklyn',
    cuisine: 'pizza',
    address_building_number: '456',
    address_street: 'Pacific Avenue',
    address_zipcode: '11001'}])
    .returning(['id','name'])
    .then(results => res.json(results));
});

app.get('/restaurants/d10', (req, res) => {

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

app.get('/restaurants/d11', (req, res) => {

  knex('restaurants')
  .where('nyc_restaurant_id', '30191841')
  .update({
    name: 'DJ Reynolds Pub and Restaurant3425'
  })
  .then(results => res.json(results));
});

app.get('/restaurants/d12', (req, res) => {

  knex('grades')
  .where('id', '10')
  .del()
  .then(results => res.json(results));
});

app.get('/restaurants/d13', (req, res) => {

  knex('restaurants')
  .where('id', '22')
  .del()
  .then(results => res.json(results))
  .catch(function(error) {
    console.error(error);
  });
});

app.get('/restaurants/d14', (req, res) => {

  knex('grades')
  .where('id', '10')
  .del()
  .then(results => res.json(results));
});

// app.get('/restaurants/:id', (req, res) => {
//   knex.first('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id', 'grade', 'date as inspectionDate', 'score')
//     .select(knex.raw("CONCAT(address_building_number, ' ', address_street , ' ', address_zipcode ) as address)")
//     .from('restaurants')
//     .where('restaurants.id', req.params.id)
//     .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
//     .orderBy('date', 'desc')
//     .then(results => res.json(results)));
// });

function hydrate(array){
  let someObject = {};
  array.forEach(row => {
    if (!(row.id in someObject))
    {
      someObject[row.id] = {
        name: row.name,
        cuisine: row.cuisine,
        borough: row.borough,
        grades: []
      };
    }
    else{
      someObject[row.id].grades.push({
        id: row.gradeId,
        grade: row.grade,
        score: row.score
      });
    }
  });
  return someObject;
}

function dehydrate(obj) {
  const arr = [];
  Object.keys(obj).forEach(key => {
    for(let i=0; i < obj[key].grades.length; i++){
      arr.push({
        name: obj[key].name,
        cuisine: obj[key].cuisine,
        borough: obj[key].borough,
        gradeId: obj[key].grades[i].id,
        grade: obj[key].grades[i].grade,
        score: obj[key].grades[i].score
      });
    }
  });
  return arr;
}
app.get('/restaurants/hydrate', (req, res) => {
  knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
    .from('restaurants')
    .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
    .orderBy('id', 'asc')
    .limit(10)
    .then(results => res.json((hydrate(results))));
});

app.get('/restaurants/treeize', (req, res) => {
  //const sig = ['id', 'name', 'cuisine', 'borough', 'grades:id', 'grades:grade', 'grades:score'];
  knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as grades:id', 'grade as grades:grade', 'score as grades:score')
    .from('restaurants')
    .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
    .orderBy('id', 'asc')
    .limit(10)
    .then(results => { res.json(tree.grow(results).getData());  });
});


app.get('/restaurants/dehydrate', (req, res) => {
  knex.select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
    .from('restaurants')
    .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
    .orderBy('id', 'asc')
    .limit(10)
    .then(results => res.json(dehydrate(hydrate(results))));
});


// {name: 'Food Place 2',
//     borough: 'Brooklyn',
//     cuisine: 'Burgers',
//     address_building_number: '987',
//     address_street: 'Atlantic Avenue',
//     address_zipcode: '11231'},

app.post('/restaurants/', (req, res) => {
  const obj = req.body;
  knex('restaurants').insert({
    name: obj['name'],
    borough: obj['borough'],
    cuisine: obj['cuisine'] 
  }).returning('id')
  .then(result => {
    console.log('am i here??? ', result);
    const grades = [];
    for( let i = 0; i < obj['grades'].length; i++){
      let grade = {restaurant_id: result[0], date: new Date()};
      Object.assign(grade, obj['grades'][i]);
      grades.push(grade);
    }
    return grades;
  }).then(results => {
    console.log('where are you.....' + JSON.stringify(results, null, 2));
    return knex('grades').insert(results);
  }).then(results => res.status(200).json(results))
  .catch(function(error){
    console.error(error);
  });
});



app.listen(PORT);
