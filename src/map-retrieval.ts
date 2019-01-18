const toBase64 = (buffer: ArrayBuffer): string => {
    const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ""));
    return base64;
};

const retrieveMap = (name: string): Promise<IMap> => {
    return new Promise<IMap>((resolve, reject) => {
        fetch(`/data/${name}.json`)
            .then(r => r.json())
            .then(mapData => {
                fetch(`/data/${name}.png`)
                    .then(r => r.arrayBuffer())
                    .then(buffer => {
                        const imageData = toBase64(buffer);
                        const regions: IRegion[] = mapData.regions.map((r: string, i: number) => ({
                            name: r,
                            location: { x: 50, y: 50 + i * 50 }
                        }));
                        const map: IMap = {
                            name: mapData.name,
                            image: {
                                data: imageData,
                                width: 2124,
                                height: 1754
                            },
                            regions
                        };
                        resolve(map);
                    })
                    .catch(error => reject(error))
            
            })
            .catch(error => reject(error));
    });
};

export {
    retrieveMap
}