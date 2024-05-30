$(document).ready(function () {
  const HOST = 'localhost';

  // Get API status
  $.get(`http://${HOST}:5001/api/v1/status/`, data => {
    if (data.status == 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  // Update element with selected locations (states and cities)
  function updateLocations (states, cities) {
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(locations).join(', '));
    }
  }

  // Get selected states
  const states = {};
  $('.locations ul h2 input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    updateLocations(states, cities);
  });

  // Get selected cities
  const cities = {};
  $('.locations ul ul li input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    updateLocations(states, cities);
  });

  // Get selected amenities
  const amenities = {};
  $('.amenities input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenities).join(', '));
  });

  // Display each place that matches the filters
  function search (filters = {}) {
    $.ajax({
      type: 'POST',
      url: `http://${HOST}:5001/api/v1/places_search`,
      data: JSON.stringify(filters),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        $('SECTION.places').empty();
        $('SECTION.places').append(data.map(place => {
          return `<article>
                    <div class="title_box">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">${place.price_by_night}</div>
                    </div>
                    <div class="information">
                      <div class="max_guest">${place.max_guest} Guests</div>
                      <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                      <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                    </div>
                    <div class="description">
                      ${place.description}
                    </div>
                    <div class="reviews">
                      <h2>Reviews <span class="review" data-id="${place.id}">show</span></h2>
                      <ul>
                      </ul>
                    </div>
                  </article>`;
        }));
      }
    });
  }

  // Search event with selected filters
  $('#search').click(function () {
    const filters = {
      states: Object.keys(states),
      cities: Object.keys(cities),
      amenities: Object.keys(amenities)
    };
    search(filters);
  });

  // Display all places when the page is loaded
  search();

  // Show/hide reviews
  $(document).on('click', '.review', function (event) {
    const placeId = $(this).attr('data-id');
    const $reviewsList = $(this).closest('.reviews').find('ul');

    if ($(this).text() === 'show') {
      $.ajax(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`)
        .done(function (data) {
          for (const review of data) {
            $reviewsList.append(`<li>${review.text}</li>`);
          }
          $(this).text('hide');
        });
    } else if ($(this).text() === 'hide') {
      $reviewsList.empty();
      $(this).text('show');
    }
  });
});
