define ( function () {
  var objUtils = {
    merge: function () {
      var o = {};
      var prop;
      var args = Array.prototype.slice.call(arguments, 0);
      args.forEach ( function (arr) {
        for ( prop in arr ) {
          if (arr.hasOwnProperty(prop)) {
            o[prop] = arr[prop];
          }
        }
      });
      return o;
    }
  };

  return objUtils;
});