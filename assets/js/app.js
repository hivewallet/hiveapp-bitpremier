var bitpremier = new BitPremier(); // Supply auth credentials as first string param
refreshTicker()
setInterval(refreshTicker, 15 * 1000)

currentView = {
  pagingAmount: 20,
  previousOffset: 0,
  totalItems: 999999999,
  categoryId: null,
  loadingClass: 'loading'
}

/*
// A replacement function if CORS is not enabled
bitpremier.requestFunction = function(xhrParams) {
  var url = xhrParams.url;
  delete xhrParams.url;
  bitcoin.makeRequest(url, xhrParams);
}
*/

function scrollLoad() {
  if ( currentView.totalItems > (currentView.previousOffset + currentView.pagingAmount) )
  {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
      if (!$('#listings').hasClass(currentView.loadingClass)) {
        getListings();
      }
    }
  }
}

function getCategories() {
  bitpremier.submitRequest(bitpremier.resource.category, {'order_by': 'name'}, function (response){
    if ('data' in response) {
      var items = response.data.objects.sort(function(a, b){
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var text = '<li><a href="#" class="category-link" value="'+item.id+'">'+item.name+'</a></li>';
        $('#categories').append(text);
      };

      $('.category-link').click( function(e){
        /*e.stopPropagation();*/
        currentView.categoryId = parseInt($(this).attr('value'));
        currentView.previousOffset = 0;
        currentView.totalItems = 0;
        $('#listings').empty();
        getListings();
        $('.category-name').text($(this).text());
        $('.navbar-toggle').click();
      });

    }
  });
}

function getListings(callback) {
  params = {'limit': currentView.pagingAmount, 'offset': currentView.previousOffset};
  if (currentView.categoryId)
    params.category = currentView.categoryId;

  $('#listings').addClass(currentView.loadingClass);
  $('#loading-indicator').show();
  $('#user-message').hide();
//window.setTimeout(function(){
  bitpremier.submitRequest(bitpremier.resource.listing, params, function (response){
    if ('data' in response) {
      currentView.totalItems = response.data.meta.total_count;
      $('.total-items').text(currentView.totalItems);
      var i = 0
      for (; i < response.data.objects.length; i++) {
        var item = response.data.objects[i];
        $('#listings').append(itemHtml(item));
      };
      currentView.previousOffset += i;

      $('#listings').removeClass(currentView.loadingClass);
      $('#user-message').show();
      $('#loading-indicator').hide();
      if (typeof callback === "function") callback();
    }
  });
//}, 3000);
}

function itemHtml(item) {
  var price = getPrice(item)
  var currency = getCurrency(item)
  return [
    '<li class="listing" data-id="' + item.id + '" data-currency="' + currency + '" data-price="' + price + '">',
    '<a target="_blank" href="http://www.bitpremier.com/items/view/' + item.id + '">',
    '<img class="main_picture img-thumbnail" src="'+item.main_picture+'">',
    '<div class="clearfix"></div>',
    item.title,
    '</a>',
    '<br> <i class="fa fa-btc fa-fw"></i>',
    '<span class="btc_price">' + getBTCPrice(currency, price) + "<span>",
    '<div id="description-'+item.id+'"></div>',
    '</li>'
  ].join('');
}

function getCurrency(item) {
  return (item.eur_price) ? 'eur_btc' : 'usd_btc'
}

function getPrice(item) {
  return (item.eur_price) ? item.eur_price : item.price
}

function getBTCPrice(currency, price) {
  if(bitpremier.ticker === undefined) return;
  if(price === undefined || currency === undefined) return;

  return parseFloat(price) / bitpremier.ticker[currency]
}

function refreshTicker() {
  bitpremier.submitRequest(bitpremier.resource.ticker, function (response){
    bitpremier.ticker = response.data

    var items = [].slice.call(document.querySelectorAll('li.listing'))
    items.forEach(function(item){
      var btcPrice = getBTCPrice(item.dataset['currency'], item.dataset['price'])
      item.querySelector('.btc_price').textContent = btcPrice
    })
  })
}

function getListingDetails(listingId) {
  bitpremier.submitRequest({'id': listingId}, bitpremier.resource.listing, function (response) {

  });
}
