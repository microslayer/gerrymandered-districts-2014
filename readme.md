# Gerrymandering Visualization
A visualization of gerrymandered districts, written in d3.js and Python 3.

## Requirements
- Python 3  
- gdal 

## Directions 
Run `start.py`, either in an IDE or by by entering `python start.py`. 

## Creation
I used gdal to convert and simplify the shapefile to a geojson file with the following command:
```ogr2ogr -f GeoJSON -t_srs crs:84 us_districts.geojson US_114_Congressional_District.shp -SELECT Roundness,RoundnessL -SIMPLIFY 1500```. 