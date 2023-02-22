// creating frame
// declare constant
const FRAME_HEIGHT = 500
const FRAME_WIDTH = 500
const MARGINS = {left:50, right:50, top:50, bottom:50};


// Create height and width variables
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select('#vis1')
     .append('svg')
     .attr('height',FRAME_HEIGHT)
     .attr('width', FRAME_WIDTH)
     .attr('class','frame')


//Reading from file
d3.csv("data/scatter-data.csv").then((data) => {


 const MAX_X = d3.max(data, (d) => {return parseInt(d.x)});
 const MAX_Y = d3.max(data, (d) => {return parseInt(d.x)});


 const X_SCALE = d3.scaleLinear() 
                     .domain([0, MAX_X + 1])
                     .range([0, VIS_HEIGHT]); 

 const Y_SCALE = d3.scaleLinear() 
                     .domain([0, MAX_Y + 1]) 
                      .range([VIS_HEIGHT, 0]); 


   // plot points
   FRAME1.selectAll("points")  
       .data(data)  
       .enter()
       //loop       
       .append("circle")
         .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
         .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.bottom); }) 
         .attr("r", 10)
         .attr("class", "point"); 

      // Create function to add border
   // function to change color of point on hover
    function hoverColor(){
     d3.select(this)
     .style("fill", "orange");
    };


    // function to remove color after hovered
    function revertColor(){
     d3.select(this)
     .style("fill", "blue");
    };
  


  // Add event listeners
    FRAME1.selectAll(".point")
           .on("mouseover", hoverColor) 
          .on("mouseleave", revertColor)
          .on("click", function() {
  // Check if the point already has a border
  var hasBorder = d3.select(this).attr("stroke") === "black";
  
  // If the point has a border, remove it. Otherwise, add a border.
  if (hasBorder) {
    d3.select(this).attr("stroke", null);
  } else {
    d3.select(this).attr("stroke", "black")
                   .attr("stroke-width", "4");
  }
});    

     // add x axis
   FRAME1.append("g") 
    //move the axis down to the page
         .attr("transform", "translate(" + MARGINS.left + 
               "," + (VIS_HEIGHT + MARGINS.top) + ")") 
         .call(d3.axisBottom(X_SCALE).ticks(10)) 
           .attr("font-size", '20px'); 

   // add y axis
  FRAME1.append("g") 
   // move the axis to the left
        .attr("transform", "translate(" + (MARGINS.left) + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE).ticks(10)) 
          .attr("font-size", '20px'); 


    });
