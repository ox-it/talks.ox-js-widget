var oxtalks = {
    
    //given an array of speaker objects, return a comma separated list of their names
    get_person_titles: function(persons) {
        var titles = persons.map( function (person) {
            return person.name + ' (' + person.bio + ')';
        });
        if(titles.length <= 0) {
            titles.push("TBA")
        }
        return titles.join(', ');
    },
    
    buildTable: function (data, element) {
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

            var location_name = talk._embedded.venue ? talk._embedded.venue.name : "TBA";

            var talk_title = talk.title.length>0 ? talk.title : "Title TBA";
            
            table.append($('<tr><td>' + talk.formatted_date
                            + '</td><td>' + this.get_person_titles(talk._embedded.speakers)
                            + '</td><td>' + talk_title
                            + '</td><td>' + location_name
                            + '</td></tr>'));
        }
        if(data._links.prev) {
            var prevLink = $('<a href="#">Prev</a>')
            element.append(prevLink);
            prevLink.on('click', (function(ev) {
                var element = $(ev.target).parent();
                this.queryURL(data._links.prev.href, this.buildTable, element);
            }).bind(this));
        }
        if(data._links.next) {
            var nextLink = $('<a href="#">Next</a>');
            element.append(nextLink);
            nextLink.on('click', (function(ev) {
                var element = $(ev.target).parent();
                this.queryURL(data._links.next.href, this.buildTable, element);
            }).bind(this));
        }
    },

    buildList: function (data, element) {
        element.empty();
        for(var i=0; i<data._embedded.talks.length; i++) {
            talk = data._embedded.talks[i];
            header = $('<h3>');
            var talk_title = talk.title.length>0 ? talk.title : "Title TBA";
            header.html(talk_title);
            element.append(header);

            description = $('<p>');
            description.html(talk.description);
            element.append(description);

            bullets = $('<ul>');
            bullets.append($('<li>Speaker: ' + this.get_person_titles(talk._embedded.speakers) + '</li>'));
            start_time = new Date(talk.start);
            end_time = new Date(talk.end);
    //        bullets.append($('<li>' + start_time.toLocaleDateString() 
    //                         + ', ' + start_time.toLocaleTimeString() 
    //                         + " - " + end_time.toLocaleTimeString() + '</li>'));
            bullets.append($('<li>' + talk.formatted_date + '</li>'));
            var location = talk._embedded.venue ? talk._embedded.venue.name : "Venue TBA";
            bullets.append($('<li>' + location + '</li>'));
            element.append(bullets);
        }
        if(data._links.prev) {
            var prevLink = $('<a href="#">Prev</a>')
            element.append(prevLink);
            prevLink.on('click', (function(ev) {
                var element = $(ev.target).parent();
                this.queryURL(data._links.prev.href, this.buildList, element);
            }).bind(this));
        }
        if(data._links.next) {
            var nextLink = $('<a href="#">Next</a>');
            element.append(nextLink);
            nextLink.on('click', (function(ev) {
                var element = $(ev.target).parent();
                this.queryURL(data._links.next.href, this.buildList, element);
            }).bind(this));
        }
    },

    //Performs the query then calling the specified callback function with the results and the selector
    queryTalks: function (params, callback, element) {
        var url_stem = "http://talks.local:8000/api/events/search?";
    //    var url_stem = "http://talks-dev.oucs.ox.ac.uk/api/events/search?";
        var terms = [];
        if (params.from) {
            terms.push('from=' + params.from);
        }
        if (params.to) {
            terms.push('to=' + params.to);
        }
        terms = terms.concat( this.buildTermsFromArray(params.speakers, 'speaker') );
        terms = terms.concat( this.buildTermsFromArray(params.venues, 'venue') );
        terms = terms.concat( this.buildTermsFromArray(params.organising_departments, 'organising_department') );
        terms = terms.concat( this.buildTermsFromArray(params.topics, 'topic') );

        var url = url_stem + terms.join('&');

        this.queryURL(url, callback, element);
    },

    queryURL: function(url, callback, element) {
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            success: (function (response) {
                callback.call(this, response, element);
            }).bind(this),
            failure: function (response) {
                console.log("AJAX call failed");
            }
        });
    },

    buildTermsFromArray: function(array, key) {
        if(array) {
            var terms = [];
            for(var i=0; i<array.length; i++) {
                terms.push(key + '=' + array[i]);
            }
            return terms;
        }
        return [];
    },

    //Perform the query, providing the buildTable callback and passing on the specified selector
    showTable: function(params, selector) {
        //create a div element named "oxtalks" and append to body if no selector specified
        if (!selector) {
            selector = this.createContainer();
        }
        this.queryTalks(params, this.buildTable, $(selector));
    },

    //Perform the query, providing the buildTable callback and passing on the specified selector
    showList: function(params, selector) {
        //append to body if no selector specified
        if (!selector) {
            selector = this.createContainer();
        }
        this.queryTalks(params, this.buildList, $(selector));
    },
    
    //create a new container, returns the jquery selector for it
    createContainer: function() {
        var divname = "oxtalks";
        var newDiv = $("<div id=" + divname + "></div>");
        $('body').append(newDiv);
        return '#' + divname;
    }
}