import React, { Component, DragEvent } from 'react';
import "./Region.css";

export const convertNameToId = (name: string): string => (
    `region-${name.replace(/\s/g, "-").toLowerCase()}`
);

type Props = {
    name: string;
    location: ILocation;
    matching: boolean;
    selected: boolean;
    draggable: boolean;
}
class RegionComponent extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    onDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("name", this.props.name);
    }

    render() {
        const classes: string[] = ["Region"];
        if (this.props.selected) {
            classes.push("Region-selected");
        } else if (this.props.matching) {
            classes.push("Region-matching");
        }
        const style = {
            left: this.props.location.x,
            top: this.props.location.y
        };
        const id = convertNameToId(this.props.name);
        const label = this.props.name.split("\n").map((w, i) => (<div key={i}>{w}</div>));
        return (
            <div id={id} className={classes.join(" ")} style={style} draggable={this.props.draggable} onDragStart={this.onDragStart}>{label}</div>
        );
    }
}

export default RegionComponent;