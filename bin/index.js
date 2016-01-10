var program = require('commander');

var pkg = require('../package.json');

program.version(pkg.version)
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('--entry [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);
