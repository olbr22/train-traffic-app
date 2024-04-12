export default class SingleTrain extends HTMLElement {
    static get observedAttributes() {
        return ["train"];
    }

    get train() {
        return JSON.parse(this.getAttribute("train"));
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="table-row">
                <div class="column column-25 time">
                    <span class="stacked-content advertised-time line-through">
                        ${this.train.AdvertisedTimeAtLocation}
                    </span>
                    <span class="stacked-content estimated-time">
                        ${this.train.EstimatedTimeAtLocation}
                    </span>
                </div>
                <div class="station-from column column-25">
                    <div class="station-name text-align-left">
                        ${this.train.From}
                    </div>
                    <favorite-station-adder station= '${JSON.stringify(this.train)}'>
        </favorite-station-adder>
                </div>
                <div class="column column-25 text-align-left">
                    ${this.train.To}
                </div>
                <div class="column column-25 text-align-center">
                    ${this.train.TrainNo}
                </div>
            </div>
        `;
    }
}
