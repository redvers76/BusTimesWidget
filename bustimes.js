<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
     <title>TransportAPI Bus Times Widget (C) K.Fairhurst 2021</title>
   </head>
<style>
    t1 {font-family: 'Open Sans';
       width: 320px;
       display: inline-block;
       color: rgb(255,255,255);
       background-color: rgb(0,0,0);
       font-size: 14px; 
       sans-serif ;}
    p1 {font-family: 'DotGothic16';
       width: 45px;
       display: inline-block;
       color: rgb(255,153,0);
       background-color: rgb(0,0,0);
       font-size: 14px; 
       sans-serif ;}
    p2 {font-family: 'DotGothic16';
       width: 35px;
       display: inline-block;
       color: rgb(255,153,0);
       background-color: rgb(0,0,0);
       font-size: 14px;
       sans-serif ;}
    p3 {font-family: 'DotGothic16';
       width: 170px;
       display: inline-block;
       color: rgb(255,153,0);
       background-color: rgb(0,0,0);
       font-size: 14px; 
       sans-serif ;}
    p4 {font-family: 'DotGothic16';
       width: 70px;
       display: inline-block;
       color: rgb(255,153,0);
       background-color: rgb(0,0,0);
       font-size: 14px; 
       sans-serif ;}
   .marquee {
        font-family: 'DotGothic16';
        font-size: 14px;
        display: inline-block;
        width: 320px;
        height: 25px;
        padding: 0px;
        margin: 0px;
        position: relative;
        overflow: hidden;
        background: rgb(0,0,0);
        color: rgb(255,255,255);
        border: 0px solid gray;
    }
        
        .marquee p {
            position: absolute;
            display: inline-block;
            width: 300%;
            height: 25px;
            margin: 0px;
            white-space: nowrap;
            line-height: 25px;
            text-align: left;
            -moz-transform: translateX(100%);
            -webkit-transform: translateX(100%);
            transform: translateX(100%);
            -moz-animation: scroll-left 4s linear infinite;
            -webkit-animation: scroll-left 4s linear infinite;
            animation: scroll-left 60s linear infinite;
        }
        
        @-moz-keyframes scroll-left {
            0% {
                -moz-transform: translateX(100%);
            }
            100% {
                -moz-transform: translateX(-100%);
            }
        }
        
        @-webkit-keyframes scroll-left {
            0% {
                -webkit-transform: translateX(100%);
            }
            100% {
                -webkit-transform: translateX(-100%);
            }
        }
        
        @keyframes scroll-left {
            0% {
                -moz-transform: translateX(25%);
                -webkit-transform: translateX(25%);
                transform: translateX(25%);
            }
            100% {
                -moz-transform: translateX(-200%);
                -webkit-transform: translateX(-200%);
                transform: translateX(-200%);
            }
        }
    body {
       overflow: hidden;
         }
</style>

<body>
    <!-- Display -->
    <t1 id="t_title"></t1><br>
    <p1 id="d_displayline0a"></p1><p2 id="d_displayline0b"></p2><p3 id="d_displayline0c"></p3><p4 id="d_displayline0d"></p4><br>
    <p1 id="d_displayline1a"></p1><p2 id="d_displayline1b"></p2><p3 id="d_displayline1c"></p3><p4 id="d_displayline1d"></p4><br>
    <p1 id="d_displayline2a"></p1><p2 id="d_displayline2b"></p2><p3 id="d_displayline2c"></p3><p4 id="d_displayline2d"></p4><br>
    <p1 id="d_displayline3a"></p1><p2 id="d_displayline3b"></p2><p3 id="d_displayline3c"></p3><p4 id="d_displayline3d"></p4><br>
    <p1 id="d_displayline4a"></p1><p2 id="d_displayline4b"></p2><p3 id="d_displayline4c"></p3><p4 id="d_displayline4d"></p4><br>
    <div class="marquee">
            <p id="d_displaycanceltext"> </p>
    </div>

