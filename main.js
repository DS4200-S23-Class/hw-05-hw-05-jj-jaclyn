let points = document.getElementsByTagName("circle");

// loop to make second click unavaible 
for (let i = 0; i < points.length; i++) {
    
    // check each point for clicks
    let point = points[i];
    point.addEventListener("click", function(){

                  // click then add border
                  this.classList.toggle("Border");

                  //find the cx and cy
                  let cx = this.getAttribute("cx") / 50;
                  let cy = (500 - this.getAttribute("cy")) / 50;

                  // create new text
                  let text1 = "Last point clicked: "
                  let text2 = "(" + cx +"," + cy + ")"
  
                  // show the text information
                  document.getElementById("text1").innerHTML = text1;
                  document.getElementById("text2").innerHTML = text2;
}
)}

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







//bar plot
const FRAME2= d3.select("#vis2") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 



// Reading from a file
d3.csv("data/bar-data.csv").then((data) => { 

    const MAX = d3.max(data, (d) => { return parseInt(d.amount); });

    const X_SCALE = d3.scaleBand() 
                    .domain(data.map((d) => { return d.category; })) 
                    .range([0, VIS_WIDTH])
                    .padding(.2); 
           
    const Y_SCALE = d3.scaleLinear() 
                      .domain([MAX + 10, 0]) 
                      .range([0, VIS_HEIGHT]); 



    FRAME2.selectAll("bar")  
          .data(data) 
          .enter()       
          .append("rect")  
            .attr("y", (d) => { return Y_SCALE(d.amount) + MARGINS.bottom; }) 
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left;}) 
            .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE(d.amount); })
            .attr("width", X_SCALE.bandwidth())
            .attr("class", "bar");



   // add x axis 
   FRAME2.append("g") 
     //move the axis down to the page
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE))
          .attr("font-size", '20px'); 


  // add y axis
  FRAME2.append("g") 
    //move the axis down to the page
        .attr("transform", "translate(" + (MARGINS.left) + 
              "," + (MARGINS.top) + ")") 
        .call(d3.axisLeft(Y_SCALE).ticks(10)) 
          .attr("font-size", '20px'); 


  const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 


    //mouseover
    function handleMouseover(event, d) {

    //tooltip not longer transparent when mouseover
      TOOLTIP.style("opacity", 1);

      // change bar color
      d3.select(this)
        .style("fill", "orange");

    };

    function handleMousemove(event, d) {

      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
              .style("left", (event.pageX + 10) + "px") 
              .style("top", (event.pageY - 50) + "px"); 
     
    };

    function handleMouseleave(event, d) {

      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 

      //revert to original bar color
      d3.select(this)
        .style("fill", "blue");
    };

    // add event listners to the point
    // only call when event occur
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) 
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);    


});
