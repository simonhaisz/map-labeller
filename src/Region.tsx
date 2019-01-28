import React, { Component, DragEvent } from 'react';
import "./Region.css";

type Props = {
    name: string;
    location: ILocation;
    matching?: boolean;
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
        if (this.props.matching) {
            classes.push("Region-matching");
        }
        const style = {
            left: this.props.location.x,
            top: this.props.location.y
        };
        const label = this.props.name.split("\n").map((w, i) => (<div key={i}>{w}</div>));
        return (
            <div className={classes.join(" ")} style={style} draggable={this.props.draggable} onDragStart={this.onDragStart}>{label}</div>
        );
    }
}

export default RegionComponent;