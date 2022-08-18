let [countyURL, educationURL, req] = ['https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json',
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json', new XMLHttpRequest()];

let countyData, educationData;

let [canvas, tooltip] = [d3.select('#canvas'), d3.select('#tooltip')]

let drawMap = () => {


    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .style('fill', (countyDataEl) => {
            const county = educationData.find((el) => el.fips === countyDataEl.id);
            let percentage = county.bachelorsOrHigher;

            return percentage <= 15 ? '#CFE2CE'
                : percentage <= 30 && percentage > 15 ? '#012909' :
                    percentage <= 45 && percentage > 30 ? 'lightgreen' : '#6B9D4A';
        })
        .attr('data-fips', (el) => el.id)
        .attr('data-education', (countyDataItem) => educationData.find((el) => el.fips === countyDataItem['id']).bachelorsOrHigher)
        .on('mouseover', (countyDataItem) => {
            tooltip.transition()
                .style('visibility', 'visible')

            let county = educationData.find((el) => el.fips === countyDataItem.id);

            tooltip.text(county.fips + ' - ' + county.area_name + ', ' +
                county.state + ' : ' + county.bachelorsOrHigher + '%')

            tooltip.attr('data-education', county.bachelorsOrHigher)
        })
        .on('mouseout', () => {
            tooltip.transition()
                .style('visibility', 'hidden')
        });
    //console.log(1);
}

req.open('GET', countyURL, true);
req.onload = () => {
    let countyJsonData = JSON.parse(req.responseText);
    countyData = topojson.feature(countyJsonData, countyJsonData.objects.counties).features;
    console.log(countyData);

    req.open('GET', educationURL, true);
    req.onload = () => {
        educationData = JSON.parse(req.responseText);
        console.log(educationData);
        drawMap();
    }
    req.send();
}
req.send();
// d3.json(countyURL).then(
//     (data, error) => {
//         if (error) {
//             console.log(log)
//         } else {
//             countyData = topojson.feature(data, data.objects.counties).features
//             console.log(countyData)

//             d3.json(educationURL).then(
//                 (data, error) => {
//                     if (error) {
//                         console.log(error)
//                     } else {
//                         educationData = data
//                         console.log(educationData)
//                         drawMap()
//                     }
//                 }
//             )
//         }
//     }
// )