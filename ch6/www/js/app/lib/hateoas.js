define ( [ "app/lib/objUtils" ], function ( ObjUtils ) {
  function storeResponseToContext ( r, context ) {
    var selfStore;
    if (typeof r !== "undefined" ) {
      if (typeof r._links !== "undefined" ) {
        if (typeof r._links.self !== "undefined" ) {
          if (typeof r._links.self.store !== "undefined" ) {
            selfStore = r._links.self.store;
          }
        }
      }
    }
    if (selfStore === undefined) { return; }
    ObjUtils.forEach ( selfStore, function ( v, prop ) {
      v.forEach ( function ( item ) {
        context[item.name] = r[item.key];
      });
    });
  }

  function crossWalk ( o, usingTemplate ) {
    var newO = {};
    ObjUtils.forEach ( usingTemplate, function ( v, prop ) {
      newO[v.key] = o[prop];
    });
    return newO;
  }


  function buildHeadersAttachment ( headers, context ) {
    var returnHeaders = [];
    if (typeof headers === "undefined") { return returnHeaders; }
    headers.forEach ( function ( header ) {
      if (typeof header.templated === "undefined" ||
          !header.templated)
      {
        returnHeaders.push({ headerName:  header.key,
                             headerValue: header.value });
      } else
      {
        returnHeaders.push({ headerName:  header.key,
                             headerValue: ObjUtils.interpolate(header.value, context)});
      }
    });
    return returnHeaders;
  }

  return {
    storeResponseToContext: storeResponseToContext,
    crossWalk: crossWalk,
    buildHeadersAttachment: buildHeadersAttachment
  }
});