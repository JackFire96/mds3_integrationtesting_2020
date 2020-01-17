const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should()
const expect = chai.expect

chai.use(chaiHttp)

// ---> DEBUT
/**
  * Génération des nouvelles couleurs et enregistrement de ces
  * couleurs dans un tableau.
  */
const newValues = []
const colorKey = 'NEW_COLOR_'
let nextCursor = 0;
const payloadColor = () => {
  const nextColor = `${colorKey}${nextCursor}`
  newValues.push(nextColor)
  nextCursor++;
  return { 'color': nextColor }
}
const getCurrentCulor = () => {
  return nextCursor > 0 ? `${colorKey}${nextCursor - 1}` : `${colorKey}O`
}
// <-- FIN

it('it should return all colors', () => {
  return chai.request(app)
    .get('/colors')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body.results).to.be.an('array');
    })
});
//incorrect path
it('it should return 404 not found', () => {
  return chai.request(app)
    .get('/colorsz')
    .catch((err) => {
      expect(err).to.have.status(404);
    });
})

//add color
it('it should ad a new color', () => {
  return chai.request(app)
    .post('/colors')
    .send(payloadColor('purple'))
    .then((res) => {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body.results).to.be.an('array').to.include(getCurrentCulor());
    })
});

it('it should return all colors + new', () => {
  return chai.request(app)
    .get('/colors')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.an('object');
      expect(res.body.results).to.be.an('array').to.include(getCurrentCulor());
    })
});