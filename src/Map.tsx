import React, { Component, DragEvent } from "react";
import "./Map.css";
import RegionComponent from "./Region";

type Props = IMap;
type State = {
    regions: IRegion[];
};

class MapComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            regions: [...props.regions]
        };
    }

    onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const name = e.dataTransfer.getData("name");
        const currentRegions = [...this.state.regions];
        const region = currentRegions.find(r => r.name === name);
        if (region) {
            region.location = {
                x: e.pageX,
                y: e.pageY
            };
            this.setState({ regions: currentRegions });
        }
    }

    render() {
        const name = this.props.name;
        const regions = this.state.regions.map(r => (
            <RegionComponent name={r.name} location={r.location} key={r.name}/>
        ));
        const mapStyle = {
            backgroundImage: `url(data:image/png;base64,${this.props.image.data})`,
            width: this.props.image.width,
            height: this.props.image.height,
            backgroundRepeat: "no-repeat"
        };
        return (
            <div className="Map" style={mapStyle} onDragOver={this.onDragOver} onDrop={this.onDrop}>
                <div className="Map-name">{name}</div>
                <div className="Map-regions" >{regions}</div>
            </div>
        );
    }
}

export default MapComponent;