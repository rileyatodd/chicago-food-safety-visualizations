import React from 'react'

const About = () => 
  <div>
    <h1>Chicago Food Safety Inspections</h1>
    <h2>About</h2>
    <p>
      This app visualizes food safety inspection data 
      from <a href="http://data.cityofchicago.org">data.cityofchicago.org</a>.
    </p>
    <p>
      You can view the plotted data in two different ways.
    </p>
    <p>
      The default places a marker on the map for each business that you can click on to view 
      detailed info about the business and the results of all past inspections of it.
    </p>
    <p>
      The other way to view the data is with a heatmap. The heatmap weights each business
      by the number of times it has failed inspection which
      is helpful for spotting areas with relatively high failure density. 
    </p>
  </div>

  export default About