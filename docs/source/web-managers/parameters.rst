.. _parameters:

Parameters Reference
====================

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
        
url : url string, optional
        * For testing purposes, overrides the API url
     
page_size : integer, optional
        * Specify the number of talks to appear per page
        * Format :code:`4`

.. Note:: 
   
   * individual parameters are joined by AND in the query whereas two or more values given in the arrays are joined by OR. 
   * an array comprises square brackets and a list of items separated by commas
   * make sure each of the IDs, dates or keywords you provide is given as a string i.e. it is set in inverted commas
   * if you aren't using one of the parameters, either remove the line completely, comment it out with '//', or make sure it is set to :code:`null` (for a date) or an empty array :code:`[]`
       
