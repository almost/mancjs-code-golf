var game = require('../game/game');
var express = require('express');
const challengeLibrary = require('../game/challenge-library');

var auth = express.basicAuth(function(user, pass) {
  return user === 'admin' && pass === 'bob';
});

var routes = function(app) {
  app.get('/admin', auth, function(req, res) {
    const challenges = challengeLibrary.getChallenges();

    var gameData = JSON.stringify(game.get(), undefined, 2);

    return res.render('admin', {
      game: game.get(),
      gameData,
      challenges
    });
  });

  app.post('/start', auth, function(req, res) {
    var data = {
      title: req.param('title'),
      description: req.param('description'),
      input: req.param('input'),
      output: req.param('output')
    };

    game.start(data);
    return res.redirect('/admin');
  });

  app.get('/stop', auth, function(req, res) {
    game.stop();
    return res.redirect('/admin');
  });

  app.get('/challenge', auth, (req, res) => {
    const key = req.param('key');

    const challenge = challengeLibrary.getChallenge(key);

    return res.json(challenge);
  });
};

module.exports = routes;
