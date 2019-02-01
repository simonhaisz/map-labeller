import React, { Component } from "react";
import "./SearchResults.css";

type Props = {
    matches: string[];
    selectMatch: (match: string) => void;
};

type State = {
    selectedIndex: number;
};

class SearchResults extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        // if length is zero we'll ignore selectedIndex and render null
        this.state = { selectedIndex: 0 };
    }

    nextMatch = () => {
        this.changeMatch(1);
    }

    previousMatch = () => {
        this.changeMatch(-1);
    }

    currentMatch = () => {
        this.props.selectMatch(this.props.matches[this.state.selectedIndex]);
    }

    private changeMatch(mod: number) {
        const nextIndex = (this.state.selectedIndex + mod) % this.props.matches.length;
        this.setState(state => ({...state, selectedIndex: nextIndex}));
        const nextMatch = this.props.matches[nextIndex];
        this.props.selectMatch(nextMatch);
    }

    render() {
        return (
            <div className="SearchResults">
                <div className="SearchResults-previous-button" onClick={this.previousMatch}>&lt;</div>
                <div className="SearchResults-selected" onClick={this.currentMatch}>{this.props.matches[this.state.selectedIndex]}</div>
                <div className="SearchResults-next-button" onClick={this.nextMatch}>&gt;</div>
            </div>
        );
    }
}

export default SearchResults;