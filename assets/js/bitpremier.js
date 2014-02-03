BitPremier = function(api_key) {
  this.auth = {api_key: api_key};
  this.host = 'https://www.bitpremier.com/api';
  this.resource = {
    category: {
        endpoint: '/v1/category/',
        method: 'GET',
        auth: false
    },
    listing: {
        endpoint: '/v1/listing/',
        method: 'GET',
        auth: false
    },
    ticker: {
        endpoint: '/ticker',
        method: 'GET',
        auth: false
    }
  }
}

BitPremier.prototype.submitRequest = function(resource, params, callback) {
  if (typeof params === "function") {
    callback = params;
    params = {};
  }

  console.log('Submitting request to ' + resource.endpoint + ' with params:');

  var that = this; // To pass object into callbacks below
  var xhrParams = {
    type: resource.method,
    url: this.host + resource.endpoint,
    data: params,
    success: function(data, textStatus, jqXHR){that.parseResponse(data, callback);},
    error: function(jqXHR, textStatus, errorThrown){that.handleError(textStatus, errorThrown, callback);},
    timeout: 15000,
    dataType: 'json'
  }
  // Check if this resource requires authorization and we have some to supply
  if (resource.auth && this.auth.api_key)
    xhrParams.headers = {'Authorization': this.auth.api_key};

  this.requestFunction(xhrParams);
}

BitPremier.prototype.requestFunction = function(xhrParams) {  
  $.ajax(xhrParams);
}

BitPremier.prototype.handleError = function(textStatus, errorThrown, callback) {
  console.log('Error returned');
  console.log(textStatus, errorThrown);

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
