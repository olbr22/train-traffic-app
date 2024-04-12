// router import
import Router from "./router.js";
// navigation import
import Navigation from "./navigation.js";


customElements.define("router-outlet", Router);
customElements.define("navigation-outlet", Navigation);

// component imports
import SingleTrain from "./components/train-single.js";
import DelayedTrainsList from "./components/train-list.js";
import MapView from "./components/map-view.js";


import LoginForm from "./components/login-form.js";
import FavoriteStationAdder from "./components/favorite-station-adder.js";
import FavoriteStationRemover from "./components/favorite-station-remover.js";
import FavoriteStation from "./components/favorite-station.js";
import FavoriteStationList from "./components/favorite-station-list.js";
// search
import SearchComponent from "./components/search-component.js";

// Define comonents
customElements.define("train-single", SingleTrain);
customElements.define("train-list", DelayedTrainsList);
customElements.define("map-view", MapView);


customElements.define("login-form", LoginForm);
customElements.define("favorite-station-adder", FavoriteStationAdder);
customElements.define("favorite-station-remover", FavoriteStationRemover);
customElements.define("favorite-station", FavoriteStation);
customElements.define("favorite-station-list", FavoriteStationList);
// search
customElements.define("search-component", SearchComponent);



// view imports
import LoginView from "./views/login.js";
import FavoriteStations from "./views/favorite-stations.js";
import TrafficInfoView from "./views/traffic-info-view.js";

// Define views
customElements.define("login-view", LoginView);
customElements.define("favorite-stations-view", FavoriteStations);
customElements.define("traffic-info-view", TrafficInfoView);
