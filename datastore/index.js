const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id.concat('.txt')), text, (err) => {
        if ( err ) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('reached error');
      callback(err);
    } else {
      var data = _.map(files, (file) => {
        var index = file.indexOf('.txt');
        file = file.slice(0, index);
        return {id: file, text: file};
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var dir = path.join(exports.dataDir, id.concat('.txt'));
  fs.readFile(dir, (err, fileData) => {
    if ( err ) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  var dir = path.join(exports.dataDir, id.concat('.txt'));
  fs.readFile(dir, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(dir, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var dir = path.join(exports.dataDir, id.concat('.txt'));
  fs.unlink(dir, (err) => {
    if ( err ) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
