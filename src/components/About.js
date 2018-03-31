import React from 'react'

const About = () => 
  <div>
    <h1>Chicago Food Safety Inspections</h1>
    <h2>About</h2>
    <p>
      This a project I quickly threw together that sources food safety
      inspection data from 
      <a href="http://data.cityofchicago.org">data.cityofchicago.org</a> 
      and plots it on a map. Upon clicking the 'Search In Map'
      button, the map will be populated markers denoting establishments located
      within the bounds of the map that have been inspected.
    </p>
    <h3>Filtering</h3>
    <p>
      Once the inspection data has been loaded you can filter it by selecting a
      result filter.
    </p>
    <h3>Data Display Types</h3>
    <p>
      You can view the plotted data in two different ways. One way is to place
      a marker on the map for each establishment. This view has the benefit of
      being able to click on the markers to see the results and violations of
      the inspections. The other way to view the data is via a heatmap, which
      is more helpful in determing the relative density of locations. Combining
      the heatmap view with the 'Have failed at least once' filter allows one
      to see areas where food inspection failures are more common.
    </p>
  </div>

  export default About