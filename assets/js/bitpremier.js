BitPremier = function(api_key) {
  this.auth = {api_key: api_key};
  this.host = 'http://www.bitpremier.com/api/v1';
  this.resource = {
    category: {
        endpoint: '/category/',
        method: 'GET'
    },
    listing: {
        endpoint: '/listing/',
        method: 'GET'
    }
  }
}

BitPremier.prototype.submitRequest = function(resource, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = {};
  }

  console.log('Submitting request to ' + resource.endpoint + ' with params:');
  console.log(params)

  var that = this;
  this.requestFunction({
    type: resource.method,
    url: that.host + resource.endpoint,
    data: params,
    success: function(data, textStatus, jqXHR){that.parseResponse(data, callback);},
    error: function(jqXHR, textStatus, errorThrown){that.handleError(textStatus, errorThrown, callback);},
    timeout: 15000,
    dataType: 'json',
    headers: {'Authorization': that.auth.api_key}
  });
}

BitPremier.prototype.requestFunction = function(xhrParams) {  
  $.ajax(xhrParams);
}

BitPremier.prototype.handleError = function(textStatus, errorThrown, callback) {
  console.log('Error returned');
  console.log(errorThrown);

  var data = {};
  data.error = 'Error with request: ' + errorThrown;
  this.parseResponse(data, callback);
}

BitPremier.prototype.parseResponse = function(response, callback) {
  console.log('Response returned');
  console.log(response);

  var returnval = {};

  if (typeof response === 'object' && 'error' in response) {
    console.log('Error condition');
    var errorstring = '';
    if (typeof response.error === 'string') {
      errorstring = response.error;
    } else {
      for (var key in response.error) {
        errorstring += response.error[key] + "\n";
      }
    }
    returnval.error = errorstring;
  } else {
    returnval.data = response;
  }

  callback(returnval);
}
