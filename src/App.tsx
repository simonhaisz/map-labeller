import React, { Component } from 'react';
import { retrieveMap } from './map-retrieval';
import './App.css';
import MapComponent from './Map';

type Props = {
  authoring: boolean;
};
type State = {
  map?: IMap;
}
class AppComponent extends Component<Props,State> {

  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    retrieveMap("canada", this.props.authoring)
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
    const map = this.state.map;
    const editable = this.props.authoring;
    return (
      <div className="App">
        <MapComponent map={map} editable={editable} />
      </div>
    );
  }
}

export default AppComponent;
