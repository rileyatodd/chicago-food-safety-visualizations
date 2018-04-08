import React from 'react'

const About = () => 
  <div>
    <h1>Chicago Food Safety Inspections</h1>
    <h2>About</h2>
    <p>
      This app sources food safety inspection data 
      from <a href="http://data.cityofchicago.org">data.cityofchicago.org</a> and 
      plots it on a map. Click the refresh 
      button to load recent inspections that occurred within the bounds of the map.
    </p>
    <h3>Filtering</h3>
    <p>
      Once the inspection data has been loaded you can filter it by selecting a
      result filter.
    </p>
    <h3>Data Display Types</h3>
    <p>
      You can view the plotted data in two different ways. The default places
      a marker on the map for each business. This view has the benefit of
      being able to click on the markers to see the results and violations of
      the inspections. The other way to view the data is via a heatmap, which
      is more helpful in determing the relative density of businesses. Combining
      the heatmap view with the 'Have failed at least once' filter allows one
      to see areas where food inspection failures are more common.
    </p>
  </div>

  export default About