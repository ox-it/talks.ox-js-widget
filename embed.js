var buildTable = function (data) {
    //heading
    var div_element = $('#embedded-talks');
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

var buildList = function (data) {
    var div_element = $('#embedded-talks');
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
        bullets.append($('<li>' + talk.formatted_date + '</li>'));
        var location = talk.api_location ? talk.api_location.name : "TBA";
        bullets.append($('<li>' + location + '</li>'));
        div_element.append(bullets);
    }
}

var queryTalks = function (params, callback) {
    var url_stem = "http://talks.local:8000/api/events/search?";
    var terms = [];
    if (params.from) {
        terms.push('from=' + params.from);
    }
    if (params.to) {
        terms.push('to=' + params.to);
    }
    var speakers = buildTermsFromArray(params.speakers, 'speaker')
    terms = terms.concat( speakers );
    terms = terms.concat( buildTermsFromArray(params.venues, 'venue') );
    terms = terms.concat( buildTermsFromArray(params.organising_departments, 'organising_department') );
    terms = terms.concat( buildTermsFromArray(params.topics, 'topic') );

    var url = url_stem + terms.join('&');

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: callback,
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


$(document).ready(function() {
    showTable( { from: "01/01/01",
                  speakers: ['prof-kazuo-kishi']} );
    showList( { from: "01/01/01" } );
});

function showTable(params) {
    queryTalks(params, buildTable);
}

function showList(params) {
    queryTalks(params, buildList);
}