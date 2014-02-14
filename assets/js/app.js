var bitpremier = new BitPremier(); // Supply auth credentials as first string param

currentView = {
  pagingAmount: 20,
  previousOffset: 0,
  totalItems: 999999999,
  categoryId: null,
  loadingClass: 'loading'
}

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
  return [
    '<li class="listing">',
    '<a target="_blank" href="http://www.bitpremier.com/items/view/' + item.id + '">',
    '<img class="main_picture img-thumbnail" src="'+item.main_picture+'">',
    '<div class="clearfix"></div>',
    item.title,
    '</a>',
    '<br> <i class="fa fa-btc fa-fw"></i>',
    item.btc_price,
    '<div id="description-'+item.id+'"></div>',
    '</li>'
  ].join('');
}

function getListingDetails(listingId) {
  bitpremier.submitRequest({'id': listingId}, bitpremier.resource.listing, function (response) {

  });
}
