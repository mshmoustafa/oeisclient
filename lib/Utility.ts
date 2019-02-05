/**
 * Contains various utility functions.
 */

class Utility {
    /**
     * Adds spaces between a comma-separated string. e.g. a,b,c,d -> a, b, c, d
     * @param {string} the_string - the string
     * @return {string} the string with spaces after commas
     */
    static addSpacesBetweenCommas(the_string: string): string {
        return the_string.replace(/,/g, ", ");
    }
    /**
     * Converts a number to six-digit format found on OEIS. e.g. 45 -> A000045
     * @param {number} number - the number to convert
     * @return {string} the six digit number as a string
     */
    static prettifyNumber(number: number): string {
        var prettyNumber = (("" + number) as any).padStart(6, "0");
        prettyNumber = "A" + prettyNumber;
        return prettyNumber;
    }
    /**
     * Preserves spaces in a string by using the character code. To be used with regex functions (e.g. replace)
     * @return {string} the new string
     */
    static preserveLeadingSpacesAsText(): string {
        var leadingSpaces = arguments[0].length;
        var str = "";
        while(leadingSpaces > 0) {
            str += "\xa0";
            leadingSpaces--;
        }
        return str;
    }
    /**
     * Preserves spaces in a string by using the HTML code. To be used with regex functions (e.g. replace)
     * @return {string} the new string
     */
    static preserveLeadingSpacesAsHTML(): string {
        var leadingSpaces = arguments[0].length;
        var str = "";
        while (leadingSpaces > 0) {
            str += "&nbsp;";
            leadingSpaces--;
        }
        return str;
    }
    /**
     * Turns an author string of the format \_name\_ into a link.
     * To be used in a regex.
     */
    static convertAuthorToLink() {
        var x = arguments[0];
        // Removes the second and second-to-last characters.
        // x = x.slice(0,1) + x.slice(2, -2) + x.slice(-1);
        x = x.slice(1, -1);
        var nice = x + "";
        // x.replace(/ /g, "_");
        x = x.split(" ").join("_");
        x = "https://oeis.org/wiki/User:" + x;
        x = "<a href='" + x + "'>" + nice + "</a>";
        return x;
    }
    static convertIDToLink() {
        let x = arguments[0];
        x = "<a href='#' class='sequence-link'>" + x + "</a>";
        return x;
    }
    /**
     * A regular expression to find names of the format "\_Some name\_"
     * Allows for periods, spaces, and numbers in the name but no special characters (unfortunately, this also means letters with diacritics).
     */
    static regexAuthor = new RegExp(/_[a-zA-Z\.\-]+\s+[\w\s\.\-]*_/gm)
    /**
     * A regular expression to find chunks of whitespace (1 or more)
     */
    static regexSpaces = new RegExp(/^[ \t]+/gm)
    /**
     * A regular expression to find id's of the form A000000
     */
    static regexSequenceID = new RegExp(/A\d\d\d\d\d\d/gm);
};