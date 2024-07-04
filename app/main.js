import './style.css'


import { SVG } from '@svgdotjs/svg.js'

import { createEntity } from './src/components/entity.js'

document.querySelector('#app').innerHTML = `
  <div id="outer-container">
  </div>
`

let drawPlane = SVG().addTo('#outer-container').size("100%", "100%")

createEntity(drawPlane)

//createEntity(drawPlane)
