import { useMap } from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";

interface Props {
  place: google.maps.places.PlaceResult | null;
  setPosition: Function;
}

const MapHandler = ({ place, setPosition }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !setPosition) return;
    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
      const data = {
        lat: map.getCenter()?.lat(),
        lng: map.getCenter()?.lng(),
      };
      setPosition(data);
    }
  }, [map, place, setPosition]);

  return null;
};

export default React.memo(MapHandler);
