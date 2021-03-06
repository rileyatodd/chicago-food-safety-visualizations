import React from 'react'
import { compose, withProps } from 'recompose'
import { withGoogleMap, GoogleMap } from "react-google-maps"

const GMap = compose(
  withProps({
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    center: {lat: 41.879272, lng: -87.639737},
  }),
  withGoogleMap
)(props =>
  <GoogleMap ref={c => c && props.refFn(c.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)}
             defaultZoom={17}
             defaultCenter={props.center}>
    {props.childs}
  </GoogleMap>
)

export default GMap