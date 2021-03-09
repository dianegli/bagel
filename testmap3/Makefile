build/gz_2010_us_050_00_20m.zip:
	mkdir -p $(dir $@)
	curl -o $@ http://www2.census.gov/geo/tiger/GENZ2010/$(notdir $@) -L

build/gz_2010_us_050_00_20m.shp: build/gz_2010_us_050_00_20m.zip
	unzip -od $(dir $@) $<
	touch $@

#ogr2ogr -f "GeoJSON" build/gz_2010_us_050_00_20m.json build/gz_2010_us_050_00_20m.shp

# https://bost.ocks.org/mike/bubble-map/#finding-boundaries