<script>
    // Version 1.1 of TransportAPI Bus Times Widget
    // (C) K.Fairhurst 2021
    // This source code is licensed under the BSD-style license found in the
    // LICENSE file in the root directory of this source tree. 

    // v1.0   Initial Release
    // v1.1   Few display tweaks 


    // Based on NR Departure Board widget by Richard Farnworth
    // https://richardfarnworth.wordpress.com/code-samples/ 

    // Following configuration items are used to determine how the widget will work
    //

    // Sign up for a free account at https://developer.transportapi.com
    // You will be provided with an APP ID and an APP KEY
    // Enter those values here; this will be used to construct the appropriate URL later on
    //

    const g_appID  = "### insert app id here ###";
    const g_appKey = "### insert app key here ###";    


    // As standard, widget will refresh every 3 minutes
    // Free TransportAPI account provides you with 1000 API calls per day - enough for 50 hours
    // This reduces to 100 calls per day if you use NextBuses datasource (e.g. for bus stops outside of London) - enough for 5 hours
    // Set g_nextbuses = "yes" to enable this datasource or "no" to disable 
    //

    const g_nextBuses = "yes";


    // Following option controls how the information is output in the third column 
    // This is used to combine the bus Destination information with Operator information
    //
    //     If set to "" or "OFF" then Operator information will be excluded 
    //     If set to "SHORT" then 4 character Operator code will be appended to Destination 
    //     If set to "FULL" then Operator Name will be shown, with Destination appended if it will fit 
    //

    const g_includeOperator = "SHORT";


    // Following option controls which methodology we're going to use to codify the timetable
    // If we're using the NextBuses option, the API limit would be breached by 5am if we check constantly
    // As such this allows us to turn stops on and off at different times of the day, by enabling API Saver mode
    // There are three ways of doing this, hence three possible values... examples for each shown later!
    //
    // TIMED
    // When this option is used, you will be providing the start and stop times for each day on a single row
    // The same timetable can be easily used for multiple days
    //
    // WINDOW
    // When this option is used, you will be providing a specific time, e.g. the bus which you would normally catch
    // You then provide a number of minutes before & after that you want the info to be shown, on the same line
    // Different entries can therefore have different windows, depending on requirements
    // The same timetable can be easily used for multiple days
    //
    // ALTERNATE
    // With this option, we sort the timetable to ensure it's in chronological order first
    // We then step through, until the current record is in the past, and the next record is in the future
    //     If the current record has an ATCO code, we use those details.
    //     If the current record does not have an ATCO code, we enable the API saver.
    //
    // This allows for fine-grained control of the timetable, e.g. to change stops without having to add end-time for previous entry
    // Note that we can only show time for one stop at once in a single widget
    // Use multiple widgets if you need to show multiple stops concurrently
    //

    const g_timetableMethod = "ALTERNATE";


    // The final configuration entry is the timetable that we're going to use
    // This is set up as an array of arrays, and is interrogated by the logic to determine what information to show
    //
    // The following fields are used to configure what buses we are interested in
    //
    // Day of Week - "0" (Sunday) to "6" (Saturday), or "*" for every day of the week
    //               When using TIMED or WINDOW methods, can also be a comma separated list of days e.g. "1,2,3,4,5" for every weekday
    //               When using ALTERNATE method this must be a single digit - wildcard "*" will not work 
    //
    // Hour - A value between 00 and 23
    //        When using ALTERNATE method this must be two digits, with a leading zero, to ensure accurate sorting e.g. 07 for 7am
    //
    // Minute - A value between 00 and 59
    //          When using ALTERNATE method this must be two digits, with a leading zero, to ensure accurate sorting e.g. 05 for 5 minutes past the hour
    //
    // ATCO Code - This is the unique code relating to the bus stop you are interested in
    //             When using ALTERNATE method, setting it to "" enables API saver at that point
    //             Find relevant ATCO codes using steps documented at 
    //             http://docs.transportapi.com/index.html?raml=https://transportapi.com/v3/raml/transportapi.raml##bus_information
    //
    // Stop Description - We try to retrieve information about the stop from the JSON message. This will be used if we cannot find anything in the JSON
    //                    It also makes it easier to remember which stop is which when looking back at configuration settings 
    //                    * This field is optional, set to "" if not needed *
    //
    // Filter Option - Some bus stops only serve a couple of different routes, others serve a lot more
    //                 By using filters we can ensure we only see the data we're interested in
    //                     If this is set to "" or "OFF" then we don't filter the data at all
    //                     If this is set to "LINE" then we only include bus information if the bus line is included in the filter value setting
    //                     If this is set to "OPERATOR" then we only include information for buses run by operators in the filter value
    //                     If this is set to "BOTH" you need to configure LINE and OPERATOR information in the filter value
    //                 This means that in circumstances where multiple operators serve a single route, you can limit the information to
    //                 just what you need to see (for example, you might have a travel pass with one of the operators)
    //                 * This field is optional, set to "" if not needed *
    //
    // Filter Value - Depending on the Filter Option chosen, this is either used to filter by LINE, OPERATOR or BOTH
    //                If LINE this should contain the bus route, this is usually what appears on the front of the bus!
    //                If OPERATOR, it's the four character short code used to identify the operator
    //                    (if you're not sure what to set this to, set g_includeOperator = "SHORT" and see what is output!)
    //                If BOTH then this value should contain the bus route followed by a | pipe followed by the operator short code
    //                Multiple lines (or operators, or both) can be specified, separate with commas
    //                * This field is optional, set to "" if not needed *
    //
    // Method Specific configuration :
    //
    //     If you are using the TIMED method then two additional fields are required to determine the end time for the display
    //
    //         Hour To - A value between 00 and 23
    //         Minute To - A value between 00 and 59
    //
    //     If you are using the WINDOW method then two additional fields are required to determine the start and end time for the display
    //     The time you provide will be the baseline e.g. this could be the time of departure of the bus you are aiming to catch
    // 
    //         Offset Before - Number of minutes to subtract from baseline time
    //         Offset After - Number of minutes to add to baseline time
    //
    //
    // The following examples all configure the same target timetable for the three different methods 
    // The method you choose will ultimately depend on your requirements 
    //
    // TIMED
    //
    // [ [ "1,2", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19", "11", "30" ]
    // , [ "1,2", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "18", "00" ]
    // , [ "3,5", "07", "00", "300000075GS", "Corby George Street", "LINE", "X4,19", "09", "00" ]
    // , [ "3",   "16", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "18", "00" ]
    // , [ "5",   "11", "45", "300000181GS", "Tresham College",     "LINE", "X4",    "13", "45" ] 
    // ]
    //
    // WINDOW
    //
    // [ [ "1,2", "10", "45", "300000075GS", "Corby George Street", "LINE", "X4,19", "75", "45" ]
    // , [ "1,2", "17", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "60", "60" ]
    // , [ "3,5", "08", "15", "300000075GS", "Corby George Street", "LINE", "X4,19", "75", "45" ]
    // , [ "3",   "17", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "60", "60" ]
    // , [ "5",   "12", "45", "300000181GS", "Tresham College",     "LINE", "X4",    "60", "60" ]
    // ]
    //
    // ALTERNATE
    // 
    // [ [ "1", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
    // , [ "1", "11", "30", "",            "",                    "",     ""      ]
    // , [ "1", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4"    ]
    // , [ "1", "18", "00", "",            "",                    "",     ""      ]
    // , [ "2", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
    // , [ "2", "11", "30", "",            "",                    "",     ""      ]
    // , [ "2", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4"    ]
    // , [ "2", "18", "00", "",            "",                    "",     ""      ]
    // , [ "3", "07", "00", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
    // , [ "3", "09", "00", "",            "",                    "",     ""      ]
    // , [ "3", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4"    ]
    // , [ "3", "18", "00", "",            "",                    "",     ""      ]
    // , [ "5", "07", "00", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
    // , [ "5", "09", "00", "",            "",                    "",     ""      ]
    // , [ "5", "11", "45", "300000181GS", "Tresham College",     "LINE", "X4"    ]
    // , [ "5", "13", "45", "",            "",                    "",     ""      ]
    // ]
    //

    const g_timetable = [ [ "1", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
                        , [ "1", "11", "30", "",            "",                    "",     ""      ]
                        , [ "1", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4"    ]
                        , [ "1", "18", "00", "",            "",                    "",     ""      ]
                        , [ "2", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
                        , [ "2", "11", "30", "",            "",                    "",     ""      ]
                        , [ "2", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4"    ]
                        , [ "2", "18", "00", "",            "",                    "",     ""      ]
                        , [ "3", "07", "00", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
                        , [ "3", "09", "00", "",            "",                    "",     ""      ]
                        , [ "3", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4"    ]
                        , [ "3", "18", "00", "",            "",                    "",     ""      ]
                        , [ "5", "07", "00", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
                        , [ "5", "09", "00", "",            "",                    "",     ""      ]
                        , [ "5", "11", "45", "300000181GS", "Tresham College",     "LINE", "X4"    ]
                        , [ "5", "13", "45", "",            "",                    "",     ""      ]
                        ];


    // Following is used to adjust sizes of text boxes. Best left untouched if keeping 320px wide display 

    const g_sectionALen  = 6;
    const g_sectionBLen  = 5;
    const g_sectionCLen  = 24;
    const g_sectionDLen  = 10;

    const g_headerLen    = g_sectionALen
                           + g_sectionBLen
                           + g_sectionCLen
                           + g_sectionDLen;

    // Handy to see what is happening with the JSON / API calls 

    const g_debugEnabled = false;


    // Timer is: 180,000 = (1000ms x 60 seconds x 3 mins)

    var myTimer = 180000;

    myMain();


    function myMain() {

        // Main processing is done here...
        // After clearing the display we determine what routes we should be running for
        // If API Saver is enabled we do not call the API
        // Otherwise we call the URL returned from the function and apply any filters needed before updating the display 

        clearDisplay();

        setHeader( "Something has gone wrong..." );

        var v_timetableSorted  = g_timetable.sort();

        let arr_queryTimetable = [];

        let v_apiSaver         = "";
        let v_requestURL       = "";
        let v_displayHeader    = "";
        let v_filterOption     = "";
        let v_filterValue      = "";

        if ( g_timetableMethod.toUpperCase() == "TIMED" ) {

            arr_queryTimetable = queryTimetableTIMED( v_timetableSorted );

        } else if ( g_timetableMethod.toUpperCase() == "WINDOW" ) {

            arr_queryTimetable = queryTimetableWINDOW( v_timetableSorted );

        } else if ( g_timetableMethod.toUpperCase() == "ALTERNATE" ) {

            arr_queryTimetable = queryTimetableALTERNATE( v_timetableSorted );

        }  // if ( g_timetableMethod.toUpperCase() == "TIMED" ) 

        if ( arr_queryTimetable == []
             || arr_queryTimetable == null
           ) {

            v_apiSaver        = "ERROR";
            v_requestURL      = "";
            v_displayHeader   = "Timetable is not correctly configured";
            v_filterOption    = "";
            v_filterValue     = "";

        } else {

            v_apiSaver        = arr_queryTimetable[0];
            v_requestURL      = "https://transportapi.com/v3/uk/bus/stop/"
                                + arr_queryTimetable[1]
                                + "/live.json?app_id="
                                + g_appID
                                + "&app_key="
                                + g_appKey
                                + "&group=no&nextbuses="
                                + g_nextBuses.toLowerCase();
            v_displayHeader   = arr_queryTimetable[2];
            v_filterOption    = arr_queryTimetable[3];
            v_filterValue     = "," + arr_queryTimetable[4] + ",";

        }  // if ( arr_queryTimetable == [] || arr_queryTimetable.length = 0 ) 


        // Main code to make API call, wait for a response and then process

        if ( v_apiSaver == "ERROR" ) {

            // Display the error message  

            setHeader( "Configuration error has occurred" );
            
            v_sliceMessage = v_displayHeader;
            sliceMessage( v_sliceMessage, "A", 1, true );

        } else if ( v_apiSaver == "ON" ) {

            // Set a message that the API saver is enabled 

            setHeader( "API Saver" );
            
            v_sliceMessage = "API Saver is currently enabled";
            sliceMessage( v_sliceMessage, "A", 1, true );

        } else {

            // Call the API 

            let xhr = new XMLHttpRequest();
            xhr.open( 'GET', v_requestURL );
            xhr.responseType = 'json';
            xhr.send();

            // All remaining processing is carried out in onload function 

            xhr.onload = function() {

                // Store the response received 

                const v_lineID = xhr.response;

                if ( g_debugEnabled ) {

                    // Handy for debugging purposes ! 

                    console.log( v_lineID );

                }  // if ( g_debugEnabled )

                // Trap if: a) there are no buses running b) the ATCO codes dont give any entries (widget will crash otherwise)

                if ( v_lineID.departures == null ) {

                    setHeader( "No information available" );

                    v_sliceMessage = "There are either :";
                    sliceMessage( v_sliceMessage, "A", 0, true );

                    v_sliceMessage = "No buses in the next few hours";
                    sliceMessage( v_sliceMessage, "B", 1, true );

                    v_sliceMessage = "No buses currently running at all";
                    sliceMessage( v_sliceMessage, "B", 2, true );

                    v_sliceMessage = "No buses from this stop";
                    sliceMessage( v_sliceMessage, "B", 3, true );

                    v_sliceMessage = "Or maybe you went over the API limit?";
                    sliceMessage( v_sliceMessage, "B", 4, true );

                } else {

                    let v_stopName      = v_lineID.name;
                    let v_stopLocality  = v_lineID.locality;
                    let v_stopIndicator = v_lineID.indicator;
                    let v_stopBearing   = v_lineID.bearing;

                    if ( v_stopName != ""
                         && v_stopLocality != ""
                       ) {

                        v_displayHeader = "From " + v_stopName + ", " + v_stopLocality;

                    } else if ( v_stopName != "" ) {

                        v_displayHeader = "From " + v_stopName;

                    } // Otherwise, we use whatever we are passed from identifyRoutes() 

                    // Add a sprinkle of extra information about the stop if not already present 

                    if ( !v_displayHeader.includes( v_stopIndicator )
                         && v_stopIndicator != null
                       ) {

                        v_displayHeader += " (" + v_stopIndicator + ")";

                    }

                    if ( v_stopBearing != null ) {

                        v_displayHeader += " [" + v_stopBearing + "]";

                    }

                    const v_lineIDElements = v_lineID.departures.all.length;
                    let v_scanJSON         = 0;
                    let v_validElements    = 0;
                    let arr_busData        = [];

                    // Loop around all the departures we received and process them for later display 

                    while ( v_scanJSON < v_lineIDElements ) {

                        // Capture the information we're interested in from the JSON

                        v_splitAimed        = v_lineID.departures.all[v_scanJSON].aimed_departure_time;
                        v_splitDirection    = v_lineID.departures.all[v_scanJSON].direction;
                        v_splitEstimate     = v_lineID.departures.all[v_scanJSON].best_departure_estimate;
                        v_splitOperator     = v_lineID.departures.all[v_scanJSON].operator;
                        v_splitOperatorName = v_lineID.departures.all[v_scanJSON].operator_name;
                        v_splitLine         = v_lineID.departures.all[v_scanJSON].line_name;

                        if ( v_splitLine == "" ){

                            v_splitLine     = v_lineID.departures.all[v_scanJSON].line;

                        }

                        // Cancellation information isn't always populated, even when using NextBuses option 

                        if ( v_lineID.departures.all[v_scanJSON].status.cancellation.value != null ) {

                            v_splitCancelled = v_lineID.departures.all[v_scanJSON].status.cancellation.value;

                        } else {

                            v_splitCancelled = false;

                        }

                        if ( v_lineID.departures.all[v_scanJSON].status.cancellation.reason != null ) {

                            v_splitReason = v_lineID.departures.all[v_scanJSON].status.cancellation.reason;

                        } else {

                            v_splitReason = "";

                        }

                        // Modify data based on content to make it look a little prettier 

                        if ( v_splitAimed == null ) {

                            // Timetabled departure is not mandatory although estimated departure is

                            v_splitAimed = v_splitEstimate;

                        }

                        if ( v_splitEstimate != v_splitAimed ) {

                            v_splitEstimate = "Now " + v_splitEstimate;

                        } else {

                            v_splitEstimate = "On time";

                        }

                        if ( v_splitCancelled == true ) {

                            v_splitEstimate = "CANCELLED";

                        }

                        if ( g_includeOperator == ""
                             || g_includeOperator == "NO"
                           ) {

                            v_infoLine = v_splitDirection;

                        } else if ( g_includeOperator == "SHORT" ) {

                            // Include Operator short-code after the direction information 

                            if ( v_splitOperator.includes( "_noc_" ) ) {

                                // Handle strange operator short-codes with extraneous text embedded 

                                v_splitOperator = v_splitOperator.replace( "_noc_", null );

                            }

                            // If Direction + Operator Short Code is longer than the space available, truncate the direction so the short code still displays 

                            if ( ( v_splitDirection.length + v_splitOperator.length ) <= g_sectionCLen ) {

                                v_infoLine = v_splitDirection + " [" + v_splitOperator + "]";

                            } else {

                                v_infoLine = v_splitDirection.slice( 0, g_sectionCLen - ( v_splitOperator.length + 3 ) ) + " [" + v_splitOperator + "]";

                            }

                        } else {

                            // FULL Operator option puts Operator Name before Direction

                            v_infoLine = v_splitOperatorName + " " + v_splitDirection;

                        }

                        // If we are only interested in certain bus lines or operators, restrict output to those 

                        if ( v_filterOption           == ""
                             || v_filterOption        == "OFF"
                             || v_filterValue         == "" 
                             || ( v_filterOption      == "LINE"
                                  && v_splitLine     != ""
                                  && v_filterValue.includes( "," + v_splitLine + "," )
                                )
                             || ( v_filterOption      == "OPERATOR"
                                  && v_splitOperator != ""
                                  && v_filterValue.includes( "," + v_splitOperator + "," )
                                )
                             || ( v_filterOption      == "BOTH"
                                  && v_filterValue.slice( 0, v_filterValue.indexOf( '|' ) ) != ""
                                  && v_splitLine     != ""
                                  && v_filterValue.slice( 0, v_filterValue.indexOf( '|' ) ) + ",".includes( "," + v_splitLine + "," )
                                  && v_filterValue.slice( v_filterValue.indexOf( '|' ) + 1, v_filterValue.length ) != ""
                                  && v_splitOperator != ""
                                  && "," + v_filterValue.slice( v_filterValue.indexOf( '|' ) + 1, v_filterValue.length ).includes( "," + v_splitOperator + "," )
                                )
                           ) {

                            arr_busData.push( [ v_splitAimed
                                              , v_splitLine
                                              , v_infoLine
                                              , v_splitEstimate
                                              , v_splitReason
                                              ]
                                            );

                            v_validElements += 1;

                        }

                        v_scanJSON += 1;

                    }  // while ( v_scanJSON < v_lineIDElements ) 

                    if ( v_validElements == 0 ) {

                        // We filtered everything out and have nothing to show 

                        setHeader( v_displayHeader );

                        v_sliceMessage = "Filter setup means all rows are hidden!";
                        sliceMessage( v_sliceMessage, "A", 1, true );

                        v_sliceMessage = "Filter Opt=" + v_filterOption;
                        sliceMessage( v_sliceMessage, "A", 3, true );

                        v_sliceMessage = "Filter Val=" + v_filterValue;
                        sliceMessage( v_sliceMessage, "A", 4, true );

                    } else {

                        // Get any cancellation information for the entries we are displaying 

                        let v_cancellations      = "";
                        let v_cancellationReason = "";
                        let v_cancelledAimed     = "";
                        let v_cancelledLine      = "";

                        v_scanJSON               = 0;

                        while ( ( v_scanJSON < v_validElements ) && ( v_scanJSON < 5 ) ) {

                            v_cancelledAimed     = arr_busData[v_scanJSON][0];  // Aimed Departure Time for cancelled service
                            v_cancelledLine      = arr_busData[v_scanJSON][1];  // Bus Line that has been cancelled 
                            v_cancellationReason = arr_busData[v_scanJSON][4];  // Cancellation reason 

                            if ( v_cancellationReason.trim() != "" ) {

                                // Try and associate the cancellation text with the cancelled bus (in case of multiple cancellations)

                                v_cancellations += v_cancelledLine
                                                   + "@"
                                                   + v_cancelledAimed
                                                   + ": "
                                                   + v_cancellationReason.trim()
                                                   + " ... ";

                            }

                            v_scanJSON += 1;

                        }

                        if ( v_cancellations == "" ) {

                            v_cancellations = "No cancellation information available ... ";

                        }

                        // Now we know what we want to display, display it!

                        v_scanJSON = 0;

                        setHeader( v_displayHeader );

                        while ( ( v_scanJSON < v_validElements ) && ( v_scanJSON < 5 ) ) {

                            sliceMessage( arr_busData[v_scanJSON][0], "A", v_scanJSON, false );  // Aimed time i.e. planned departure 
                            sliceMessage( arr_busData[v_scanJSON][1], "B", v_scanJSON, false );  // Bus line 
                            sliceMessage( arr_busData[v_scanJSON][2], "C", v_scanJSON, false );  // Direction 
                            sliceMessage( arr_busData[v_scanJSON][3], "D", v_scanJSON, false );  // Estimated time 

                            v_scanJSON += 1;

                        }

                        setFooter( v_cancellations );

                    }  // if ( v_validElements == 0 ) 

                }  // if ( v_lineID.departures == null ) 

            }  // xhr.onload = function()

        }  // if ( v_apisaver == "ON" )

		    // Snooze for the alloted time then re-run the main proc!

		    setTimeout( myMain, myTimer );

    }  // MyMain() 


    function clearDisplay() {

        // Clear out the five rows of departures so that late at night you aren't left with departed buses
        // Fill with spaces so that all five rows are always displayed
        // And ensure title and cancellations text are cleared as well 

        var v_clear = 0;

        setHeader( "&nbsp" );

        while ( v_clear < 5 ) {

            sliceMessage( "&nbsp", "A", v_clear, false );
            sliceMessage( "&nbsp", "B", v_clear, false );
            sliceMessage( "&nbsp", "C", v_clear, false );
            sliceMessage( "&nbsp", "D", v_clear, false );

            v_clear += 1;

        }

         setFooter( "&nbsp" );

    }  // clearDisplay()


    function setHeader( p_headerMessage ) {

        document.getElementById( "t_title" ).innerHTML = p_headerMessage.substring( 0, g_headerLen );

    }  // setHeader() 


    function setFooter( p_footerMessage ) {

        document.getElementById( "d_displaycanceltext" ).innerHTML = p_footerMessage;

    }  // setFooter() 


    function sliceMessage( p_sliceMessage, p_startingSection, p_lineNumber, p_sectionWrap ) {

        let v_thisSectionLen = 0;
        let v_nextSection    = null;

        switch ( p_startingSection.toUpperCase() ) {
              case "A":
                v_thisSectionLen = g_sectionALen;
                v_nextSection    = "B";
                break;
              case "B":
                v_thisSectionLen = g_sectionBLen;
                v_nextSection    = "C";
                break;
              case "C":
                v_thisSectionLen = g_sectionCLen;
                v_nextSection    = "D";
                break;
              case "D":
                v_thisSectionLen = g_sectionDLen;
                v_nextSection    = null;
        }

        document.getElementById( "d_displayline"
                                 + p_lineNumber
                                 + p_startingSection.toLowerCase()
                               ).innerHTML = p_sliceMessage.slice( 0
                                                                 , v_thisSectionLen
                                                                 );

        if ( p_sliceMessage.length > v_thisSectionLen
             && v_nextSection != null
             && p_sectionWrap == true
           ) {

            sliceMessage( p_sliceMessage.slice( v_thisSectionLen, p_sliceMessage.length )
                        , v_nextSection
                        , p_lineNumber
                        , p_sectionWrap
                        );

        }

    }  // sliceMessage() 


    function queryTimetableTIMED( p_timetableSorted ) {

        let v_timetableEntries   = p_timetableSorted.length;
        let v_processRow         = 0;
        let v_foundMatch         = false;

        let v_dateNow            = new Date();
        let v_dayNow             = v_dateNow.getDay();  // 0 = Sun, 1 = Mon, etc 

        let v_configWeekday      = "";
        let v_configStartHour    = "";
        let v_configStartMinute  = "";
        let v_configATCOCode     = "";
        let v_configStopDesc     = "";
        let v_configFilterOption = "";
        let v_configFilterValue  = "";
        let v_configEndHour      = "";
        let v_configEndMinute    = "";

        while ( v_processRow < v_timetableEntries
                && !v_foundMatch
              ) {

            v_configWeekday      = p_timetableSorted[v_processRow][0];
            v_configStartHour    = p_timetableSorted[v_processRow][1];
            v_configStartMinute  = p_timetableSorted[v_processRow][2];
            v_configATCOCode     = p_timetableSorted[v_processRow][3];
            v_configStopDesc     = p_timetableSorted[v_processRow][4];
            v_configFilterOption = p_timetableSorted[v_processRow][5];
            v_configFilterValue  = p_timetableSorted[v_processRow][6];
            v_configEndHour      = p_timetableSorted[v_processRow][7];
            v_configEndMinute    = p_timetableSorted[v_processRow][8];

            if ( g_debugEnabled ) {

                // Handy for debugging purposes ! 

                console.log( ">" + v_configWeekday      + "<"
                           + ">" + v_configStartHour    + "<"
                           + ">" + v_configStartMinute  + "<"
                           + ">" + v_configATCOCode     + "<"
                           + ">" + v_configStopDesc     + "<"
                           + ">" + v_configFilterOption + "<"
                           + ">" + v_configFilterValue  + "<"
                           + ">" + v_configEndHour      + "<"
                           + ">" + v_configEndMinute    + "<"
                           );

            }  // if ( g_debugEnabled )

            if ( v_configWeekday        == ""
                 || v_configStartHour   == ""
                 || v_configStartMinute == ""
                 || v_configATCOCode    == ""
                 || v_configEndHour     == ""
                 || v_configEndMinute   == ""
               ) {

                // One of our mandatory columns is missing 

                return null;

            } else {

                if ( isNaN( v_configStartHour )
                     || isNaN( v_configStartMinute )
                     || isNaN( v_configEndHour )
                     || isNaN( v_configEndMinute )
                   ) {

                    // One of our time columns is not a number 

                    return null;

                } else {

                    if ( v_configWeekday.includes( v_dayNow )
                         || v_configWeekday == "*"
                       ) {

                        let v_startTime   = new Date( v_dateNow.setHours( v_configStartHour, v_configStartMinute, 0, 0 ) );
                        let v_endTime     = new Date( v_dateNow.setHours( v_configEndHour, v_configEndMinute, 0, 0 ) );
                        let v_currentTime = new Date();

                        if ( g_debugEnabled ) {

                            // Handy for debugging purposes ! 

                            console.log( "v_currentTime = " + v_currentTime );
                            console.log( "v_startTime   = " + v_startTime   );
                            console.log( "v_endTime     = " + v_endTime     );

                        }  // if ( g_debugEnabled )

                        if ( v_currentTime    >= v_startTime 
                             && v_currentTime <  v_endTime
                           ) {

                            v_foundMatch = true;

                            if ( g_debugEnabled ) {

                                // Handy for debugging purposes ! 

                                console.log( "We got one! #Ghostbusters" );

                            }  // if ( g_debugEnabled )

                        }  // if ( v_currentTime >= v_startTime ...

                    }  // if ( v_configWeekday.includes( v_dayNow ) )

                }  // if ( isNaN( v_configStartHour )

            }  // if ( v_configWeekday          == "" ... 

            v_processRow += 1;

        }  // while ( v_processRow < v_timetableEntries )

        if ( v_foundMatch ) {

            return [ "OFF"                                  // API Saver is not enabled 
                   , v_configATCOCode
                   , "Departures from " + v_configStopDesc
                   , v_configFilterOption
                   , v_configFilterValue
                   ];

        } else {

            return [ "ON"  // API Saver is enabled 
                   , ""
                   , ""
                   , "" 
                   , ""
                   ];

        }  // if ( v_foundMatch )

    }  // queryTimetableTIMED() 


    function queryTimetableWINDOW( p_timetableSorted ) {

        let v_timetableEntries   = p_timetableSorted.length;
        let v_processRow         = 0;
        let v_foundMatch         = false;

        let v_dateNow            = new Date();
        let v_dayNow             = v_dateNow.getDay();  // 0 = Sun, 1 = Mon, etc 

        let v_configWeekday      = "";
        let v_configSetHour      = "";
        let v_configSetMinute    = "";
        let v_configATCOCode     = "";
        let v_configStopDesc     = "";
        let v_configFilterOption = "";
        let v_configFilterValue  = "";
        let v_configOffsetBefore = "";
        let v_configOffsetAfter  = "";

        while ( v_processRow < v_timetableEntries
                && !v_foundMatch
              ) {

            v_configWeekday      = p_timetableSorted[v_processRow][0];
            v_configSetHour      = p_timetableSorted[v_processRow][1];
            v_configSetMinute    = p_timetableSorted[v_processRow][2];
            v_configATCOCode     = p_timetableSorted[v_processRow][3];
            v_configStopDesc     = p_timetableSorted[v_processRow][4];
            v_configFilterOption = p_timetableSorted[v_processRow][5];
            v_configFilterValue  = p_timetableSorted[v_processRow][6];
            v_configOffsetBefore = p_timetableSorted[v_processRow][7];
            v_configOffsetAfter  = p_timetableSorted[v_processRow][8];

            if ( g_debugEnabled ) {

                // Handy for debugging purposes ! 

                console.log( ">" + v_configWeekday      + "<"
                           + ">" + v_configSetHour      + "<"
                           + ">" + v_configSetMinute    + "<"
                           + ">" + v_configATCOCode     + "<"
                           + ">" + v_configStopDesc     + "<"
                           + ">" + v_configFilterOption + "<"
                           + ">" + v_configFilterValue  + "<"
                           + ">" + v_configOffsetBefore + "<"
                           + ">" + v_configOffsetAfter  + "<"
                           );

            }  // if ( g_debugEnabled )

            if ( v_configWeekday         == ""
                 || v_configSetHour      == ""
                 || v_configSetMinute    == ""
                 || v_configATCOCode     == ""
                 || v_configOffsetBefore == ""
                 || v_configOffsetAfter  == ""
               ) {

                // One of our mandatory columns is missing 

                return null;

            } else {

                if ( isNaN( v_configSetHour )
                     || isNaN( v_configSetMinute )
                     || isNaN( v_configOffsetBefore )
                     || isNaN( v_configOffsetAfter )
                   ) {

                    // One of our numeric columns is not a number 

                    return null;

                } else {

                    if ( v_configWeekday.includes( v_dayNow )
                         || v_configWeekday == "*"
                       ) {

                        let v_configTime  = new Date( v_dateNow.setHours( v_configSetHour, v_configSetMinute, 0, 0 ) );
                        let v_startTime   = new Date( v_configTime.getTime() - ( v_configOffsetBefore * 60 * 1000 ) );
                        let v_endTime     = new Date( v_configTime.getTime() + ( v_configOffsetAfter  * 60 * 1000 ) );
                        let v_currentTime = new Date();

                        if ( g_debugEnabled ) {

                            // Handy for debugging purposes ! 

                            console.log( "v_currentTime = " + v_currentTime );
                            console.log( "v_configTime  = " + v_configTime  );
                            console.log( "v_startTime   = " + v_startTime   );
                            console.log( "v_endTime     = " + v_endTime     );

                        }  // if ( g_debugEnabled )

                        if ( v_currentTime    >= v_startTime 
                             && v_currentTime <  v_endTime
                           ) {

                            v_foundMatch = true;

                            if ( g_debugEnabled ) {

                                // Handy for debugging purposes ! 

                                console.log( "We got one! #Ghostbusters" );

                            }  // if ( g_debugEnabled )

                        }  // if ( v_currentTime >= v_startTime ...

                    }  // if ( v_configWeekday.includes( v_dayNow ) )

                }  // if ( isNaN( v_configSetHour )

            }  // if ( v_configWeekday          == "" ... 

            v_processRow += 1;

        }  // while ( v_processRow < v_timetableEntries )

        if ( v_foundMatch ) {

            return [ "OFF"                                  // API Saver is not enabled 
                   , v_configATCOCode
                   , "Departures from " + v_configStopDesc
                   , v_configFilterOption
                   , v_configFilterValue
                   ];

        } else {

            return [ "ON"  // API Saver is enabled 
                   , ""
                   , ""
                   , "" 
                   , ""
                   ];

        }  // if ( v_foundMatch )

    }  // queryTimetableWINDOW() 


    function queryTimetableALTERNATE( p_timetableSorted ) {

        let v_timetableEntries       = p_timetableSorted.length;
        let v_processRow             = 0;

        let v_dateNow                = new Date();
        let v_dayNow                 = v_dateNow.getDay();  // 0 = Sun, 1 = Mon, etc 

        let v_configThisWeekday      = "";
        let v_configThisHour         = "";
        let v_configThisMinute       = "";
        let v_configThisATCOCode     = "";
        let v_configThisStopDesc     = "";
        let v_configThisFilterOption = "";
        let v_configThisFilterValue  = "";

        let v_configPrevWeekday      = "";
        let v_configPrevHour         = "";
        let v_configPrevMinute       = "";
        let v_configPrevATCOCode     = "";
        let v_configPrevStopDesc     = "";
        let v_configPrevFilterOption = "";
        let v_configPrevFilterValue  = "";

        while ( v_processRow < v_timetableEntries ) {

            v_configThisWeekday      = p_timetableSorted[v_processRow][0];
            v_configThisHour         = p_timetableSorted[v_processRow][1];
            v_configThisMinute       = p_timetableSorted[v_processRow][2];
            v_configThisATCOCode     = p_timetableSorted[v_processRow][3];
            v_configThisStopDesc     = p_timetableSorted[v_processRow][4];
            v_configThisFilterOption = p_timetableSorted[v_processRow][5];
            v_configThisFilterValue  = p_timetableSorted[v_processRow][6];

            if ( g_debugEnabled ) {

                // Handy for debugging purposes ! 

                console.log( ">" + v_configThisWeekday      + "<"
                           + ">" + v_configThisHour         + "<"
                           + ">" + v_configThisMinute       + "<"
                           + ">" + v_configThisATCOCode     + "<"
                           + ">" + v_configThisStopDesc     + "<"
                           + ">" + v_configThisFilterOption + "<"
                           + ">" + v_configThisFilterValue  + "<"
                           );

            }  // if ( g_debugEnabled )

            if ( v_configThisWeekday   == ""
                 || v_configThisHour   == ""
                 || v_configThisMinute == ""
               ) {

                // One of our mandatory columns is missing 

                return null;

            } else if ( v_configThisWeekday.length   > 1
                        || v_configThisHour.length   > 2
                        || v_configThisMinute.length > 2
                      ) {

                // One of our columns isn't set up properly which will affect sorting 

                return null;

            } else if ( isNaN( v_configThisWeekday )
                        || isNaN( v_configThisHour )
                        || isNaN( v_configThisMinute )
                      ) {

                    // One of our numeric columns is not a number 

                    return null;

            } else {

                if ( v_processRow > 0  // If it's the first row we have nothing to compare against 
                     && ( v_dayNow >= v_configPrevWeekday )
                     && ( v_dayNow <= v_configThisWeekday )
                   ) {

                    let v_startDate   = new Date();
                    let v_endDate     = new Date();

                    v_startDate.setDate( v_startDate.getDate() + ( v_configPrevWeekday - v_dayNow ) );
                    let v_startTime   = new Date( v_startDate.setHours( v_configPrevHour, v_configPrevMinute, 0, 0 ) );

                    v_endDate.setDate( v_endDate.getDate() + ( v_configThisWeekday - v_dayNow ) );
                    let v_endTime     = new Date( v_endDate.setHours( v_configThisHour, v_configThisMinute, 0, 0 ) );

                    let v_currentTime = new Date();

                    if ( g_debugEnabled ) {

                        // Handy for debugging purposes ! 

                        console.log( "v_currentTime = " + v_currentTime );
                        console.log( "v_startTime   = " + v_startTime   );
                        console.log( "v_endTime     = " + v_endTime     );

                    }  // if ( g_debugEnabled )

                    if ( v_currentTime    >= v_startTime 
                         && v_currentTime <  v_endTime
                       ) {

                        if ( g_debugEnabled ) {

                            // Handy for debugging purposes ! 

                            console.log( "We got one! #Ghostbusters" );

                        }  // if ( g_debugEnabled )

                        break;  // Drop out of the while loop so we don't overwrite the Prev values 

                    }  // if ( v_currentTime >= v_startTime ...

                }  // if ( v_processRow > 0 ...

                // Now move current values to previous and loop around again 

                v_configPrevWeekday      = v_configThisWeekday;
                v_configPrevHour         = v_configThisHour;
                v_configPrevMinute       = v_configThisMinute;
                v_configPrevATCOCode     = v_configThisATCOCode;
                v_configPrevStopDesc     = v_configThisStopDesc;
                v_configPrevFilterOption = v_configThisFilterOption;
                v_configPrevFilterValue  = v_configThisFilterValue;

            }  // if ( v_configThisWeekday   == "" ... 

            v_processRow += 1;

        }  // while ( v_processRow < v_timetableEntries )

        if ( v_configPrevATCOCode != "" ) {

            // Whether we find a match or not, the Prev values should determine what config is used 

            return [ "OFF"                                  // API Saver is not enabled 
                   , v_configPrevATCOCode
                   , "Departures from " + v_configPrevStopDesc
                   , v_configPrevFilterOption
                   , v_configPrevFilterValue
                   ];

        } else {

            return [ "ON"  // API Saver is enabled 
                   , ""
                   , ""
                   , "" 
                   , ""
                   ];

        }  // if ( v_configPrevATCOCode != "" ) 

    }  // queryTimetableALTERNATE() 

    </script>

  </body>

</html>
