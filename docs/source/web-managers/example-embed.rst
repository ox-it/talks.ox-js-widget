Installing and Configuring the Widget
=====================================

The example widget to get you started with embedding talks in your own webpages can be found here:

`https://github.com/ox-it/talks.ox-js-widget <https://github.com/ox-it/talks.ox-js-widget>`_

The widget uses JavaScript to write a table or list of selected talks to an HTML page. You can specify the criteria to select the talks. 

Installation
------------

1. If you aren't familiar with github you can just download the latest files following the :doc:`instructions in this guide <github-zip>`.
2. Place the two files - *embed.js* and *embed_example.html* - in a single directory on your computer or web server.
3. Follow the instructions below to customize the widget.
4. You are now ready to test the widget by viewing *embed_example.html* in your browser.


Customising the HTML page - embed_example.html
----------------------------------------------

The HTML page calls the JQuery library (see `https://developers.google.com/speed/libraries/devguide <https://developers.google.com/speed/libraries/devguide>`_) and the local JavaScript file - *embed.js*. The main work is done in the *<script>* tag at the bottom of the page.

1. There are two functions provided - one delivering a table, the other a plain listing of talks, with the option to specify the id of the HTML element you would like to populate with your listing or table. Once you've finished testing, you can delete one or other of these as you probably won't want both.

.. code::
   
   showTable( params );                    //appends to body, since no selector specified
   showList( params, "#embedded-talks" );  //appends to the specified element
   
2. To customise your selection of talks adjust the code::`var params` section in the *<script>* tag. Full instructions on how to do this are given in the Parameters section below.

Customising the JavaScript file - embed.js
------------------------------------------

The JavaScript file queries Oxford Talks and formats the results.

1. Double check the url_stem - it should be set as follows 

.. parsed-literal::

   var url_stem = '|oxtalks-url|/api/events/search?';

2. This is where you can tweak the HTML of the output, by adjusting the *buildList* or *buildTable* functions.

Parameters
----------

example-embed.html uses information you provide to build your selection of talks. Speakers, venues etc are searched via their ID - check the :doc:`instructions on how to find the IDs you need <find-ids>`. 

from : date string ('dd/mm/yy'), **required**
     * Start date for the list of talks. 
     * Format as :code:`'dd/mm/yy'`
     * Or use the keyword :code:`'today'` to get upcoming talks
     
to : date string ('dd/mm/yy'), optional
    * End date for the list of talks.
    * Format :code:`'dd/mm/yy'`
     
speakers : array of speaker IDs as strings, optional
         * For a list of talks by one or more specific speakers
         * Format for one speaker :code:`['f8ecded3-d2af-4585-bd3b-5cd7440795b9']`
         * Format for more than one :code:`['f8ecded3-d2af-4585-bd3b-5cd7440795b9','7d5e6f9a-d2d0-4185-9cf6-eaf0073cbf34']` 
         
venues : array of oxpoints IDs as strings, optional
       * For a list of talks in one or more specific venues
       * Format for one venue :code:`['oxpoints:59444038']` 
       * Format for more than one venue :code:`['oxpoints:59444038','oxpoints:55095840']` 
       
organising_departments : array of oxpoints IDs as strings, optional
        * For a list of talks in one or more specific organising departments
        * Format for one department :code:`['oxpoints:23232596']` 
        * Format for more than one department :code:`['oxpoints:23232596','oxpoints:23232740']`
                       
topics : array of FAST topic URIs as strings, optional
        * For a list of talks on one or more specific topics
        * Format for one topic :code:`['http://id.worldcat.org/fast/1097048']`
        * Format for more than one topic :code:`['http://id.worldcat.org/fast/1097048','http://id.worldcat.org/fast/864329']`

.. Note:: 
   
   * individual parameters are joined by AND in the query whereas two or more values given in the arrays are joined by OR. 
   * an array comprises square brackets and a list of items separated by commas
   * make sure each of the IDs, dates or keywords you provide is given as a string i.e. it is set in inverted commas
   * if you aren't using one of the parameters, either remove the line completely or make sure it is set to :code:`null` (for a date) or an empty array :code:`[]`
       


