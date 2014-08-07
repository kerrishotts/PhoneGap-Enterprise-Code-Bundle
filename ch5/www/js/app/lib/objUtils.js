define ( function () {
  var ObjUtils = {
    merge:       function merge()
    {
      var o = {};
      var prop;
      var args = Array.prototype.slice.call(arguments, 0);
      args.forEach(function (arr)
                   {
                     for (prop in arr)
                     {
                       if (arr.hasOwnProperty(prop))
                       {
                         o[prop] = arr[prop];
                       }
                     }
                   });
      return o;
    },
    forEach:     function forEach(o, fn)
    {
      if (typeof o === "object")
      {
        if (typeof o.forEach !== "undefined")
        {
          o.forEach(fn);
          return;
        }
      }
      if (typeof o !== "object")
      {
        return;
      }
      if (typeof fn !== "function")
      {
        return;
      }
      for (var prop in o)
      {
        if (o.hasOwnProperty(prop))
        {
          fn(o[prop], prop, o); // mimic value, idx, array on Array forEach
        }
      }
    },
    interpolate: function interpolate(str, context)
    {
      var newStr = str;
      if (typeof context === "undefined")
      {
        return newStr;
      }
      ObjUtils.forEach(context, function (v, prop)
      {
        newStr = newStr.replace("{" + prop + "}", v);
      });
      return newStr;
    }
  };

  return ObjUtils;
});