#!/bin/bash

# Converts a GeoJSON file to TopoJSON
# Run as ./transform_geojson_to_topojson

# Assumes TopoJSON is installed
# Installation: gis.stackexchange.com/questions/45138#232332

# Be sure to replace `inputfile` and `outputfile`
# variables if need be

inputfile='../web/data/us_districts_2014.geojson'
outputfile='../web/data/us_districts_2014.topojson'

cmd='geo2topo $filename > $outputfile'
eval $cmd