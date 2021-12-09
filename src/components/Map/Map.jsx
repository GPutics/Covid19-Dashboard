import React from 'react';

//helpers
import { showDataOnMap } from '../../helpers';

//styles
import './Map.modal.scss';

import { Map as LeafletMap, TileLayer } from "react-leaflet";

const Map = ({center, zoom, countries, casesType}) => {
    return (
        <div className="map">
        <LeafletMap center={center} zoom={zoom} >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {showDataOnMap(countries, casesType)}
        </LeafletMap>
        </div>
    )
}

export default Map
