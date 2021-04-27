Version 1.0 of TransportAPI Bus Times Widget
(C) K.Fairhurst 2021
This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. 

v1.0   Initial Release


Based on NR Departure Board widget by Richard Farnworth
https://richardfarnworth.wordpress.com/code-samples/ 

Following configuration items are used to determine how the widget will work

Sign up for a free account at https://developer.transportapi.com
You will be provided with an APP ID and an APP KEY
Enter those values; this will be used to construct the appropriate URL later on


As standard, widget will refresh every 3 minutes
Free TransportAPI account provides you with 1000 API calls per day - enough for 50 hours
This reduces to 100 calls per day if you use NextBuses datasource (e.g. for bus stops outside of London) - enough for 5 hours
Set g_nextbuses = "yes" to enable this datasource or "no" to disable 


Following option controls how the information is output in the third column 
This is used to combine the bus Destination information with Operator information

    If set to "" or "OFF" then Operator information will be excluded 
    If set to "SHORT" then 4 character Operator code will be appended to Destination 
    If set to "FULL" then Operator Name will be shown, with Destination appended if it will fit 


Following option controls which methodology we're going to use to codify the timetable
If we're using the NextBuses option, the API limit would be breached by 5am if we check constantly
As such this allows us to turn stops on and off at different times of the day, by enabling API Saver mode
There are three ways of doing this, hence three possible values... examples for each shown later!

TIMED
When this option is used, you will be providing the start and stop times for each day on a single row
The same timetable can be easily used for multiple days

WINDOW
When this option is used, you will be providing a specific time, e.g. the bus which you would normally catch
You then provide a number of minutes before & after that you want the info to be shown, on the same line
Different entries can therefore have different windows, depending on requirements
The same timetable can be easily used for multiple days

ALTERNATE
With this option, we sort the timetable to ensure it's in chronological order first
We then step through, until the current record is in the past, and the next record is in the future
    If the current record has an ATCO code, we use those details.
    If the current record does not have an ATCO code, we enable the API saver.

This allows for fine-grained control of the timetable, e.g. to change stops without having to add end-time for previous entry
Note that we can only show time for one stop at once in a single widget
Use multiple widgets if you need to show multiple stops concurrently


The final configuration entry is the timetable that we're going to use
This is set up as an array of arrays, and is interrogated by the logic to determine what information to show

The following fields are used to configure what buses we are interested in

Day of Week - "0" (Sunday) to "6" (Saturday), or "*" for every day of the week
              When using TIMED or WINDOW methods, can also be a comma separated list of days e.g. "1,2,3,4,5" for every weekday
              When using ALTERNATE method this must be a single digit - wildcard "*" will not work 

Hour - A value between 00 and 23
       When using ALTERNATE method this must be two digits, with a leading zero, to ensure accurate sorting e.g. 07 for 7am

Minute - A value between 00 and 59
         When using ALTERNATE method this must be two digits, with a leading zero, to ensure accurate sorting e.g. 05 for 5 minutes past the hour

ATCO Code - This is the unique code relating to the bus stop you are interested in
            When using ALTERNATE method, setting it to "" enables API saver at that point
            Find relevant ATCO codes using steps documented at 
            http://docs.transportapi.com/index.html?raml=https://transportapi.com/v3/raml/transportapi.raml##bus_information

Stop Description - We try to retrieve information about the stop from the JSON message. This will be used if we cannot find anything in the JSON
                   It also makes it easier to remember which stop is which when looking back at configuration settings 
                   * This field is optional, set to "" if not needed *

Filter Option - Some bus stops only serve a couple of different routes, others serve a lot more
                By using filters we can ensure we only see the data we're interested in
                    If this is set to "" or "OFF" then we don't filter the data at all
                    If this is set to "LINE" then we only include bus information if the bus line is included in the filter value setting
                    If this is set to "OPERATOR" then we only include information for buses run by operators in the filter value
                    If this is set to "BOTH" you need to configure LINE and OPERATOR information in the filter value
                This means that in circumstances where multiple operators serve a single route, you can limit the information to
                just what you need to see (for example, you might have a travel pass with one of the operators)
                * This field is optional, set to "" if not needed *

Filter Value - Depending on the Filter Option chosen, this is either used to filter by LINE, OPERATOR or BOTH
               If LINE this should contain the bus route, this is usually what appears on the front of the bus!
               If OPERATOR, it's the four character short code used to identify the operator
                   (if you're not sure what to set this to, set g_includeOperator = "SHORT" and see what is output!)
               If BOTH then this value should contain the bus route followed by a | pipe followed by the operator short code
               Multiple lines (or operators, or both) can be specified, separate with commas
               * This field is optional, set to "" if not needed *

Method Specific configuration :

    If you are using the TIMED method then two additional fields are required to determine the end time for the display

        Hour To - A value between 00 and 23
        Minute To - A value between 00 and 59

    If you are using the WINDOW method then two additional fields are required to determine the start and end time for the display
    The time you provide will be the baseline e.g. this could be the time of departure of the bus you are aiming to catch

        Offset Before - Number of minutes to subtract from baseline time
        Offset After - Number of minutes to add to baseline time


The following examples all configure the same target timetable for the three different methods 
The method you choose will ultimately depend on your requirements 

TIMED

[ [ "1,2", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19", "11", "30" ]
, [ "1,2", "16", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "18", "00" ]
, [ "3,5", "07", "00", "300000075GS", "Corby George Street", "LINE", "X4,19", "09", "00" ]
, [ "3",   "16", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "18", "00" ]
, [ "5",   "11", "45", "300000181GS", "Tresham College",     "LINE", "X4",    "13", "45" ] 
]

WINDOW

[ [ "1,2", "10", "45", "300000075GS", "Corby George Street", "LINE", "X4,19", "75", "45" ]
, [ "1,2", "17", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "60", "60" ]
, [ "3,5", "08", "15", "300000075GS", "Corby George Street", "LINE", "X4,19", "75", "45" ]
, [ "3",   "17", "00", "300000181GS", "Tresham College",     "LINE", "X4",    "60", "60" ]
, [ "5",   "12", "45", "300000181GS", "Tresham College",     "LINE", "X4",    "60", "60" ]
]

ALTERNATE

[ [ "1", "09", "30", "300000075GS", "Corby George Street", "LINE", "X4,19" ]
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
]
