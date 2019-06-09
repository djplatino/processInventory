/*
Jose Gilberto Ponce
5/24/2019
www.poncesolutions.como
Java Script to process inventory from Physical Retail Inventory
*/
$(document).ready(function() {


  console.log($(".container-fluid").width());
  var fluidWidth = $(".container-fluid").width();
  /*
    <input name="inventory-end-date" id="inventory-end-date" class="form-control"
                                placeholder="Select date" type="date">
    */

  // Start instead of clicking
  // $( "#home-start-inventory-button" ).click(function() {
  // alert( "Handler for .click() called." );
  // });
  // $('#home-start-inventory-button').modal("show");

  // $('#modal-add-inventory').modal('show')

  // We are going to place here functions related to inventory
  // Start inventory

  // $('#home-start-inventory-button').click();

  // All dropdown-items will be handled here

  // It will start with nothing until it is created or selected
  var inventories = [];
  var auditors = [];
  var supervisors = [];
  var times = [];
  var dates = [];
  var customers = [];
  var inventoryCounts = [];
  var filesToDelete = [];
  var itemMasterToDelete = "";
  


  var ndx;
  var tableChart;
  var allDim;
  var searchDim;

  var auditorsDim;
  var auditorsGroup;
  var filesDim;
  var filesGroup;
  var areasDim;
  var areasGroup;

  retrieveInventoryCounts();


  setTimes(15)
  setDates(10)
  console.log(dates)

  if (isDateSupported()) {
      console.log('Date is supported')
      d3.select('#inventory-end-date-holder')
          .append('input')
          .attr('name', 'inventory-end-date')
          .attr('id', 'inventory-end-date')
          .attr('class', 'form-control')
          .attr('type', 'date')
      d3.select('#inventory-start-date-holder')
          .append('input')
          .attr('name', 'inventory-start-date')
          .attr('id', 'inventory-start-date')
          .attr('class', 'form-control')
          .attr('type', 'date')
  } else {
      console.log('Date is not supoorted')
      d3.select('#inventory-end-date-holder')
          .append('select')
          .attr('class', 'form-control')
          .attr('id', 'end-date-menu')
      d3.select('#inventory-start-date-holder')
          .append('select')
          .attr('class', 'form-control')
          .attr('id', 'start-date-menu')

      setMenu('end-date-menu', dates)
      setMenu('start-date-menu', dates)
  }
  // <select class="form-control" id="start-time-menu">
  // </select>

  setMenu('start-time-menu', times)
  setMenu('end-time-menu', times)

  var currentInventory = {
      id: 0,
      customer_id: 0,
      customer_name: '',
      supervisor_id: '',
      start_date_time: 0,
      auditor_name: '',
      start_date: '',
      start_time: '',
      end_date_time: 0,
      end_date: '',
      end_time: '',
      is_selected: false,
      comments: ''
  }

  /*
    $("#customer-menu" ).change(function() {
        //$( "#inventory-menu:selected" ).each(function() {
            console.log(this.value);
            currentInventory.customer_id = this.value * 1;
            console.log(currentInventory);
        //  });

    });
    */

  $("#chart-reset-button").click(function(e) {
      console.log("clicked");
      dc.filterAll();
      dc.renderAll();
  })

  $("#column-seq").click(function(e) {
      e.preventDefault();
      console.log("clicked");
  })

  $('#inventory-menu').change(function() {
      // $( "#inventory-menu:selected" ).each(function() {
      enableUdateButton();
      retrieveInventoryCounts();
      //  });
  })
  /*
    $("#inventory-end-date").change(function(){
        console.log(this.value);
        currentInventory.start_date = this.value;

    });
    $("#inventory-end-time").change(function(){
        console.log(this.value);
        currentInventory.start_time = this.value;

    });

    $("#inventory-start-date").change(function(){
        console.log(this.value);
        currentInventory.end_date = this.value;
    });

    $("#inventory-start-time").change(function(){
        console.log(this.value);
        currentInventory.end_time = this.value;
        console.log(currentInventory);

    });

    $("#supervisor-menu" ).change(function() {
        //$( "#inventory-menu:selected" ).each(function() {
            console.log(this.value);
            currentInventory.supervisor_id = this.value;
        //  });

    });
    */
  $('#inventory-auditors-button').click(function(e) {
      e.preventDefault();
      console.log(ndx.size());
      $('#main-chart').empty()
      var chart = dc.pieChart('#main-chart');
      chart
          .width(fluidWidth)
          .height(480)
          .slicesCap(4)
          .innerRadius(100)
          .externalLabels(50)
          .externalRadiusPadding(50)
          .drawPaths(true)
          .dimension(auditorsDim)
          .group(auditorsGroup)
          .legend(dc.legend());
      // example of formatting the legend via svg
      // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      chart.on('pretransition', function(chart) {
          chart.selectAll('.dc-legend-item text')
              .text('')
              .append('tspan')
              .text(function(d) {
                  return d.name;
              })
              .append('tspan')
              .attr('x', 150)
              .attr('text-anchor', 'end')
              .text(function(d) {
                  return d.data;
              });
      });
      chart.render();
      /*
      chart
          .width(fluidWidth)
          .height(480)
          .slicesCap(4)
          .innerRadius(100)
          .dimension(auditorsDim)
          .group(auditorsGroup)
          .legend(dc.legend())
          // workaround for #703: not enough data is accessible through .label() to display percentages
          .on('pretransition', function (chart) {
          chart.selectAll('text.pie-slice').text(function (d) {
              return (
              d.data.key +
              ' ' +
              dc.utils.printSingleValue(
                  ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
              ) +
              '%'
              )
          })
          })
      chart.render();
      */
  })

  $('#inventory-files-button').click(function(e) {
      e.preventDefault();
      console.log(ndx.size());
      $('#main-chart').empty()
      var chart = dc.pieChart('#main-chart');
      chart
          .width(fluidWidth)
          .height(480)
          .slicesCap(4)
          .innerRadius(100)
          .externalLabels(50)
          .externalRadiusPadding(50)
          .drawPaths(true)
          .dimension(filesDim)
          .group(filesGroup)
          .legend(dc.legend());
      // example of formatting the legend via svg
      // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      chart.on('pretransition', function(chart) {
          chart.selectAll('.dc-legend-item text')
              .text('')
              .append('tspan')
              .text(function(d) {
                  //console.log(d);
                  //console.log(d.inv_file_name);
                  return d.name;
              })
              .append('tspan')
              .attr('x', 150)
              .attr('text-anchor', 'end')
              .text(function(d) {
                  return d.data;
              });
      });
      chart.render();
      /*
      var chart = dc.pieChart('#main-chart');
      chart
          .width(fluidWidth)
          .height(480)
          .slicesCap(4)
          .innerRadius(100)
          .dimension(filesDim)
          .group(filesGroup)
          .legend(dc.legend())
          // workaround for #703: not enough data is accessible through .label() to display percentages
          .on('pretransition', function (chart) {
          chart.selectAll('text.pie-slice').text(function (d) {
              return (
              d.data.key +
              ' ' +
              dc.utils.printSingleValue(
                  ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
              ) +
              '%'
              )
          })
          })
      chart.render();
      */
  })

  $('#inventory-areas-button').click(function(e) {
      e.preventDefault();
      console.log(ndx.size());
      $('#main-chart').empty()
      var chart = dc.pieChart('#main-chart');
      //var colorScale = d3.scale.ordinal().domain(["banana", "cherry", "blueberry"])
                                  // .range(["#eeff00", "#ff0022", "#2200ff"]);

      //pie.colors(function(d){ return colorScale(d.fruitType); });
      chart
          .width(fluidWidth)
          .height(480)
          .slicesCap(4)
          .innerRadius(100)
          .externalLabels(50)
          .externalRadiusPadding(50)
          .drawPaths(true)
          .dimension(areasDim)
          .group(areasGroup)
          
          //.colors(function(d){ return colorScale(d.fruitType); })
          .legend(dc.legend());
          //chart.colors(d3.scale.ordinal().range(['red','green','blue']));
      // example of formatting the legend via svg
      // http://stackoverflow.com/questions/38430632/how-can-we-add-legends-value-beside-of-legend-with-proper-alignment
      chart.on('pretransition', function(chart) {
          chart.selectAll('.dc-legend-item text')
              .text('')
              .on("click",function(d){
                console.log(d);
            })
              .append('tspan')
              

            .text(function(d) {
                  //console.log(d);
                  //console.log(d.inv_file_name);
                  //<i class="fa fa-trash-o" aria-hidden="true"></i>
                  return d.name ;
              })
              .append('tspan')
              .attr('x', 150)
              .attr('text-anchor', 'end')
              .text(function(d) {
                  return d.data;
              })
              //.append("i")
              //.attr("class","fa fa-trash-o text-warning")
              //.attr("aria-hidden","true");
      });
      /*
      chart.on('renderlet', function(chart) {
        chart.selectAll('rect').on('click', function(d) {
           console.log('click!', d);
        });
     });
     */
    /*
    chart.renderlet(function(_chart){
        _chart.selectAll(".pie-slice")
        .on("click",function(d){
            console.log(d);
        })
            //console.log(_chart.selectAll(".pie-slice").classed("selected"));
            //console.log(d)
            //d3.select("g.sliceActive").classed("slice5")
            //console.log(_chart.selectAll(".pie-slice"));
          //_chart.filter(null);
       // });
        
  });
  */
  
    /*
     
      chart.on('filtered.monitor', function(chart, filter) {
        // report the filter applied
        console.log("handled");
        //console.log(filter.selectAll('.clicked').data());
        console.log(filter);
        console.log(chart);
      });
      */
      
      chart.render();

      
  })

  function tableHeaderCallback(d) {
      console.log("clicked");
      console.log(d);
      var activeClass = "info";
      d3.selectAll("#inventory-entries-table th") // Disable all highlighting and icons
          .classed(activeClass, false)
          .selectAll("span")
          //.style("visibility", "hidden") // Hide glyphicon
          .select('i').remove()
      var the = d3.selectAll("#inventory-entries-table th") // Disable all highlighting and icons
          //.classed(activeClass, false)
          .selectAll("span")
          .append("i")
          .attr("class", "fa fa-sort")
          .attr("aria-hidden", "true");

      var activeSpan = d3.select(this) // Enable active highlight and icon for active column for sorting
          .classed(activeClass, true) // Set bootstrap "info" class on active header for highlight
          .select("span")
          .select('i').remove()
      //.style("visibility", "visible")
      //.append("i")
      //.attr("class",function(d){
      //    return 'fa fa-sort';
      //})
      //.attr("aria-hidden","true")
      //.select('i').remove()

      d.sort_state = d.sort_state === "ascending" ? "descending" : "ascending";

      var isAscendingOrder = d.sort_state === "ascending";

      var activeSpan = d3.select(this) // Enable active highlight and icon for active column for sorting
          .classed(activeClass, true) // Set bootstrap "info" class on active header for highlight
          .select("span")
          .append("i")
          .attr("class", function(d) {
              if (d.sort_state == "ascending") {
                  return 'fa fa-sort-up';
              } else {
                  return 'fa fa-sort-down';
              }

          })
          .attr("aria-hidden", "true");


      console.log(this);

      // Toggle sort order state to user desired state




    tableChart
      .order(isAscendingOrder ? d3.ascending : d3.descending)
      .sortBy(function (datum) {
        return datum[d.field_name];
      });
    dc.renderAll();

      //console.log(d);
      //.filter(function(d) { console.log(d);return d.label === "Qty"; })
      //.style("visibility", function(e){
      //    console.log(e)

      //})
      /*
  // Highlight column header being sorted and show bootstrap glyphicon
  var activeClass = "info";

  d3.selectAll("#dc-table-graph th") // Disable all highlighting and icons
      .classed(activeClass, false)
    .selectAll("span")
      .style("visibility", "hidden") // Hide glyphicon

  var activeSpan = d3.select(this) // Enable active highlight and icon for active column for sorting
      .classed(activeClass, true)  // Set bootstrap "info" class on active header for highlight
    .select("span")
      .style("visibility", "visible");

  // Toggle sort order state to user desired state
  d.sort_state = d.sort_state === "ascending" ? "descending" : "ascending";

  var isAscendingOrder = d.sort_state === "ascending";
  dataTable
    .order(isAscendingOrder ? d3.ascending : d3.descending)
    .sortBy(function(datum) { return datum[d.field_name]; });

  // Reset glyph icon for all other headers and update this headers icon
  activeSpan.node().className = ''; // Remove all glyphicon classes

  // Toggle glyphicon based on ascending/descending sort_state
  activeSpan.classed(
    isAscendingOrder ? "glyphicon glyphicon-sort-by-attributes" :
      "glyphicon glyphicon-sort-by-attributes-alt", true);

  updateTable();
  dataTable.redraw();
  */
  }


  $("#inventory-entries-button").click(function(e) {
      e.preventDefault();

      console.log(inventoryCounts);

      var thHeaders = new Array();


      thHeaders.push("inv_sequence");
      thHeaders.push("inv_area");
      thHeaders.push("inv_section");
      thHeaders.push("item_id");
      thHeaders.push("item_description");
      thHeaders.push("inv_quantity");


      searchDim = ndx.dimension(function(d) {
          return d.inv_auditor + " " + d.item_description + " " + d.item_id + " ^" + d.inv_area + " @" + d.inv_section
      });

      var chartSearch = dc.textFilterWidget("#search").dimension(searchDim);
      //chartSearch.placeHolder('Search for auditor');
      /*
      d3.select("#search")
      .append("div")
      .attr("class","input-group-prepend")
      .append("span")
      .attr("class","input-group-text")
      .append("i")
      .attr("class","ni ni-zoom-split-in");
      d3.select(".dc-text-filter-input")
      .attr("class","form-control");
      */
      //<span class="input-group-text"><i class="ni ni-zoom-split-in"></i></span>
      tableChart = dc.dataTable("#inventory-entries-table");

      var tableHeader = d3.select(".table-header").selectAll("th");

      // Bind data to tableHeader selection.
      tableHeader = tableHeader.data(
          [{
                  label: "Seq",
                  field_name: "inv_sequence",
                  sort_state: "ascending"
              },
              {
                  label: "Area",
                  field_name: "inv_area",
                  sort_state: "ascending"
              },
              {
                  label: "Section",
                  field_name: "inv_section",
                  sort_state: "ascending"
              },
              {
                  label: "Item",
                  field_name: "item_id",
                  sort_state: "ascending"
              },
              {
                label: "Description",
                field_name: "item_description",
                sort_state: "ascending"
              },
              {
                  label: "Qty",
                  field_name: "inv_quantity",
                  sort_state: "descending"
              } // Note Max Conf row starts off as descending
          ]
      );

      // enter() into virtual selection and create new <th> header elements for each table column
      tableHeader = tableHeader.enter()
          .append("th")
          .text(function(d) {
              return d.label;
          }) // Accessor function for header titles
          .on("click", tableHeaderCallback);

      tableHeader.filter(function(d) {
              return d.label === "Seq";
          })
          .classed("info", true);
      //<span class="btn-inner--icon"><i class="fa fa-plus" aria-hidden="true"></i></span>
      var tableSpans = tableHeader

          .append("span") // For Sort glyphicon on active table headers
          //.classed("glyphicon glyphicon-sort-by-attributes-alt", true)
          .attr("class", "float-right")
          //.style("visibility", "hidden")
          .append("i")
          .attr("class", "fa fa-sort")
          .attr("aria-hidden", "true")

          //.style("visibility", "hidden")
          .filter(function(d) {
              return d.label === "Seq";
          })
          .attr("class", "fa fa-sort-up")
      //.attr("class","bg-light")
      //.style("visibility", "visible");

      //tableHeader.filter(function(d) { return d.label === "Qty"; })
      //.classed("float-right", true);

      var columnFunctions = [
          function(d) {
              return d.inv_sequence;
          },
          function(d) {
              return d.inv_area;
          },
          function(d) {
              return d.inv_section;
          },
          function(d) {
              return d.item_id;
          },
          function(d) {
            return d.item_description;
        },
          function(d) {
              return '<span class="float-right">' + d.inv_quantity + '</span>';
          },
      ];


      tableChart
          .dimension(allDim)
          .size(Infinity)
          .section(function(d) {
              return "Area: " + d.inv_area + " Section: " + d.inv_section;
          })
          .showSections(true)
          //.columns(thHeaders)
          /*
          .columns([
              {
               label:'<span id="column-seq" onClick="alert(\'a\')" class="float-right">Seq <i class="fa fa-sort" aria-hidden="true"></i></span>',
                  format: function(d){
                   return  d.inv_sequence;
                  }
              },
              {
               label:'Area',
               format: function(d){
                   return d.inv_area;
               }
               },
               {
                   label:'Section',
                   format: function(d){
                       return d.inv_section;
                   }
               },
               {
                   label:'Item',
                   format: function(d){
                       return d.item_id;
                   }
               },
               {
                   label:'Description',
                   format: function(d){
                       return d.item_description;
                   }
               },
               {
                   label:'<span class="float-right">Qty</span>',
                   format: function(d){
                       return '<span class="float-right">' + d.inv_quantity + '</span>';
                   }
               },
               {
                   label:'<span class="float-right">Found?</span>',
                   format: function(d){
                       if (d.is_in_item_master == 0 ) {
                           return "No";
                       }
                       else {
                           return "Yes";
                       }
                   }
               },
               {
                   label:'File',
                   format: function(d){
                       return d.inv_file_name;
                   }
               },
              
          ])
          */
          .columns(columnFunctions)
          //.sortBy(function(d){
          //    return d.inv_file_name + " " + d3.format("20")(d.inv_sequence);
          //})

          //.sortBy(function(d){
          //    return d.inv_auditor +"_"+ d.inv_area + "_" + d._inv_section +"_" + d.inv_sequence;
          //})
          .sortBy(function(d) {
              return d.inv_sequence;
          })
          .order(d3.ascending)
          .on('renderlet', function(table) {
              table.select('tr.dc-table-group').remove();
          })
          .on('preRender', update_offset)
          .on('preRedraw', update_offset)
          .on('pretransition', display);
      dc.renderAll();
      /*
  var dataTable = dc.dataTable('#data-table');
      dataTable
         .dimension(allDim)
         .group(function (d) { return 'dc.js insists on putting a row here so I remove it using JS'; })
         .size(Infinity)
         .columns(thHeaders)
         .sortBy(dc.pluck('name'))
         .order(d3.ascending)
         .on('renderlet', function (table) {
                           table.select('tr.dc-table-group').remove();
                          });   
*/


  })

  $("#modal-delete-counts-toggle").click(function(e){
     updateDeleteLabels();
  });

  $("#modal-delete-inventory-button").click(function(e){

    var deleteCounts    = "N";
    var deleteFiles     = "N";
    var deleteItemMaster = "N";

    if ($('#modal-delete-counts-toggle').is(":checked")) {
        deleteCounts = "Y";
    }
    
    if ($('#modal-delete-files-toggle').is(":checked")) {
        deleteFiles  = "Y";
    }
    
    if ($('#modal-delete-item-master-toggle').is(":checked")) {
        deleteItemMaster  = "Y";
    }
    var params = {
        action: 'deleteInventory',
        "deleteCounts":deleteCounts,
        "deleteFiles": deleteFiles,
        "filesToDelete": filesToDelete,
        "deleteItemMaster": deleteItemMaster,
        "itemMasterToDelete":itemMasterToDelete,
        "fileToDelete":"",
        "areaToDelete":"",
        "sectionToDelete":"",
        "auditorToDelete":""
    }
    console.log(params)
    // $('#modal-add-inventory').modal('hide')
    executeAjax('deleteInventory', params)
  });

  $("#modal-delete-files-toggle").click(function(e){
    updateDeleteLabels();
 });
    $("#modal-delete-item-master-toggle").click(function(e){
        updateDeleteLabels();
    });

  $('#modal-delete-inventory-counts').on('show.bs.modal', function (e) {
    // do something...
    //var files = filesDim.top(Infinity);
    //var files = filesGroup.top(Infinity);
    //console.log("files");
    //console.log(files);
    //files.forEach(function(d){
    //    console.log(d);
    //})
    filesToDelete = [];
    itemMasterToDelete = "";
    $('#modal-delete-counts-toggle').prop("checked",false);
    $('#modal-delete-files-toggle').prop("checked",false);
    $('#modal-delete-item-master-toggle').prop("checked",false);
    updateDeleteLabels();
  })

  $("#page-navigation-next").click(function(e) {
      next();

  })
  $("#page-navigation-previous").click(function(e) {
      last();

  })
  

  $('#save-inventory-button').click(function(e) {
      e.preventDefault()
      //var dateTimeFormat = d3.timeFormat('%Y-%m-%d %I:%M %p')
      var dateTimeFormat = d3.timeParse('%Y-%m-%d %I:%M %p')
      $('#add-inventory-modal-message').empty()
      // $("#add-inventory-modal-message").toggleClass("d-none");

      console.log($('#customer-menu option:selected').val())
      console.log($('#inventory-start-date').val().length)
      // console.log(currentInventory.start_date.length);
      if ($('#customer-menu option:selected').val() == 0) {
          if ($('#add-inventory-modal-message').hasClass('d-none')) {
              $('#add-inventory-modal-message').toggleClass('d-none')
          }
          d3.select('#add-inventory-modal-message')
              .append('div')
              .attr('class', 'alert alert-danger')
              .html('Please select a customer')
          return
      }
      currentInventory.customer_id = $('#customer-menu option:selected').val() * 1

      if ($('#supervisor-menu option:selected').val() == 0) {
          if ($('#add-inventory-modal-message').hasClass('d-none')) {
              $('#add-inventory-modal-message').toggleClass('d-none')
          }
          d3.select('#add-inventory-modal-message')
              .append('div')
              .attr('class', 'alert alert-danger')
              .html('Please select a supervisor')
          return
      }
      currentInventory.supervisor_id = $('#supervisor-menu option:selected').val()

      // console.log($("#inventory-start-time").val().length + " " + $("#inventory-start-time").val());
      if (
          $('#inventory-start-date').val().length < 1 ||
          $('#start-time-menu option:selected').val() == 0
      ) {
          // $("#add-inventory-modal-message").toggleClass("d-none");
          if ($('#add-inventory-modal-message').hasClass('d-none')) {
              $('#add-inventory-modal-message').toggleClass('d-none')
          }
          d3.select('#add-inventory-modal-message')
              .append('div')
              .attr('class', 'alert alert-danger')
              .html('Start date/time is required. Please enter date/time.')
          return
      }
      console.log($('#inventory-start-date').val() + ' ' + $('#start-time-menu option:selected').text());
      var startDate = dateTimeFormat(
          $('#inventory-start-date').val() +
          ' ' +
          $('#start-time-menu option:selected').text()
      )
      currentInventory.start_date_time = startDate.getTime() / 1000

      console.log(startDate)
      if (
          $('#inventory-end-date').val().length > 0 &&
          $('#end-time-menu option:selected').val() != 0
      ) {

          var endDate = dateTimeFormat(
              $('#inventory-end-date').val() +
              ' ' +
              $('#end-time-menu option:selected').text()
          )
          currentInventory.end_date_time = endDate.getTime() / 1000
      } else {
          currentInventory.end_date_time = 0
      }

      if (
          currentInventory.end_date_time != 0 &&
          currentInventory.end_date_time < currentInventory.start_date_time
      ) {
          if ($('#add-inventory-modal-message').hasClass('d-none')) {
              $('#add-inventory-modal-message').toggleClass('d-none')
          }
          d3.select('#add-inventory-modal-message')
              .append('div')
              .attr('class', 'alert alert-danger')
              .html(
                  'The End Date/Time must be greater than the Start Date/Time. Please check'
              )
          return
      }

      currentInventory.comments = $('#inventory-comments').val()
      console.log(currentInventory)

      var params = {
          action: 'addInventory',
          currentInventory: currentInventory
      }
      console.log(params)
      // $('#modal-add-inventory').modal('hide')
      executeAjax('addInventory', params)

      // d3.select("#add-inventory-modal-message")
      // .append('div')
      // .attr('class','alert alert-danger')
      // .html("something goes here dfsd sdfsdf sdfsdf dfsdf sdfsd sdfsdfsd sdfsdf");
      // var startDate = $("#inventory-start-date").val();
      // if
      // console.log("clicked" + startDate);
  })

  /*

    $(".dropdown-item").click(function(e){
        e.preventDefault();
        var elementId = $(this).attr('id');
        var elementArray = elementId.split("-");
        switch(elementArray[0]) {
            case "customer":
                break;
            case "inventory":
                break;
            case "supervisor":
                break;
            case "start":
                break;
            case "end":
                break;
            default:
                break;

        }

        console.log("clicked" + elementId + elementArray[0]);

    })//
    **/

  function handleClick(d, i) {
      var elementId = this.id
      var elementArray = elementId.split('-')
      switch (elementArray[0]) {
          case 'customer':
              break
          case 'inventory':
              break
          case 'supervisor':
              break
          case 'start':
              break
          case 'end':
              break
          default:
              break
      }

      console.log('clicked' + elementId + elementArray[0])
      // console.log(d);
      // console.log(this);
      // console.log(this.id);
      // $("#" + this.id).click();
  }

  function enableUdateButton() {
      if ($('#inventory-menu option:selected').val() == 0) {
          $('#home-update-inventory-button').attr('disabled', true)
      } else {
          $('#home-update-inventory-button').attr('disabled', false)
      }
  }

  function retrieveInventoryCounts() {
      var params = {
          action: 'getInventoryCounts'
      };
      executeAjax('getInventoryCounts', params);

  };

  function setMenu(menuName, data) {
      $('#' + menuName).empty()
      d3.select('#' + menuName)
          .selectAll('option')
          .data(data)
          .enter()
          .append('option')
          .attr('value', function(d) {
              return d.id
          })
          .html(function(d) {
              switch (menuName) {
                  case 'inventory-menu':
                      return d.customer_name + ' ' + d.start_date
                      break
                  case 'customer-menu':
                      return d.customer_name
                      break
                  case 'supervisor-menu':
                      return d.auditor_name
                      break
                  case 'start-date-menu':
                  case 'end-date-menu':
                      return d.date
                      break
                  default:
                      return d.time
              }
          })

      d3.select('#' + menuName)
          .append('option')
          .attr('selected', 'selected')
          .attr('value', function() {
              return 0
          })
          .html(function(d) {
              switch (menuName) {
                  case 'inventory-menu':
                      return 'Select existing inventory'
                      break
                  case 'customer-menu':
                      return 'Select customer'
                      break
                  case 'supervisor-menu':
                      return 'Select supervisor'
                      break
                  case 'start-date-menu':
                  case 'end-date-menu':
                      return 'Select date'
                      break

                  default:
                      return 'Select Time'
              }
          })

      /*
          d3.select("#" + menuName)
          .selectAll("button")
          .data(data)
          .enter()
          .append("button")
          .on("click",handleClick)
          .attr("class","dropdown-item")
          .attr("type","button")
          .attr("id",function(d){
              return "inventory-dropdown-" + d.id;
          })
          .html(function(d){
              switch(menuName) {
                  case "inventory-menu":
                      return d.customer_name + " " + d.start_date;
                      break;
                  case "customer-menu":
                      return d.customer_name;
                      break;
                  case "supervisor-menu":
                      return d.auditor_name;
                      break;
                  default:
                      return d.time;

              }

          });
          */
  }

  function updateDeleteLabels(){
    if ($('#modal-delete-counts-toggle').is(":checked")) {
        $("#modal-delete-counts-label").html("Delete counts")
        $("#modal-delete-counts-count").html(ndx.size());
        //$('#modal-delete-counts-toggle').prop("checked",false);
    }
    else {
        $("#modal-delete-counts-count").html(0);

        $("#modal-delete-counts-label").html("Don't delete counts")
    }
    if ($('#modal-delete-files-toggle').is(":checked")) {
        filesToDelete = [];
        var files = filesGroup.top(Infinity);

        files.forEach(function(d){
            filesToDelete.push(d.key);
        })
        console.log(filesToDelete);
        $("#modal-delete-files-count").html(filesToDelete.length);
        $("#modal-delete-files-label").html("Delete files")
        //$('#modal-delete-counts-toggle').prop("checked",false);
    }
    else {
        filesToDelete = [];
        $("#modal-delete-files-count").html(filesToDelete.length);
        $("#modal-delete-files-label").html("Don't delete files")
    }
    if ($('#modal-delete-item-master-toggle').is(":checked")) {
        $("#modal-delete-item-master-label").html("Delete item master");
        $("#modal-delete-item-master-count").html(1);
        itemMasterToDelete = "itemMaster.json";
        //$('#modal-delete-counts-toggle').prop("checked",false);
    }
    else {
        $("#modal-delete-item-master-label").html("Don't delete item master");
        $("#modal-delete-item-master-count").html(0);
        itemMasterToDelete = "";
    }

    if ($('#modal-delete-counts-toggle').is(":checked")  || $('#modal-delete-files-toggle').is(":checked") || $('#modal-delete-item-master-toggle').is(":checked"))   { 
        //$("#modal-delete-inventory-button").prop("disabled",false);

    }
    else {
        //$("#modal-delete-inventory-button").prop("disabled",true);
    }
      
  }

  function updateInventoryInfo(data) {
      //var ctx = crossfilter(data);
      //var allCounts = ndx.groupAll();

      var auditorsDim = ndx.dimension(function(d) {
          return d.inv_auditor;
      });
      var auditorsGroup = auditorsDim.group();

      var filesDim = ndx.dimension(function(d) {
          return d.inv_file_name;
      })

      var filesGroup = filesDim.group();

      var areasDim = ndx.dimension(function(d) {
          return d.inv_area
      })

      var areasGroup = areasDim.group();


      $("#inventory-entries").html(ndx.size());
      $("#inventory-auditors").html(auditorsGroup.size());
      $("#inventory-files").html(filesGroup.size());
      $("#inventory-areas").html(areasGroup.size());




  }
  // <button class="dropdown-item" id="inventory-dropdown-1" type="button">5/24/2019</button>
  var params = {
      action: 'getInitialData'
  }
  executeAjax('getInitialData', params)

  // End inventorys

  // General functions
  // $("#waiting-for-process").toggleClass( "d-none" );

  function executeAjax(action, params) {
      // Start executeAjax
      $('#waiting-for-process').toggleClass('d-none')
      $('#general-message').empty()
      $.ajax({
              method: 'POST',
              dataType: 'json',
              data: params,
              url: 'process-inventory.php'
          })
          .done(function(msg) {
              $('#waiting-for-process').toggleClass('d-none');
              var dateFormat = d3.timeFormat('%m-%d-%Y');
              var timeFormat = d3.timeFormat('%I:%M %p');
              console.log(msg)

              if (msg.status == 'success') {
                  switch (action) {
                      case "deleteInventory":
                          console.log("deleteInventory");
                          break;
                      case 'getInitialData':
                          inventories = msg.inventories
                          auditors = msg.auditors
                          auditors.forEach(function(d) {
                              if (d.is_supervisor == 0) {
                                  d.is_supervisor = false
                              } else {
                                  d.is_supervisor = true
                              }
                          })
                          supervisors = auditors.filter(function(d) {
                              return d.is_supervisor == true
                          })
                          customers = msg.customers
                          inventories.forEach(function(d) {
                              d.id = d.id * 1
                              d.customer_id = d.customer_id * 1
                              d.start_date_time = d.start_date_time * 1
                              d.end_date_time = d.end_date_time * 1
                              var startDateTime = new Date(d.start_date_time * 1000)
                              d.start_date = dateFormat(startDateTime)
                              d.start_time = timeFormat(startDateTime)
                              var endDateTime = new Date(d.end_date_time * 1000)
                              d.end_date = dateFormat(endDateTime)
                              d.end_time = timeFormat(endDateTime)
                          })
                          setMenu('inventory-menu', inventories)
                          setMenu('customer-menu', customers)
                          setMenu('supervisor-menu', supervisors)

                          break;
                      case "getInventoryCounts":
                          console.log(msg.inventoryCounts);

                          inventoryCounts = msg.inventoryCounts;
                          inventoryCounts.forEach(function(d) {
                              return d.inv_sequence = d.inv_sequence * 1
                          })
                          ndx = crossfilter(inventoryCounts);
                          allDim = ndx.dimension(function(d) {
                              return d;
                          });
                          console.log("total");
                          console.log(allDim.groupAll().reduceSum(function(info){return info.inv_quantity;}).value());
                          auditorsDim = ndx.dimension(function(d) {
                              return d.inv_auditor;
                          });
                          auditorsGroup = auditorsDim.group();
                          filesDim = ndx.dimension(function(d) {
                              return d.inv_file_name;
                          })
                          filesGroup = filesDim.group();
                          areasDim = ndx.dimension(function(d) {
                              return d.inv_area
                          })
                          areasGroup = areasDim.group();



                          updateInventoryInfo(inventoryCounts);

                          $('#inventory-menu').val(1);
                          $("#inventory-entries-button").trigger("click");



                          break;
                      case 'addInventory':
                          var customer = customers.filter(function(d) {
                              return d.id == msg.currentInventory.customer_id
                          })

                          msg.currentInventory.customer_name = customer[0].customer_name

                          var supervisor = supervisors.filter(function(d) {
                              return d.id == msg.currentInventory.supervisor_id
                          })

                          msg.currentInventory.auditor_name = supervisor[0].auditor_name

                          var startDateTime = new Date(
                              msg.currentInventory.start_date_time * 1000
                          )

                          msg.currentInventory.start_date = dateFormat(startDateTime)
                          msg.currentInventory.start_time = timeFormat(startDateTime)

                          if (msg.currentInventory.end_date_time > 0) {
                              var endDateTime = new Date(
                                  msg.currentInventory.end_date_time * 1000
                              )
                              msg.currentInventory.end_date = dateFormat(endDateTime)
                              msg.currentInventory.end_time = timeFormat(endDateTime)
                          }

                          inventories.push(msg.currentInventory)
                          setMenu('inventory-menu', inventories)
                          $('#inventory-menu').val(msg.currentInventory.id)
                          $("#modal-add-inventory").modal("hide");

                          break;
                      default:
                          break;
                  }
              } else {
                  $('#general-message').empty()
                  d3.select('#general-message')
                      .append('div')
                      .attr('class', 'alert alert-danger text-center')
                      .html(msg.message)
              }

              // $(".waiting-for-process").toggleClass( "hidden-xs-up" );;
              /*
              if (msg.status == 'success') {
                if (action == 'login') {
                  $('#modal-login-form').modal('hide')
                  login()
                }
                if (action == 'reset') {
                  $('#modal-forgot-password-form').modal('hide')
                }
                if (action == 'register') {
                  $('#modal-signup-form').modal('hide')
                }
              } else {
                if (action == 'reset') {
                  $('#forgot-password-message').empty()
                  d3.select('#forgot-password-message')
                    .append('div')
                    .attr('class', 'alert alert-danger')
                    .html(msg.message)
                }
                if (action == 'register') {
                  $('#signup-message').empty()
                  d3.select('#signup-message')
                    .append('div')
                    .attr('class', 'alert alert-danger')
                    .html(msg.message)
                }
                if (action == 'login') {
                  $('#login-message').empty()
                  d3.select('#login-message')
                    .append('div')
                    .attr('class', 'alert alert-danger')
                    .html(msg.message)
                }
              }
              */
          })
          .fail(function(msg) {
              $('#waiting-for-process').toggleClass('d-none')
              console.log('failed')
              console.log(msg)
              $('#general-message').empty()
              d3.select('#general-message')
                  .append('div')
                  .attr('class', 'alert alert-default text-center')
                  .html(msg.responseText)

              // $(".waiting-for-process").toggleClass( "hidden-xs-up" );
              /*
              if (action == 'reset') {
                $('#forgot-password-message').empty()
                d3.select('#forgot-password-message')
                  .append('div')
                  .attr('class', 'alert alert-danger text-center')
                  .html('Error connecting to webserver')
              }
              if (action == 'register') {
                $('#signup-message').empty()
                d3.select('#signup-message')
                  .append('div')
                  .attr('class', 'alert alert-danger text-center')
                  .html('Error connecting to webserver')
              }
              if (action == 'login') {
                $('#login-message').empty()
                d3.select('#login-message')
                  .append('div')
                  .attr('class', 'alert alert-danger text-center')
                  .html('Error connecting to webserver')
              }
              */
          })
  } // End executeAjax

  function isDateSupported() {
      var input = document.createElement('input')
      var value = 'a'
      input.setAttribute('type', 'date')
      input.setAttribute('value', value)
      return input.value !== value
  }

  function setDates(count) {

      var currentDate = new Date()
      var dateFormat1 = d3.timeFormat('%m/%d/%Y')
      // var increments   = 60 / minutes * 24;
      currentDate.setHours(0)
      currentDate.setMinutes(0)
      currentDate.setSeconds(0)
      currentDate = new Date(currentDate.getTime() - 60 * 24 * 60000)
      for (i = 1; i <= count; i++) {
          dates.push({
              id: i,
              date: dateFormat1(currentDate)
          })
          currentDate = new Date(currentDate.getTime() + 60 * 24 * 60000)
      }

  }

  function setTimes(minutes) {

      var currentDate = new Date();
      var increments = (60 / minutes) * 24;
      var timeFormat1 = d3.timeFormat('%I:%M %p');
      currentDate.setHours(0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      // times.push()

      for (i = 1; i <= increments; i++) {
          times.push({
              id: i,
              time: timeFormat1(currentDate)
          })
          currentDate = new Date(currentDate.getTime() + minutes * 60000)
          // times.push(timeFormat1(currentDate));
      }

  }


  //Table Pagination
  // use odd page size to show the effect better
  var ofs = 0,
      pag = 17;

  function update_offset() {
      var totFilteredRecs = ndx.groupAll().value();
      var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
      ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
      ofs = ofs < 0 ? 0 : ofs;
      tableChart.beginSlice(ofs);
      tableChart.endSlice(ofs + pag);
  }

  function display() {
      var totFilteredRecs = ndx.groupAll().value();
      var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
      d3.select('#begin')
          .text(end === 0 ? ofs : ofs + 1);
      d3.select('#end')
          .text(end);
      d3.select('#page-navigation-previous')
          .attr('disabled', ofs - pag < 0 ? 'true' : null);
      d3.select('#page-navigation-next')
          .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
      d3.select('#size').text(totFilteredRecs);
      if (totFilteredRecs != ndx.size()) {
          d3.select('#totalsize').text("(filtered Total: " + ndx.size() + " )");
      } else {
          d3.select('#totalsize').text('');
      }
  }

  function next() {
      ofs += pag;
      update_offset();
      tableChart.redraw();
  }

  function last() {
      ofs -= pag;
      update_offset();
      tableChart.redraw();
  }
  /*
  function previous() {
      console.log(pag);
      console.log(ofs);
      ofs -= pag;
      update_offset();
      tableChart.redraw();
  }
  */


})