import React from 'react'
import autobind from 'react-autobind'
import styles from '../../data/gmap.json'
import geocodes from '../../data/geocodes.json'

const key = 'AIzaSyAc5Ad63pIaWczmImRQsgHArKXTHi0sHqM'

class GMap extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  componentDidMount() {
    if (typeof google == 'undefined') {
      return null
    }

    const center = { lat: 55, lng: 37 }

    this.map = new google.maps.Map(this.node, {
      zoom: 6,
      disableDefaultUI: true,
      center,
      styles,
    })

    this.marker = new google.maps.Marker({
      position: center,
      map: this.map,
    })

    this.componentDidUpdate()
  }

  geocode() {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.props.place}&key=${key}`
    fetch(url)
      .then(d => d.json())
      .then(d => {
        const center = d.results[0].geometry.location
        this.map.setCenter(center)
        this.marker.setPosition(center)
      })
  }

  componentDidUpdate() {
    if (typeof google == 'undefined') {
      return null
    }

    const place = geocodes.find(x => this.props.place.includes(x[0]))

    if (place != null) {
      const center = { lat: place[1], lng: place[2] }
      this.map.setCenter(center)
      this.marker.setPosition(center)
    } else {
      this.geocode()
    }
  }

  render() {
    return (
      <div className="gMap">
        <section
          ref={input => {
            this.node = input
          }}
          className="gMap__inner"
        />
      </div>
    )
  }
}

export default GMap
