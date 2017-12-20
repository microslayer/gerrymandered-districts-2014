#!/bin/bash

# Converts a shapefile to GeoJSON
# Run as ./transform_shp_to_geojson

# Be sure to replace `inputfile` and `outputfile`
# variables if need be

inputfile='US_114_Congressional_Districts/US_114_Congressional_District.shp'
outputfile='../web/data/us_districts_2014.geojson'

# converts the file to geojson
# keeps OBJECTID, Roundness, RoundnessL, StateFP, CD114FP fields
# simplifies the shapes
cmd='ogr2ogr -f GeoJSON -t_srs crs:84 $outputfile $inputfile -SELECT OBJECTID,Roundness,RoundnessL,StateFP,CD114FP -SIMPLIFY 1500'

eval $cmd