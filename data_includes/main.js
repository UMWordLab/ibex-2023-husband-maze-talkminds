// script by Lisa Levinson
// adapted from Husband 2022

PennController.ResetPrefix(null); // Shorten command names (keep this line here))
//PennController.DebugOff();

var shuffleSequence = seq("setup", "intro",
                        "startpractice",
                        sepWith("sep", seq("practice")),
 // putting counter after practice so it won't increment all at the same time when participants show up, as that messes up lists
                        "setcounter",
                        "starter",
 // trials named _dummy_ will be excluded by following:
                        sepWith("sep", rshuffle(startsWith("husb"))),
 						"sendresults",
                        "completion"
                );


// Welcome screen and logging user's ID
newTrial("setup",
     // Automatically print all Text elements
    defaultText
        .cssContainer({"margin-bottom":"1em", "margin-left":"5em"})
        .print()
    ,
    defaultTextInput
        .css("margin","1em")    // Add a 1em margin around this element
        .css("margin-left", "6em")
        .print()
        ,
    defaultDropDown
        .css("margin","1em")    // Add a 1em margin around this element
        .css("margin-left", "6em")
        .print()
        ,
    newText("Hi!")
    ,
    newText("To get started, we'll collect some basic information so that we can assign you credit and compare results across English language background groups.")
    ,
    newText("Enter your uniqname (<b>without the @umich.edu</b>):")
    ,
    // ID input
    newTextInput("inputID", "")
  //     .center()
    ,
    newText("We will be using a 'secret code' to share your data so that you can find it but others cannot identify it as yours for all experiments run in this class. You should use the same code for all experiments, so create one and note it down (or add to a password keeper) to be able to find your results and use on other future experiments. If you have already created a code for another experiment, enter that one here. If you haven't created your code yet, please make one that is <b>at least 8 characters long</b>. This should be something relatively unique, but appropriate for sharing with the class on an open website. Data with missing, offensive, or inappropriate codes will not be posted (so you will not be able to see your result):")
    ,
    // ID input
    newTextInput("codeID", "")
    ,
    newText("Was <b>English</b> a primary or dominant language of your environment for most of your first ten years?")
    ,
    // English input
    newDropDown("inputEnglish" , "")
        .add( "yes" , "no" )
    ,
    newText("Was a <b>language other than English</b> a primary or dominant language of your environment for most of your first ten years? (including those bilingual with English)")
    ,
    // NonEnglish input
    newDropDown("inputNonEnglish" , "")
        .add( "yes" , "no" )
    ,
    newButton("Start")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    newVar("partID")
        .global()
        .set(getTextInput("inputID") )
    ,
    newVar("codeID")
        .global()
        .set(getTextInput("codeID") )
    ,
    newVar("English")
        .global()
        .set(getDropDown("inputEnglish") )
    ,
    newVar("NonEnglish")
        .global()
        .set(getDropDown("inputNonEnglish") )
)
//.log("partID", getVar("partID"))
//.log("codeID", getVar("codeID"))
.log("English", getVar("English"))
.log("NonEnglish", getVar("NonEnglish"))

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("partID").global()    
)
.log( "partid" , getVar("partID") ) // Add the ID to all trials' results lines
.log( "codeid" , getVar("codeID") ) // Add the ID to all trials' results lines

var showProgressBar =false;

var practiceItemTypes = ["practice"];

var manualSendResults = true;

// this doesn't work for pushed CSV items
var defaults = [
    "Maze", {redo: true}, //uncomment to try "redo" mode
];

// following is from the A-maze site to make breaks every 20 maze sentences
// you have to set the write number of total items and number of blocks to start with, and the right condition names, etc.
// calculate the following numbers to fill in the values below (not including practice trials-
// total maze sentences a participant will be presented: 80
// sentences per block: 20
// number of blocks: 4

function modifyRunningOrder(ro) {

  var new_ro = [];
  item_count=0;
  for (var i in ro) {
    var item = ro[i];
    // fill in the relevant experimental condition names on the next line
    if (item[0].type.startsWith("husb")) {
        item_count++;
        new_ro.push(item);
      // first number after item count is how many items between breaks. second is total-items - 1
        if (item_count%20===0 & item_count<79){
       // value here should be total_items - items_per_block (to trigger message that last block is coming up)
            if (item_count===60){
                text="End of block. Only 1 block left!";
                }
            else {
      // first number is the total number of blocks. second number is number of items per block
                text="End of block. "+(4-(Math.floor(item_count/20)))+" blocks left.";
            }ro[i].push(new DynamicElement("Message", 
                              { html: "<p>30-second break - stretch and look away from the screen briefly if needed.</p>", transfer: 30000 }));
        }
      } else {
      new_ro.push(item);
      }
  }
  return new_ro;
}

// template items will be pushed into native items = [] with fake PC trial _dummy_ output

// [["practice", 802], "Maze", {s:"Why was the boss smiling during the meeting?",
// a:"x-x-x card plan chaired filters allow push considerably?"}]

// load experimental stimuli from csv:

Template("husband_2022_stimuli.csv", row => {
    items.push(
        [[row.label, row.item] , "PennController", newTrial(
            newController("Maze", {s: row.sentence, a: row.alternative, redo: true})
              .print()
              .log()
              .wait()
        )
        .log("counter", __counter_value_from_server__)
        .log("label", row.label)
        .log("latinitem", row.item)
        .log("critical_position", row.critical_position)
        .log("target_article", row.target_article)
        .log("target_noun", row.target_noun)
        ]
    );
    return newTrial('_dummy_',null);
})

var items = [

	["setcounter", "__SetCounter__", { }],

	["sendresults", "__SendResults__", { }],

	["sep", "MazeSeparator", {normalMessage: "Correct! Press any key to continue", errorMessage: "Incorrect! Press any key to continue."}],

["intro", "Form", { html: { include: "intro1.html" } } ],

["startpractice", Message, {consentRequired: false,
	html: ["div",
		   ["p", "First you can do three practice sentences."]
		  ]}],

//
//  practice items
//

[["practice", 801], "Maze", {s:"The teacher perplexed the first class.", a:"x-x-x tends bisects done continues holy"}],
[["practice", 802], "Maze", {s:"The boss understandably smiled during the meeting.", a:"x-x-x about obligatoriness filters allow push considerably."}],
[["practice", 803], "Maze", {s:"The father chuckled while he cleaned.", a:"x-x-x slid quadratic goals add analyst."}],

   // message that the experiment is beginning


   ["starter", Message, {consentRequired: false,
	html: ["div",
		   ["p", "Time to start the main portion of the experiment!"]
		  ]}],

// completion: 

["completion", "Form", {continueMessage: null, html: { include: "completion.html" } } ]

// leave this bracket - it closes the items section
];

// prolific page URL: 
