Installing and Configuring the Widget
=====================================

The example widget to get you started with embedding talks in your own webpages can be found here:

`https://github.com/ox-it/talks.ox-js-widget <https://github.com/ox-it/talks.ox-js-widget>`_

The widget uses JavaScript to write a table or list of selected talks to an HTML page. You can specify the criteria to select the talks.

This is a very basic guide for web managers and integrators, developers can probably skip to the Parameters Reference at the end. 

Installation
------------

1. `Download <https://github.com/ox-it/talks.ox-js-widget/archive/master.zip>`_ the latest files (:doc:`instructions on downloading from the github repository in this guide <github-zip>`)
2. You will only need the files in the widget folder - **embed_ox_talks.js** and **embed_example.html**.
3. Place these in a single directory on your computer or web server
4. Next open the **embed_ox-talks.js** in a text editor and check the configuration - the :code:`url_stem` should be set as follows (and should always be https)

.. parsed-literal::

   var url_stem = '|oxtalks-url-ssl|/api/events/search?';

5. You are now ready to test the widget by opening and viewing **embed_example.html** in your browser

Defining your selection of talks
--------------------------------

You do this in the HTML page

1. Open **embed_example.html** in a text editor
2. The main work is done in the *<script>* tag at the bottom of the page 
3. To customise your selection of talks adjust the :code:`var params` section in the *<script>* tag. Full instructions on how to do this are given in the Parameters Reference section below

Changing how the talks are displayed
------------------------------------

1. In **embed_example.html** you will see two functions in the *<script>* tag at the bottom of the page. - one delivering a table, the other a plain listing of talks:

.. code::

      showTable( params );                    //appends to body, since no selector specified
      showList( params, "#embedded-talks" );  //appends to the specified element

2. Both have the option to specify the id of the HTML element you would like to populate, and some example elements are provided in the middle of the page:

.. code::

     <h1>Example of embedding</h1>

     <div id="embedded-talks"></div>
     <div id="embedded-table"></div>

3. Once you've finished testing, you can delete one or other of these as you probably won't want both

4. If the actual output of the listing or the table is not to your liking you will need to investigate the JavaScript file **embed_ox_talks.js** in more detail and adjust the :code:`buildList` or :code:`buildTable` functions

Parameters Reference
--------------------

The web page **embed-example.html** uses information you provide to build your selection of talks. 

.. Note:: Speakers, venues etc are searched via their ID - check the :doc:`instructions on how to find the IDs you need <find-ids>`. 

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
       


