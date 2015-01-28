Installing and Configuring the Template
=======================================

An example widget to get you started with embedding talks in your own webpages can be found here:

`https://github.com/ox-it/talks.ox-js-widget <https://github.com/ox-it/talks.ox-js-widget>`_

Installation
------------

If you aren't familiar with github you can just download the latest files following the :doc:`instructions in this guide <github-zip>`.

Place the two files embed.js and embed_example.html in a single directory.

Quick Tour
----------

embed_example.html
^^^^^^^^^^^^^^^^^^

calls the JQuery library (see `https://developers.google.com/speed/libraries/devguide <https://developers.google.com/speed/libraries/devguide>`_) and embed.js.

1. There are two functions provided - one delivering a table, the other a plain listing of talks. 
2. Adjust the arguments (params) here to customize your listing.

embed.js
^^^^^^^^ 

queries Oxford Talks and formats the results.

1. Adjust the code / html to suit your requirements.
2. Double check the url_stem - it should be set as follows 

.. code::

   var url_stem = "http://new.talks.ox.ac.uk/api/events/search?";


Parameter Examples
------------------

