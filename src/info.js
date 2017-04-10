(function() {
'use strict';

var path = require('path'),
  fs = require('fs'),
  util = require(path.join(__dirname, 'util'));

var VERSION = require(path.join(__dirname, '..', 'package.json')).version;

var printVersion = function() {
  util.print(VERSION.info.bold);
};

var printLogo = function() {
  var logoFile = path.join(__dirname, '..', 'doc', 'logo.txt'),
    logo = fs.readFileSync(logoFile).toString();

  util.print(logo.bold.blue);
  util.print(' Command Line Interface for Monaca and Onsen UI');
  util.print(' Monaca CLI Version ' + VERSION + '\n');
};

var printUsage = function() {
  util.print('Usage: monaca command [args]\n');
};

var printDescription = function() {
  util.print('  To learn about a specific command type:\n');
  util.print('  $ monaca <command> --help\n');
  util.print('  To learn about all the command type:\n');
  util.print('  $ monaca help | monaca --help\n');
};

var printCommands = function(showAll, taskList) {
  showAll = !!showAll;
  util.print('Commands: (use --all to show all)\n');

  var taskMaxLength = 0;
  var tasks = Object.keys(taskList)
    .map(function(taskSet) {
      return Object.keys(taskList[taskSet]).map(function(taskName) {
        var task = taskList[taskSet][taskName];
        if (task.showInHelp !== false || showAll) {
          if (showAll && task.aliases) {
            taskName += ' | ' + task.aliases.join(' | ');
          }
          taskMaxLength = Math.max(taskMaxLength, taskName.length + 3);
          return [taskName, task];
        } else {
          return ['', ''];
        }
      });
    })
    .reduce(function(a, b) {
      return a.concat(b);
    })
    .filter(function(a) {
      return a.join('') !== '';
    });

  tasks
    .sort(function(a, b) {
      var a_key = a[0];
      if (a[1].order < b[1].order) return -1;
      if (a[1].order > b[1].order) return 1;
      return 0;
    })
  .forEach(function(task) {
    var cmd = task[0],
      desc = task[1].description,
      dots = new Array(Math.max(15, taskMaxLength) - cmd.length).join('.');
    util.print('  ' + cmd.bold.info + '  ' + dots.grey + '  ' + desc.bold);
  });

  util.print('');
};

var printExtendedCommands = function() {
  util.print('---------------------------------');
  util.print(('Create Monaca Project').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca create <dir-name>');
  util.print('    create a new Monaca project\n');
  util.print('  monaca reconfigure [--transpile|--dependencies|--components]');
  util.print('    generate default project configurations\n');
  util.print('---------------------------------');
  util.print(('Local Debug').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca preview | serve');
  util.print('    run a local web server for preview\n');
  util.print('  monaca debug [--port <port>|--no-open]');
  util.print('    run app on the device by using Monaca Debugger\n');
  util.print(('  * Monaca Debugger for Android/iOS are available on\n    Google Play Store / Apple App Store.\n').bold.warn);
  util.print('---------------------------------');
  util.print(('Local Build').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca transpile [--generate-config|--install-dependencies]');
  util.print('    transpile project source code.\n');
  util.print('---------------------------------');
  util.print(('Using Monaca Cloud - Setup').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca signup [-email <email>]');
  util.print('    register a new Monaca account\n');
  util.print('  monaca login [-email <email>]');
  util.print('    sign in to Monaca Cloud\n');
  util.print('  monaca logout');
  util.print('    sign out from Monaca Cloud\n');
  util.print('  monaca proxy (set <proxy-server-url>|rm)');
  util.print('    configure proxy to use when connecting to Monaca Cloud\n');
  util.print(('  * For more details, please visit: https://monaca.io\n').bold.warn);
  util.print('---------------------------------');
  util.print(('Using Monaca Cloud - Remote Build').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca remote build <platform> [--build-type <type>|--output <path>|--android_webview\n  (default|crosswalk)|--android_arch <arch>|--browser]');
  util.print('    build project on Monaca Cloud\n');
  util.print('---------------------------------');
  util.print(('Using Monaca Cloud - Sync').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca clone');
  util.print('    clone from Monaca cloud project\n');
  util.print('  monaca download [--delete|--force|--dry-run]');
  util.print('    download project from Monaca Cloud\n');
  util.print('  monaca upload [--delete|--force|--dry-run]');
  util.print('    upload project to Monaca Cloud\n');
  util.print('---------------------------------');
  util.print(('Using Monaca Cloud - Import').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca import');
  util.print('    import from Monaca cloud project\n');
  util.print('---------------------------------');
  util.print(('Aliases for Cordova commands').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca plugin');
  util.print('    manage Cordova Plugin\n');
  util.print('  monaca platform');
  util.print('    add, update and remove platforms\n');
  util.print('  monaca info');
  util.print('    show info about Cordova environment\n');
  util.print('  monaca prepare');
  util.print('    prepare project for build\n');
  util.print('  monaca compile');
  util.print('    build the project\n');
  util.print('  monaca run');
  util.print('    deploy project on a device / emulator\n');
  util.print('  monaca build');
  util.print('    shortcut for prepare, then compile\n');
  util.print('  monaca emulate');
  util.print('    run project on emulator\n');
  util.print('---------------------------------');
  util.print(('Help').bold.info);
  util.print('---------------------------------\n');
  util.print('  monaca <command> --help');
  util.print('    show help for each command\n');

};

var printExamples = function() {
  util.print('Typical Usage:\n');

  util.print('  $ monaca create myproject # Create a new project from various templates');
  util.print('  $ cd myproject');
  util.print('  $ monaca preview # Preview app on a browser');
  util.print('  $ monaca debug # Run the app in Monaca Debugger');
  util.print('  $ monaca remote build # Execute remote build for packaging');
};


var printHelp = function(showAll, taskList, extended) {
  printLogo();
  printUsage();
  if (extended) {
    printExtendedCommands();
  } else {
    printDescription();
    printCommands(showAll, taskList);
    printExamples();
  }

  util.print('');
};

module.exports = {
  version: printVersion,
  help: printHelp
};
})();
