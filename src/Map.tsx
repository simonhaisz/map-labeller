import React, { Component, DragEvent, KeyboardEvent, MouseEvent, ChangeEvent } from "react";
import "./Map.css";
import RegionComponent from "./Region";

type Props = {
    map: IMap;
    editable: boolean;
};
type State = {
    regions: IRegion[];
    matches: string[];
};

class MapComponent extends Component<Props, State> {
    private _search = "";
    constructor(props: Props) {
        super(props);
        this.state = {
            regions: [...props.map.regions],
            matches: []
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

    onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        this._search = e.target.value;
    }

    onSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") {
            return;
        }
        const search = this._search.toLowerCase().trim();
        let matches :string[];
        if (search.length === 0) {
            matches = [];
        } else {
            matches = this.state.regions.
                filter(r => r.name.toLowerCase().includes(search))
                .map(r => r.name);
        }
        const regions = [...this.state.regions];
        regions.forEach(r => r.matching = matches.includes(r.name));
        this.setState({ matches, regions });
    }

    onMatchClick = (match: string) => {
        const result = this.state.regions.find(r => r.name === match);
        if (result) {
            let x = result.location.x;
            if (x < screen.width / 2) {
                x = 0;
            }
            let y = result.location.y;
            if (y < screen.height / 2) {
                y = 0;
            }
            scrollTo(x, y);
        }
    }

    onLogMapClick = (e: MouseEvent<HTMLButtonElement>) => {
        const name = this.props.map.name;
        const regions = this.state.regions;
        console.log(JSON.stringify({name, regions}));
    }

    render() {
        const editable = this.props.editable;
        const name = this.props.map.name;
        const regions = this.state.regions.map(r => (
            <RegionComponent name={r.name} location={r.location} matching={r.matching} key={r.name}/>
        ));
        const matches = this.state.matches.map(m => (
            <button className="Map-search-match-button" onClick={() => this.onMatchClick(m)} key={m}>{m}</button>
        ));
        const mapStyle = {
            backgroundImage: `url(data:image/png;base64,${this.props.map.image.data})`,
            width: this.props.map.image.width,
            height: this.props.map.image.height,
            backgroundRepeat: "no-repeat"
        };
        return (
            <div className="Map" style={mapStyle} onDragOver={this.onDragOver} onDrop={this.onDrop}>
                <div className="Map-header">
                    <div className="Map-name">{name}</div>
                    <div className="Map-search-label">Search:</div>
                    <input className="Map-search-input" type="text" onChange={this.onSearchChange} onKeyPress={this.onSearchKeyPress} />
                    {editable ? <button className="Map-log-button" onClick={this.onLogMapClick}>Log Map</button> : null}
                    {matches}
                </div>
                <div className="Map-regions">{regions}</div>
            </div>
        );
    }
}

export default MapComponent;