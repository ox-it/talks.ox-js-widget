var buildTable = function (data, element) {
    //heading
//    var div_element = $(selector);
    element.empty();
    //replace the contents of the existing table if it's there. Else create it.
    var table = $('table', element);
    if (!table.length) {
        table = $('<table></table>');
        element.append(table);
    }
    else {
        table.empty();
    }
  
    table.append($('<tr><th>Date</th><th>Speakers</th><th>Title</th><th>Venue</th></tr>'));
    for (var i=0; i<data._embedded.talks.length; i++)
    {
        talk = data._embedded.talks[i];

        var location_name = talk._embedded.venue ? talk._embedded.venue.name : "";

        table.append($('<tr><td>' + talk.formatted_date
                        + '</td><td>' + get_person_titles(talk._embedded.speakers)
                        + '</td><td>' + talk.title
                        + '</td><td>' + location_name
                        + '</td></tr>'));
    }
    if(data._links.prev) {
        var prevLink = $('<a href="#">Prev</a>')
        element.append(prevLink);
        prevLink.on('click', function(ev) {
            var element = $(ev.target).parent();
            queryURL(data._links.prev.href, buildTable, element);
        });
    }
    if(data._links.next) {
        var nextLink = $('<a href="#">Next</a>');
        element.append(nextLink);
        nextLink.on('click', function(ev) {
            var element = $(ev.target).parent();
            queryURL(data._links.next.href, buildTable, element);
        });
    }
}

    
//given an array of speaker objects, return a comma separated list of their names
function get_person_titles(persons) {
    var titles = persons.map( function (person) {
        return person.name + ' (' + person.bio + ')';
    });
    if(titles.length <= 0) {
        titles.push("TBA")
    }
    return titles.join(', ');
}

var buildList = function (data, element) {
    element.empty();
    for(var i=0; i<data._embedded.talks.length; i++) {
        talk = data._embedded.talks[i];
        header = $('<h3>');
        header.html(talk.title);
        element.append(header);
        
        description = $('<p>');
        description.html(talk.description);
        element.append(description);
        
        bullets = $('<ul>');
        bullets.append($('<li>Speaker: ' + get_person_titles(talk._embedded.speakers) + '</li>'));
        start_time = new Date(talk.start);
        end_time = new Date(talk.end);
//        bullets.append($('<li>' + start_time.toLocaleDateString() 
//                         + ', ' + start_time.toLocaleTimeString() 
//                         + " - " + end_time.toLocaleTimeString() + '</li>'));
        bullets.append($('<li>' + talk.formatted_date + '</li>'));
        var location = talk._embedded.venue ? talk._embedded.venue.name : "TBA";
        bullets.append($('<li>' + location + '</li>'));
        element.append(bullets);
    }
    if(data._links.prev) {
        var prevLink = $('<a href="#">Prev</a>')
        element.append(prevLink);
        prevLink.on('click', function(ev) {
            var element = $(ev.target).parent();
            queryURL(data._links.prev.href, buildList, element);
        });
    }
    if(data._links.next) {
        var nextLink = $('<a href="#">Next</a>');
        element.append(nextLink);
        nextLink.on('click', function(ev) {
            var element = $(ev.target).parent();
            queryURL(data._links.next.href, buildList, element);
        });
    }
}


//Performs the query then calling the specified callback function with the results and the selector
var queryTalks = function (params, callback, element) {
    var url_stem = "http://talks.local:8000/api/events/search?";
//    var url_stem = "http://talks-dev.oucs.ox.ac.uk/api/events/search?";
    var terms = [];
    if (params.from) {
        terms.push('from=' + params.from);
    }
    if (params.to) {
        terms.push('to=' + params.to);
    }
    terms = terms.concat( buildTermsFromArray(params.speakers, 'speaker') );
    terms = terms.concat( buildTermsFromArray(params.venues, 'venue') );
    terms = terms.concat( buildTermsFromArray(params.organising_departments, 'organising_department') );
    terms = terms.concat( buildTermsFromArray(params.topics, 'topic') );
    
    var url = url_stem + terms.join('&');

    queryURL(url, callback, element);

}

function queryURL(url, callback, element) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: function (response) {
            callback(response, element);                    
        },
        failure: function (response) {
            console.log("AJAX call failed");
        }
    });
}

function buildTermsFromArray(array, key) {
    if(array) {
        var terms = [];
        for(var i=0; i<array.length; i++) {
            terms.push(key + '=' + array[i]);
        }
        return terms;
    }
    return [];
}

//Perform the query, providing the buildTable callback and passing on the specified selector
function showTable(params, selector) {
    //append to body if no selector specified
    if (!selector) {
        selector = 'body';
    }
    queryTalks(params, buildTable, $(selector));
}

//Perform the query, providing the buildTable callback and passing on the specified selector
function showList(params, selector) {
    //append to body if no selector specified
    if (!selector) {
        selector = 'body';
    }
    queryTalks(params, buildList, $(selector));
}