import React, { Component, DragEvent } from 'react';
import "./Region.css";

type Props = IRegion;
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
        return (
            <div className={classes.join(" ")} style={style} draggable onDragStart={this.onDragStart}>{this.props.name}</div>
        );
    }
}

export default RegionComponent;