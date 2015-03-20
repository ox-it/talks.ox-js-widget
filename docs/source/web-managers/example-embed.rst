Installing and Configuring the Widget
=====================================


Installation
------------

1. `Download <https://github.com/ox-it/talks.ox-js-widget/archive/master.zip>`_ the latest files (:doc:`instructions on downloading from the github repository in this guide <github-zip>`)
2. You will only need to tweak the files in the widget folder - **embed_ox_talks.js** and **embed_example.html** (**embed_ox_talks.min.js** is a *minified* version of the JavaScript).
3. However, to get things up and running quickly, place both the **widget** directory and the **libs** directory in a single directory on your computer or web server 
4. You are now ready to test the widget by opening and viewing **embed_example.html** in your browser

Defining your selection of talks
--------------------------------

You do this in the HTML page

1. Open **embed_example.html** in a text editor
2. The main work is done in the *<script>* tag at the bottom of the page 
3. To customise your selection of talks adjust the :code:`var params` section in the *<script>* tag. Full instructions on how to do this are given in the :doc:`Parameters Reference section <parameters>`.
4. Remove the first set of '//' to activate a particular parameter 

Changing how the talks are displayed
------------------------------------

1. In **embed_example.html** you will see three functions in the *<script>* tag at the bottom of the page - delivering a table, a plain listing of talks and a calendar view:

.. code::

      showTable( params );                    //appends to body, since no selector specified
      showList( params, "#embedded-talks" );  //appends to the specified element
      oxtalks.showCalendar( params, "#embedded-calendar" );                 //appends a calendar to the body

2. All have the option to specify the id of the HTML element you would like to populate, and some example elements are provided in the middle of the page:

.. code::

     <h1>Example of embedding</h1>

     <div id="embedded-talks"></div>
     <div id="embedded-table"></div>
     <div id="embedded-calendar" style="max-width:800px"></div>

3. Once you've finished testing, you can delete the divs you don't want. Remember that, if you choose the **showTable** option you will probably want to specify the element you want the table to appear in.

4. If the actual output of the listing or the table is not to your liking you will need to investigate the JavaScript file **embed_ox_talks.js** in more detail and adjust the :code:`buildList` or :code:`buildTable` functions

Changing the calendar view
--------------------------

1. You can adjust the way the calendar displays in the :code:`var calParams` section in the *<script>* tag in **embed_example.html**

2. It is also possible to add more parameters, for a complete overview of the range of parameters go to http://fullcalendar.io/docs/ 


