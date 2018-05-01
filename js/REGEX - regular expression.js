// **** Regular Expression **** //

// type of single chars //
. => any letter
\d => digit
\D => // anything that is not a digit //
\w => A-Za-z0-9 // any character that you would find as part of a word //
\W => // anything that is NOT part of a word //
\s => space,tab.\n // any white space //
\S => // anything that is NOT a white space //


// quantifires //
* => zero or more
+ => one or more
? => zero or one
{min,max} => range of amount, example : \s{3,5} // group of 3 to 5 white space //
{n} => n amount of a something


// position //
^ => begining of a line
$ => end of the line
\b => word boundary // inside a word //


// meta characters (can always use static chars => i,e = l[oO]l) => can be lol or lOl//
[abc] => one character that match etiehr a or be or c
[a-zA-Z] => any character between a to z or A to Z
[0-9] => any character that is a digit
[^abc] => any character that is NOT a or b or c
[a^bc] => irrelevant use => [^b]
(net|com|edu) => matches either 'net' or 'com' or 'edu'


// other useful combinations //
\[.*\] => will catch '[]...[]', \[.*?\] => separately catch '[]','[]'
\b(\w+)\s\1\b => when the exact same word follow by the same word => 'bow bow'

// Flags //
g => global, match all not just the first thing
i => case insensitive

// REGEX on Javascript //
var myRegex = new RegExp("[a-zA-Z]");
/[a-zA-Z]/ = myRegex // same thing usually declaring regex with /../ //
/hello/ => will match "hello"
let rgx = /[a-z]+/gi; // any word (not '') match globaly case insensitive //
rgx.test('ddff33'); // returns true or false, here false because 33 is not a a-z
let myString = 'ssds sdsdsd';
myString.match('/\d{3}\d{4}/'); => returns an array of strings with all the matches
myString.exec('/\d{3}\d{4}/'); => returns an array of the NEXT occurance of the match // i.e
    while (result != null) { result = myString.exec('/\d{3}\d{4}/') }
myString.split(/\s+/); // split the string to an array of things between spaces //
myString.replace(/\s+/, ""); // will return a string without the FIRST space //
myString.replace(/\s+/g, ""); // will return a string without ANY space //
// replace with a function //
function getReplacedWord(match) {
    /** return a 'replace' word only if match has 4 characters */
    return (match == 4) ? 'replace' : match;
}
myString.replace(/\s+/g, getReplacedWord);
        // returns the string with every 4 letter space replaced to 'replace' //