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
    
    //create a new div container, returns the jquery selector for it
    createContainer: function() {
        var divname = "oxtalks";
        var newDiv = $("<div id=" + divname + "></div>");
        $('body').append(newDiv);
        return '#' + divname;
    },
    
    //create a new fullcalendar Eventsource for the given query params, which will be invoked by fullcalendar as the calendar is browsed
    createEventSource: function(params) {
        //store the search params for future queries
        var p = params;
        
        //calls fullcalendar's callback with the new set of events
        var updateCal = function(data, element) {
            var events = data._embedded.talks;
            //fullCalendar's callback method should exist in the calling context
            this.cb(events);            
        };
        
        var events = function(start, end, timezone, callback) {
            // update query params for new date range
            p.start = start.format("DD/MM/YY");
            p.end = end.format("DD/MM/YY");
            //add the fullcalendar callback to the context
            this.cb = callback;
            // fire off the query
            this.queryTalks(p, updateCal.bind(this), null);
        };
        
        return {
            events: events.bind(this)    
            //TODO Customise colours, editability here
        }
    },
    
    //convert incoming talks json data to the Event format used by fullcalendar
    ConvertToCalendarEvent: function(talk) {
        var event = {
            id: talk.title,
            title: talk.title,
            start: talk.start,
            end: talk.end,
            url: talk._links.talks_page.href,
            description: talk.description,
        }
        return event;
    },
    
    onCalMouseOver: function(event, jsEvent, view) {
        var $target = $(jsEvent.target);
       // create a popover showing the description of the event
        var $popover = $("<div class='calendar-popover'></div>");
        var $talkInfo = $("<div></div>");
        $talkInfo.css({padding:'5px'});
        $talkInfo.append($('<h2>' + event.title + '</h4>'));
        $talkInfo.append($('<h3>' + event.start.format('Do MMM, H:mm a') + '</h5>'));
        $talkInfo.append($('<p>' + event.description + '</p>'));
        $talkInfo.css({
            "backgroundColor": 'white',
            "color": '#002147',
            "border-color": '#002147',
            "border-radius": '5px',
            "border-style": 'solid',
            "border-width": '1px',
            "position": 'absolute',
            "z-index": '1000',
            "bottom": '15px',
            "left": '-200px',
            "min-width": '200px',
            "max-width": '700px',
            "width": '500%',
        });
        $popover.append($talkInfo);
        //this is set to the event's div element.
        $(this).append($popover);
    },
    onCalMouseOut: function(event, jsEvent, view) {
        var $target = $(jsEvent.target);
        // clean up the popover element
        //this is set to the event's div element
        var popover = $(this).find('.calendar-popover');
        popover.remove();
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
    },

    //Create a calendar using fullCalendar. The query will be invoked by fullCalendar
    showCalendar: function(params, selector) {
        //append to body if no selector specified
        if (!selector) {
            selector = this.createContainer();
        }
        
        //check that the fullcalendar plugin is present and provide helpful feedback if not
        if(!$.fullCalendar)
        {
            console.error("Fullcalendar plugin not present. Please consult the docs at http://talksox.readthedocs.org/en/latest/");
            //error message for the end user
            $(selector).text("Unable to display calendar");
            return;
        }

        //Create calendar
        var eventSource = this.createEventSource(params);
        $(selector).fullCalendar({
            eventSources: [ eventSource ],
            eventColor: '#002147',
            textColor: 'white',
            editable: false,
            header: {
                left: 'title',
                center: '',
                right: 'prev,today,next month,basicWeek'
            },
            eventDataTransform: this.ConvertToCalendarEvent,
            eventMouseover: this.onCalMouseOver,
            eventMouseout: this.onCalMouseOut,
        });
    },
}