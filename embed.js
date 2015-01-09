var callback = function (data) {
    //heading
    var div_element = $('#embedded-talks');
    var table = $('<table></table>');
    div_element.append(table);
    table.append($('<tr><th>Date</th><th>Speakers</th><th>Title</th><th>Venue</th></tr>'));
    for (var i=0; i<data.length; i++)
    {
        talk = data[i];
        var speakerNames = talk.speakers.map( function (speaker) {
            return speaker.name;
        });

        var location_name = talk.api_location? talk.api_location.name : "";

        table.append($('<tr><td>' + talk.formatted_date
                        + '</td><td>' + speakerNames.join(', ')
                        + '</td><td>' + talk.title
                        + '</td><td>' + location_name
                        + '</td></tr>'));
    }
}

var queryTalks = function (params) {
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
    queryTalks( { from: "01/01/01",
                  speakers: ['prof-kazuo-kishi']} );
});