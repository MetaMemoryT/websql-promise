function DB(dbobject) {
  this.db = dbobject;
}

DB.prototype.executeSql = function(query, args) {
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

module.exports = DB;
