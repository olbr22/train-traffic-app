import stations from "./stations.js";
import {removeDuplicatesByTrainNo} from "../utils.js";

const trains = {
    fetchData: async function() {
        const response = await fetch(`https://trafik.emilfolino.se/delayed`);
        const result = await response.json();

        return result.data;
    },
    delayedTrainsInfo: async function() {
        const delayedTrains = await this.fetchData();
        // const stationsData = await stations.stationsInfo();
        const stationsData = await stations.stationsInfo();
        let result = [];

        for (const train of delayedTrains) {
            // fillter out trains without from location
            if (train.FromLocation) {
                // if train has location name, get info about station
                // and combine info about station and train as an object into array
                const advertisedTime = train.AdvertisedTimeAtLocation.match(/\d{2}:\d{2}/) || [];
                const estimatedTime = train.EstimatedTimeAtLocation.match(/\d{2}:\d{2}/) || [];

                result.push({
                    "TrainNo": train.AdvertisedTrainIdent,
                    "From": stationsData[train.FromLocation[0].LocationName].AdvertisedLocationName,
                    "To": stationsData[train.ToLocation[0].LocationName].AdvertisedLocationName,
                    "AdvertisedTimeAtLocation": advertisedTime,
                    "EstimatedTimeAtLocation": estimatedTime,
                    "GeoLocation": stationsData[train.FromLocation[0].LocationName].GeoLocation
                });
            }
        }
        // console.log("Result:", removeDuplicatesByTrainNo(result));
        return removeDuplicatesByTrainNo(result);
    }
};

export default trains;
