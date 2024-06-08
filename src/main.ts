import './style.css';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';
import {Loader} from '@googlemaps/js-api-loader';
import {load} from '@loaders.gl/core';
import {KMLLoader} from '@loaders.gl/kml';
import {GeoJsonLayer, PathLayer} from '@deck.gl/layers';

import beer from './assets/beer.json';
import day1Url from './assets/history-2024-06-01.kml?url';
import day2Url from './assets/history-2024-06-02.kml?url';
import day3Url from './assets/history-2024-06-03.kml?url';
import day4Url from './assets/history-2024-06-04.kml?url';
import day5Url from './assets/history-2024-06-05.kml?url';
import day6Url from './assets/history-2024-06-06.kml?url';
import {GeoJSONTable, LineString, Position} from '@loaders.gl/schema';
import BeerMeterElement from './components/beer-meter/beer-meter';
import {PathGeometry} from '@deck.gl/layers/dist/path-layer/path';
import InfoPanelElement from './components/info-panel/info-panel';

type Coord = {
  coord: Position;
  time: number;
};

type Path = {type: string; coords: Coord[]};

const infoPanel = document.querySelector<InfoPanelElement>('info-panel')!;
const beerMeterFlo = document.querySelector<BeerMeterElement>('#flo')!;
const beerMeterNico = document.querySelector<BeerMeterElement>('#nico')!;

const startDate = '2024-06-01T05:54:38.000Z';
const endDate = '2024-06-07T00:34:44.000Z';

let currentTime = new Date(startDate).getTime();

let map: google.maps.Map;

const deck = new GoogleMapsOverlay({});
const fullPath: Path[] = [];

let paused = false;

main();

async function main() {
  const loader = new Loader({
    apiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
    version: 'weekly'
  });

  await loader.importLibrary('maps');

  map = new google.maps.Map(document.querySelector('#map') as HTMLElement, {
    zoom: 12,
    center: {lat: 53.551700397727224, lng: 9.948575928463582},
    mapId: '5f4a45c9d07c538c',
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    clickableIcons: false
  });

  map.addListener('drag', () => (infoPanel.autoPan = false));

  await loadTripData();

  deck.setMap(map);

  google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
    setInterval(tick, 50);
  });
}

async function loadTripData() {
  const data = (await load(day1Url, KMLLoader)) as GeoJSONTable;
  const day2 = (await load(day2Url, KMLLoader)) as GeoJSONTable;
  const day3 = (await load(day3Url, KMLLoader)) as GeoJSONTable;
  const day4 = (await load(day4Url, KMLLoader)) as GeoJSONTable;
  const day5 = (await load(day5Url, KMLLoader)) as GeoJSONTable;
  const day6 = (await load(day6Url, KMLLoader)) as GeoJSONTable;

  data.features = data.features.concat(
    day2.features,
    day3.features,
    day4.features,
    day5.features,
    day6.features
  );

  const paths = data.features.filter((f) => f.geometry.type === 'LineString');

  for (const path of paths) {
    const coords = (path.geometry as LineString).coordinates;
    const pathStartTime = new Date(path.properties!.timespan.begin).getTime();
    const pathEndTime = new Date(path.properties!.timespan.end).getTime();
    const timeStep = (pathEndTime - pathStartTime) / (coords.length - 1);

    const pathSteps = {
      type: path.properties!.name as string,
      coords: coords.map((coord, i) => ({
        coord,
        time: pathStartTime + i * timeStep
      }))
    };

    fullPath.push(pathSteps);
  }
}

function tick() {
  if (infoPanel.paused) return;

  const drunkBeers = beer.filter((b) => new Date(b.date).getTime() < currentTime);
  const completedPath = fullPath
    .filter((p) => p.coords[0].time <= currentTime)
    .map((p) => ({
      ...p,
      coords: p.coords.filter((c) => c.time <= currentTime)
    }));

  beerMeterFlo.count = drunkBeers.filter((b) => b.by === 'F' || b.by === 'both').length;
  beerMeterNico.count = drunkBeers.filter((b) => b.by === 'N' || b.by === 'both').length;

  const layer = new PathLayer<Path>({
    id: 'path' + currentTime,
    data: completedPath,
    getPath: (p) => p.coords.map((c) => c.coord) as PathGeometry,
    getColor: (p) => (p.type === 'Walking' ? [235, 168, 36] : [245, 236, 218]),
    widthMinPixels: 3
  });

  deck.setProps({layers: [layer]});

  if (infoPanel.autoPan) {
    const lastPath = completedPath[completedPath.length - 1];
    if (lastPath.type === 'On a train') map.setZoom(9);
    else map.setZoom(12);

    const liveCoord = lastPath.coords[lastPath.coords.length - 1].coord;
    map.panTo({lat: liveCoord[1], lng: liveCoord[0]});
  }

  currentTime += 1e5;
  if (currentTime >= new Date(endDate).getTime()) infoPanel.paused = true;
}
