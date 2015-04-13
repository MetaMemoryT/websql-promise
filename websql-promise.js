function DB(options, openDatabaseFunction) {
  var dbf = openDatabaseFunction ? openDatabaseFunction : openDatabase;
  // TODO if options is a string:
  // this.db = dbf(name, '1.0', 'Websql Promise', 5 * 1024 * 1024);
  this.db = dbf(options);
}

DB.prototype.executeSQL = function(query, args) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.db.transaction(function(t) {
      t.executeSql(query, args,
        function(t, r) {
          resolve(r);
        },
        function(e) {
          console.log(e);
          reject(e);
        });
    });
  });
};


DB.prototype.sqlIterator = function(rows) {
  return new SQLIterator(rows);
};

function SQLIterator(rows) {
  this.rows = rows;
}

SQLIterator.prototype[Symbol.iterator] = function*() {
  for (var i = 0, l = this.rows.length; i < l; i++) {
    yield this.rows.item(i);
  }
};



/*
DB.prototype.sqlIterator = function(rows) {
  var nextIndex = 0;

  return {
    next: function() {
      return nextIndex < rows.length ? {
        value: rows.item(nextIndex++),
        done: false
      } : {
        done: true
      };
    }
  };
};
*/