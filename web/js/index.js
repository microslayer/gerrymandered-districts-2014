// width and height of map
var width = 960;
var height = 500;

var state_fips;
var features;

$.getJSON("data/state_fips.json", function(d) {
    state_fips = d;
})

var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([900]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

var color = d3.scale.linear()
            .domain([.6, .75, .9, 1])
            .range(["#e2e2e2", "#e2e2e2", "#123b94", "#07193e"])

var svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

var div = d3.select("#map")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

var dstctMapSVG = d3.select("#dstct_map")
		 	.append("svg")
			.attr("width", 300)
			.attr("height", 200);

d3.json("data/us_districts_2014.geojson", function(json) {
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<div style='margin-bottom:-7px;'><strong>Roundness:</strong> <span>" + round10(d.properties.Roundness) + "</span></div>"
         + "<br><strong>RoundnessL:</strong> <span>" + round10(d.properties.RoundnessL) + "</span>";
      })

    svg.call(tip);

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .text(function(d) { return d.Roundness; })
        .style("stroke-width", ".5")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function(d) { showElm(d);  })
        .style("fill", function(d) {
            var roundness = d.properties.Roundness;
            var roundness_l = d.properties.RoundnessL;
            var value = 1-roundness;
            return color(value);
    });

    // get top 10 sorted by Roundness
    json.features.sort(function(a,b) {
        return a.properties.Roundness - b.properties.Roundness;
    });
    top10 = json.features.slice(0, 10);
    displayTop10(top10);

    // display top 10 panel
    function displayTop10(top10) {
        var elm = $("#topten");

        for (dist of top10) {
             var id           = dist.properties.OBJECTID
             var roundness    = round10(dist.properties.Roundness)
             var roundness_l  = round10(dist.properties.RoundnessL)
             var state        = state_fips[dist.properties.STATEFP]
             var district_num = dist.properties.CD114FP

             var l = $(`<li id="${id}"><strong>${state} ${district_num}</strong><br>Roundness: ${roundness}<br>RoundnessL: ${roundness_l}</li>`);

            elm.append(l)
        }
    }

    // on top 10 element click, show in sidebar
    $("#topten li").click(function() {
        var id = $(this).attr('id');

        var d = json.features.filter(function(geojsonObj) {
          return geojsonObj.properties.OBJECTID == id;
        })[0];

        showElm(d);
    })


    // show district info in sidebar
    function showElm(d) {
         var elm = $("#dist_info");

         // hide panel if user clicked on the same district twice
         if (elm.is(':visible') && d.properties.OBJECTID == elm.attr('dist-id')) {
             elm.fadeOut();
             return;
         }

         // elements
         var elm_info = $("#dist_info #info");
         var elm_title = $("#dist_info #title");

         // district properties
         var id = d.properties.OBJECTID
         var roundness = round10(d.properties.Roundness)
         var roundness_l = round10(d.properties.RoundnessL)
         var state = state_fips[d.properties.STATEFP]
         var district_num = d.properties.CD114FP

         // place properties in panel
         elm.attr('dist-id', id)
         elm_title.text(state + " " + district_num);
         elm_info.html('Roundness: '+roundness+'<br>RoundnessL: '+roundness_l+'<br>');

         // show panel
         elm.fadeIn();

		// fit the size to the div/svg area
		dProj = d3.geoAlbersUsa()
					.fitSize([300,200], d);

		dPath = d3.geo.path()
					.projection(dProj);

		dstctMapSVG.selectAll("*")
			.remove();

		dstctMapSVG.append("path")
			.datum(d)
			.attr("d", dPath);
    }

    // rounds to two decimal places
    function round10(num) {
        return Math.round(num * 100) / 100
    }
});

$("nav li a").click(function() {
    var elm = $(this).parents("li").text().replace(" ", "").toLowerCase();

    if (elm != "topten") {
        $(".container div").hide();
        $("#" + elm).fadeIn();
    } else {
        // top ten side list
        if (!$("#topten").is(":visible")) {
            if ($("#credits").is(":visible"))
                $("credits").fadeOut();
            if (!$("#map").is(":visible"))
                $("map").fadeIn();
            $("#topten").fadeIn();
        } else {
            $("#topten").fadeOut();
        }
    }
})
