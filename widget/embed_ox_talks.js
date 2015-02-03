/////////////////////////////////////////////////
//    embed_ox_talks.js
//
//    A script to retrieve search results from the talks.ox API and format the response
//    Latest source and usage example are available at https://github.com/ox-it/talks.ox-js-widget
//    Documentation: http://talksox.readthedocs.org/en/latest/

var OX_TALKS_URL_STEM = "https://talks.ox.ac.uk/api/talks/search?";

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
    
    build_location: function(venue) {
        if (venue) {
            return "<a href=" + venue.map_link + ">" + venue.name + "</a>";
        }
        else return "TBA";
    },
    
    build_title: function(talk) {
        var title = talk.title ? talk.title : "TBA";
        return "<a href='" + talk._links.talks_page.href + "'>" + title + "</a>";
    },
    
    buildTable: function (data, element) {
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

            var location_name = this.build_location(talk._embedded.venue);
            var talk_title = this.build_title(talk);
            
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
            var talk_title = this.build_title(talk);
            header = $('<h3>' + talk_title + '</h3>');
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
            var location = this.build_location(talk._embedded.venue);
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

    //Prepares the query url based on the specified search parameters object
    queryTalks: function (params, callback, element) {
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
        if (params.page_size) {
            terms.push('count=' + params.page_size);
        }
        var url_stem = params.url ? params.url : OX_TALKS_URL_STEM;

        var url = url_stem + terms.join('&');

        this.queryURL(url, callback, element);
    },

    //Submit the query to the talks server. This is called by the original request, and also by clicks to paging links.
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
    
    //create a new container, returns the jquery selector for it
    createContainer: function() {
        var divname = "oxtalks";
        var newDiv = $("<div id=" + divname + "></div>");
        $('body').append(newDiv);
        return '#' + divname;
    },
    
    ///////
    // Interface - use these methods to add a table or list to the page
    
    //Perform the query, and place a table of results in the specified selector
    showTable: function(params, selector) {
        //create a div element named "oxtalks" and append to body if no selector specified
        if (!selector) {
            selector = this.createContainer();
        }
        this.queryTalks(params, this.buildTable, $(selector));
    },

    //Perform the query, and place a list of results in the specified selector
    showList: function(params, selector) {
        //append to body if no selector specified
        if (!selector) {
            selector = this.createContainer();
        }
        this.queryTalks(params, this.buildList, $(selector));
    }
}