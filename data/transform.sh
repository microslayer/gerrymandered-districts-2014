#!/bin/bash
cmd='ogr2ogr -f GeoJSON -t_srs crs:84 ../web/data/us_districts.geojson US_114_Congressional_Districts/US_114_Congressional_District.shp -SELECT OBJECTID,Roundness,RoundnessL,StateFP,CD114FP -SIMPLIFY 1500'
eval $cmd