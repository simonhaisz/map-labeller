interface ILocation {
    x: number;
    y: number;
}

interface IRegion {
    name: string;
    location: ILocation;
    matching?: boolean;
}

interface IImage {
    data: string;
    width: number;
    height: number;
}

interface IMap {
    name: string;
    image: IImage;
    regions: IRegion[];
}