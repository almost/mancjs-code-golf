var fs = require('fs');
var vm = require('vm');
var _ = require('underscore');
var babel = require('babel-core');
var jsmin = require('jsmin').jsmin;

var global = {};

var formatTypeAndValue = function(value, actual) {
  var getType = function(value) {
    if (_.isArray(value)) return 'array';
    return typeof value;
  };

  var type = getType(value);

  if (type === 'undefined') return 'undefined';
  if (type === 'function') return 'function';
  if (type === 'array') return (actual ? 'different ' : '') + 'array of ' + value.length + ' items';
  if (type === 'string') return (actual ? 'different ' : '') + 'string of ' + value.length + ' chars';

  var digits = value.toString().replace(/[^0-9]/g, '').length;
  return digits + ' digit number';
};

process.on('message', function(entry) {
  var error = function(expected, actual) {
    var expectedError = formatTypeAndValue(expected, false);
    var actualError = formatTypeAndValue(actual, true);

    return process.send({
      valid: false,
      err: 'expected ' + expectedError + ', got ' + actualError
    });
  };

  try {
    var script = fs.readFileSync(entry.file, 'utf8');
    console.log(script);
    try {
      script = babel.transform(script, {presets: ["es2015"]}).code;
      console.log(script);
    } catch (e) {
      process.send({ valid: false, err: 'Babel transform failed, try it on https://babeljs.io/repl/ (es2015 preset)' });
      return;
    }
    script = 'Array.prototype.sort = function() { throw true; }; ' + script;
    console.log(script);
    vm.runInNewContext(script, global);
    console.log('done');

    if (!global.play) {
      console.log('no global play');
      return process.send({ valid: false, err: 'No global play function defined' });
    }

    console.log('input', entry.input);
    var inputs = entry.input.split('$').map(function (x) {return eval('(' + x + ')')});
    var actualOutput = global.play.apply(null, inputs);

    var expectedOutput = eval('(' + entry.output + ')');
    if (expectedOutput === 'quine') {
      // expectedOutput = jsmin(fs.readFileSync(entry.file, 'utf8')).replace(/^\n+/, '');
      // actualOutput = jsmin(actualOutput).replace(/^\n+/, '');

      expectedOutput = fs.readFileSync(entry.file, 'utf8').trim();
      actualOutput = actualOutput.trim();
    }
    console.log('actual', actualOutput);
    console.log('expected', expectedOutput);

    if (!_.isEqual(actualOutput, expectedOutput)) {
      return error(expectedOutput, actualOutput);
    }

    process.send({ valid: true });
  } catch (err) {
    console.log('ERROR FROM SCRIPT', err);
    process.send({ valid: false, err: 'Your script is broken' });
  }
});
