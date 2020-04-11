import React, { Component, DragEvent, KeyboardEvent, MouseEvent, ChangeEvent } from "react";
import "./Map.css";
import RegionComponent, { convertNameToId } from "./Region";
import { saveMap } from "./map-retrieval";
import SearchResults from "./SearchResults";

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
            matches = this.state.regions
                .filter(r => r.name.toLowerCase().includes(search))
                .map(r => r.name);
        }
        const regions = [...this.state.regions];
        regions.forEach(r => {
            r.selected = false;
            r.matching = matches.includes(r.name);
        });
        this.setState({ matches, regions });
        if (matches.length > 0) {
            this.onMatchClick(matches[0]);
        }
    }

    onMatchClick = (match: string) => {
        const region = this.state.regions.find(r => r.name === match);
        const regions = [...this.state.regions];
        regions.forEach(r => r.selected = r.name === match);
        this.setState(state => ({...state, regions }));
        if (region) {
            const windowMiddleX = window.innerWidth / 2;
            const windowMiddleY = window.innerHeight / 2;
            const regionDiv = document.getElementById(convertNameToId(region.name));
            if (!regionDiv) {
                throw new Error(`Could not find region '${region.name}'`);
            }
            const regionMiddleX = regionDiv.offsetWidth / 2;
            const regionMiddleY = regionDiv.offsetHeight / 2;
            let x = region.location.x + regionMiddleX - windowMiddleX;
            let y = region.location.y + regionMiddleY - windowMiddleY;
            const options: ScrollToOptions = {
                top: y,
                left: x,
                behavior: "smooth"
            }
            window.scrollTo(options);
        }
    }

    onSaveMapClick = (e: MouseEvent<HTMLDivElement>) => {
        const map: IMap = {...this.props.map, regions: [...this.state.regions]};
        saveMap(map);
    }

    render() {
        const editable = this.props.editable;
        const name = this.props.map.name;
        const regions = this.state.regions.map((r, i) => {
            return (
                <RegionComponent name={r.name} location={r.location} matching={!!r.matching} selected={!!r.selected} draggable={editable} key={i}/>
            )
        });
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
                    <div className="Map-search">
                        <div className="Map-search-label">Search:</div>
                        <input className="Map-search-input" type="text" onChange={this.onSearchChange} onKeyPress={this.onSearchKeyPress} />
                    </div>
                    {
                        editable
                        ?
                            <div className="Map-log-button" onClick={this.onSaveMapClick}>Save Map</div>
                        :
                            this.state.matches.length > 0
                            ?
                                <SearchResults matches={this.state.matches} selectMatch={this.onMatchClick} />
                            :
                                null
                    }
                </div>
                <div className="Map-regions">{regions}</div>
            </div>
        );
    }
}

export default MapComponent;