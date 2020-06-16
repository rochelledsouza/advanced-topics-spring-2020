let public_spreadsheet_key = 'https://docs.google.com/spreadsheets/d/1wI0aPsu-I-ey7fM6LOKpJG4Cz-TaTFUihMQsNapijnE/pubhtml?gid=0&single=true';
let mytables = Tabletop.init( { key: public_spreadsheet_key,
    parseNumbers: true,
    postProcess: jsonifyStrings,
    callback: processInfo ,
    simpleSheet: false } );
    function processInfo(sheets) {
        // console.log(sheets);
        var data = sheets["popcorn-data"].all();
            for (let event of data) {
            // uncomment this for debugging
            // console.log(event);
    
            // first we're going to collect all the non-empty values from the row
            // in a new object
            let params = {};
           
            Object.keys(event).forEach((prop) => {
                if (event[prop]) { params[prop] = event[prop]; }
            });
            // this is another debugging line -- if things aren't working right you can
            // uncomment it & see what's going wrong in the console.  
            // console.log(pop);
        }
    }