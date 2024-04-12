import trains from "../models/trains.js";

export default class DelayedTrainsList extends HTMLElement {
    constructor() {
        super();
        this.trains = [];
    }

    async connectedCallback() {
        this.trains = await trains.delayedTrainsInfo();
        // listen for the search event from the search component
        document.addEventListener("search", (event) => {
            const searchQuery = event.detail;

            this.render(this.trains, searchQuery);
        });
        // render the list of trains
        this.render(this.trains);
    }

    async render(trains, searchQuery = null) {
        const result = await this.getFilteredTrains(trains, searchQuery);

        if (result === "") {
            this.innerHTML = `<p>Det finns inga tåg att visa</p>`;
            return;
        }

        this.innerHTML = `
        <div class="table delays">
        <div class="table-row first-row">
            <div class="column column-25 text-align-left time">Tid</div>
            <div class="column column-25 text-align-left">Från</div>
            <div class="column column-25 text-align-left">Till</div>
            <div class="column column-25 text-align-center">Tåg</div>
        </div>
        ${result}
        </div>`;
    }

    async getFilteredTrains(trains, searchQuery) {
        let result = "";

        if (searchQuery !== null) {
            const station = new RegExp(searchQuery, "i");
            const filteredStations = trains.filter((train) => station.test(train.From));

            result = filteredStations.map((train) =>
                `<train-single train='${JSON.stringify(train)}'>
            </train-single>`
            ).join("");
        } else {
            result = trains.map((train) =>
                `<train-single train='${JSON.stringify(train)}'></train-single>`
            ).join("");
        }
        return result;
    }
}
