var buildTable = function (data, selector) {
    //heading
    var div_element = $(selector);
    var table = $('<table></table>');
    div_element.append(table);
    table.append($('<tr><th>Date</th><th>Speakers</th><th>Title</th><th>Venue</th></tr>'));
    for (var i=0; i<data.length; i++)
    {
        talk = data[i];

        var location_name = talk.api_location? talk.api_location.name : "";

        table.append($('<tr><td>' + talk.formatted_date
                        + '</td><td>' + get_person_titles(talk.speakers)
                        + '</td><td>' + talk.title
                        + '</td><td>' + location_name
                        + '</td></tr>'));
    }
}

//given an array of speaker objects, return a comma separated list of their names
function get_person_titles(persons) {
    var titles = persons.map( function (person) {
        return person.name;
    });
    return titles.join(', ');
}

var buildList = function (data, selector) {
    var div_element = $(selector);
    for(var i=0; i<data.length; i++) {
        talk = data[i];
        header = $('<h3>');
        header.html(talk.title);
        div_element.append(header);
        
        description = $('<p>');
        description.html(talk.description);
        div_element.append(description);
        
        bullets = $('<ul>');
        bullets.append($('<li>Speaker: ' + get_person_titles(talk.speakers) + '</li>'));
        start_time = new Date(talk.start);
        end_time = new Date(talk.end);
//        bullets.append($('<li>' + start_time.toLocaleDateString() 
//                         + ', ' + start_time.toLocaleTimeString() 
//                         + " - " + end_time.toLocaleTimeString() + '</li>'));
        bullets.append($('<li>' + talk.formatted_date + '</li>'));
        var location = talk.api_location ? talk.api_location.name : "TBA";
        bullets.append($('<li>' + location + '</li>'));
        div_element.append(bullets);
    }
}


//Performs the query then calling the specified callback function with the results and the selector
var queryTalks = function (params, callback, selector) {

    //NB. The response will always be via http: so the request should be made that way too to avoid a browser error.
    var url_stem = "https://talks-dev.oucs.ox.ac.uk/api/events/search?";
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

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: function (response) {
            callback(response, selector);                    
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
    queryTalks(params, buildTable, selector);
}

//Perform the query, providing the buildTable callback and passing on the specified selector
function showList(params, selector) {
    //append to body if no selector specified
    if (!selector) {
        selector = 'body';
    }
    queryTalks(params, buildList, selector);
}