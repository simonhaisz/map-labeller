import React, { Component } from 'react';
import logo from './logo.svg';
import { retrieveMap } from './map-retrieval';
import './App.css';
import MapComponent from './Map';

type Props = {};
type State = {
  map?: IMap;
}
class AppComponent extends Component<Props,State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    retrieveMap("canada", false)
      .then(map => {
        if (map) {
          this.setState({
            map
          });
        } else {
          console.error("No map was returned");
        }
      })
      .catch(error => console.error(error));
  }

  render() {
    if (!this.state.map) {
      return (
        <div className="App">Loading map...</div>
      )
    }
    const name = this.state.map.name;
    const image = this.state.map.image;
    const regions = this.state.map.regions;
    return (
      <div className="App">
        <MapComponent name={name} image={image} regions={regions} />
      </div>
    );
  }
}

export default AppComponent;
