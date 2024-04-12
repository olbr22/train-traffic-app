const stations = {
    getData: async function() {
        const response = await fetch(`https://trafik.emilfolino.se/stations`);
        const result = await response.json();

        return result.data;
    },
    stationsInfo: async function() {
        const stations = await this.getData();
        const result = {};

        stations.forEach(station => {
            result[station.LocationSignature] = {
                ...station,
                "GeoLocation": station.Geometry.WGS84.match(/-?\d+\.\d+/g) || []
            };
        });
        // console.log(result);
        return result;
    }
};

export default stations;
