/* 'use strict'; */

var MYTIMEOUT = 1000;

var DEFAULT_SIZE = 5000000; // max to avoid popup in safari/ios

var isAndroid = /Android/.test(navigator.userAgent);
var isWP8 = /IEMobile/.test(navigator.userAgent); // Matches WP(7/8/8.1)
//var isWindows = /Windows NT/.test(navigator.userAgent); // Windows [NT] (8.1)
var isWindows = /Windows /.test(navigator.userAgent); // Windows (8.1)
//var isWindowsPC = /Windows NT/.test(navigator.userAgent); // Windows [NT] (8.1)
//var isWindowsPhone_8_1 = /Windows Phone 8.1/.test(navigator.userAgent); // Windows Phone 8.1
//var isIE = isWindows || isWP8 || isWindowsPhone_8_1;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isWebKit = isChrome || !isIE; // TBD [Android or iOS]
var isWebKit = !isIE; // TBD [Android or iOS]

var scenarioList = [ isAndroid ? 'Plugin-sqlite-connector' : 'Plugin', 'HTML5', 'Plugin-android.database' ];

//var scenarioCount = isAndroid ? 3 : (isIE ? 1 : 2);
//var scenarioCount = (!!window.hasWebKitBrowser) ? 2 : 1;
var hasAndroidWebKitBrowser = isAndroid && (!!window.hasWebKitBrowser);
var scenarioCount = hasAndroidWebKitBrowser ? 3 : ((!!window.hasWebKitBrowser) ? 2 : 1);

// simple tests:
var mytests = function() {
  for (var i=0; i<scenarioCount; ++i) {
    describe(scenarioList[i] + ': simple test(s)', function() {
      var scenarioName = scenarioList[i];
      var suiteName = scenarioName + ': ';
      var isWebSql = (i === 1);
      var isOldImpl = (i === 2);

      // NOTE: MUST be defined in function scope, NOT outer scope:
      var openDatabase = function(name, ignored1, ignored2, ignored3) {
        if (isOldImpl) {
          return window.sqlitePlugin.openDatabase({name: name, androidDatabaseImplementation: 2});
        }
        if (isWebSql || isChrome) {
          return window.openDatabase(name, "1.0", "Demo", DEFAULT_SIZE);
        } else {
          return window.sqlitePlugin.openDatabase(name, "1.0", "Demo", DEFAULT_SIZE);
        }
      }
      
      it(suiteName + "websql promise then test",
        function(done) {
          var db = openDatabase("ASCII-string-test.db", "1.0", "Demo", DEFAULT_SIZE);

          expect(db).toBeDefined()
          
          var dbwrap = new DB(db);
          
          dbwrap.executeSql("select upper('Some US-ASCII text') as uppertext").then(function(res) {
            expect(res.rows.item(0).uppertext).toEqual("SOME US-ASCII TEXT");
            done();
          });
        }, MYTIMEOUT);
        
    });
  }
}

if (window.hasBrowser) mytests();
else exports.defineAutoTests = mytests;