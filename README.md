# talks.ox-js-widget

[![Documentation Status](https://readthedocs.org/projects/talksox-js-widget/badge/?version=latest)](https://readthedocs.org/projects/talksox-js-widget/?badge=latest)

Javascript widget for embedding talks information from talks.ox

## Webmasters

To make use of this widget, please consult the documentation at http://talksox-js-widget.readthedocs.org/en/latest/

## Developers

N.B. The node package file is used only for development dependencies. It is up to the user to ensure that a comaptible version of jQuery is loaded. If the calendar functionality is required, it's also necessary to include a version of moment.js and fullcalendar.js/css.

### Dev dependencies

Assuming the node package manager is available, install the dev dependencies by running the following command from the root directory:

    npm install
    
Grunt and other dependencies should now be available 

### Minify

A new version of embed_ox_talks.min.js can be generated via:

    grunt minify