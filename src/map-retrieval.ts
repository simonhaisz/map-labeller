const toBase64 = (buffer: ArrayBuffer): string => {
    const base64 = btoa(new Uint8Array(buffer).reduce((d, b) => d + String.fromCharCode(b), ""));
    return base64;
};

const retrieveMap = (name: string, useTemplate: boolean = false): Promise<IMap> => {
    return new Promise<IMap>((resolve, reject) => {
        const publicUrl = `data/${name}-${useTemplate ? "template" : "map"}.json`;
        const privateUrl = `http://localhost:8080/maps/${name}`;
        fetch(publicUrl)
            .then(r => r.json())
            .then(mapData => {
                fetch(`data/${name}-image.png`)
                    .then(r => r.arrayBuffer())
                    .then(buffer => {
                        const imageData = toBase64(buffer);
                        let regions: IRegion[];
                        if (useTemplate) {
                            regions = mapData.regions.map((r: string, i: number) => ({
                                name: r,
                                location: { x: 50, y: 50 + i * 50 }
                            }));
                        } else {
                            regions = mapData.regions;
                        }
                        const map: IMap = {
                            id: mapData.id,
                            name: mapData.name,
                            image: {
                                data: imageData,
                                width: mapData.width,
                                height: mapData.height
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

const saveMap = (map: IMap): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const privateUrl = `http://localhost:8080/maps/${map.id}`;
        fetch(privateUrl, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(map)
        })
        .then(res => resolve())
        .catch(err => reject(err));
    })
}

export {
    retrieveMap,
    saveMap
}