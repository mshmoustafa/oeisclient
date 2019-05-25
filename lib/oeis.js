/**
 * Provides convenient functions for performing requests to the OEIS database.
*/
class OEIS {
    /**
     * OEIS is a singleton object that provides convenient functions for performing requests to the OEIS database.
     * @param language the language that the search results should be in
     * @param useProxy true = requests should be sent to a proxy (should be false unless debugging)
     */
    constructor(language, useProxy) {
        /**
         * language that the search results should be in. defaults to "english"
         */
        this.language = "english";
        if (useProxy) {
            this.proxy = "http://crossorigin.me/";
        }
        else {
            this.proxy = "";
        }
        this.endpoint = this.proxy + "http://oeis.org/";
        this.language = language;
    }
    buildSearchURLWithID(language, id, format) {
      let URL = this.endpoint + "search?" + "language=" + language + "&" + "q=" + "id:" + id + "&" + "fmt=" + format;
      return URL;
    }
    buildSearchURLWithTerms(language, terms, format, start) {
      let URL = this.endpoint + "search?" + "language=" + language + "&" + "q=" + terms.toString() + "&" + "fmt=" + format + "&" + "start=" + start;
      return URL;
    }
    /**
     * Searches the OEIS by the sequence's ID (e.g. A000045)
     * @param id The ID of the sequence. Must be a string: preceded by an 'A' and have six digits OR preceded by an 'M' or 'N' and have four digits. Note that if the ID is not in the correct format, OEIS will treat it as a general search query and may return more than one result. Examples: "A000045", "M0692", "N0256"
     * @param format "json" or "text"
     * @param callback a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
     * @param context an optional context in which to call the callback (callback.apply(context)).
     */
    searchByID(id, format, callback) {
        if (!format) {
            format = "html";
        }
        let URL = this.buildSearchURLWithID(this.language, id, format);
        this.doRequest(URL, format, callback);
    }
    /**
     * Searches the OEIS by terms in a sequence (e.g. 1,1,2,3,5) with start=0.
     * @param terms an array of the terms
     * @param format "json" or "text"
     * @param callback a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
     * @param context an optional context in which to call the callback (callback.apply(context)).
     */
    searchByTerms(terms, format, callback) {
        this.searchByTermsAndStart(terms, 0, format, callback);
    }
    /**
     * Searches the OEIS by terms in a sequence (e.g. 1,1,2,3,5) and a start.
     * @param terms an array of the terms
     * @param start OEIS returns at most 10 results at a time, so start is used to adjust which results are retrieved. Example: start=0 gets the first 10 search results, start=10 will get the next 10 search results, etc.
     * @param format "json" or "text"
     * @param callback a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
     * @param context an optional context in which to call the callback (callback.apply(context)).
     */
    searchByTermsAndStart(terms, start, format, callback) {
        if (!format) {
            format = "html";
        }
        let URL = this.buildSearchURLWithTerms(this.language, terms, format, start);
        this.doRequest(URL, format, callback);
    }
    /**
     * Searches the OEIS by a query string (e.g. '2,3,6,16 "symmetric group" author:Stanley') and start=0
     * @param queryString A string consisting of a query similar to what one might type in the search bar on the OEIS website. This string will be URI encoded before the request is sent, so the string really should be as one would type on the website. Example: '2,3,6,16 "symmetric group" author:Stanley'
     * @param format "json" or "text"
     * @param callback a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
     * @param context an optional context in which to call the callback (callback.apply(context)).
     */
    searchByQuery(queryString, format, callback) {
        this.searchByQueryAndStart(queryString, 0, format, callback);
    }
    /**
     * Searches the OEIS by a query string (e.g. '2,3,6,16 "symmetric group" author:Stanley') and a start
     * @param queryString A string consisting of a query similar to what one might type in the search bar on the OEIS website. This string will be URI encoded before the request is sent, so the string really should be as one would type on the website. Example: '2,3,6,16 "symmetric group" author:Stanley'
     * @param start OEIS returns at most 10 results at a time, so start is used to adjust which results are retrieved. Example: start=0 gets the first 10 search results, start=10 will get the next 10 search results, etc.
     * @param format "json" or "text"
     * @param callback a function that is called with the search results passed as an argument. The argument is either a JavaScript object if the format specified was "json" or text otherwise.
     * @param context an optional context in which to call the callback (callback.apply(context)).
     */
    searchByQueryAndStart(queryString, start, format, callback) {
        if (!format) {
            format = "html";
        }
        let URL = this.endpoint + "search?" + "language=" + this.language + "&" + "q=" + encodeURIComponent(queryString) + "&" + "fmt=" + format + "&" + "start=" + start;
        this.doRequest(URL, format, callback);
    }
    /**
     * Convenience method that executes an XMLHttpRequest. Not meant for public use. For making requests, please use OEIS.searchBy() family of functions.
     * @param URL
     * @param format
     * @param callback
     * @param context an optional context in which to call the callback (callback.apply(context)).
     */
    //TODO: add xhr.onerror
    //TODO: add xhr.ontimeout
    doRequest(URL, format, callback) {
        let xhr = this.createCORSRequest("GET", URL, this, format, callback);
        if (!xhr) {
            //console.log("CORS not supported");
            throw new Error('CORS not supported');
        }
        xhr.send();
    }
    // Based heavily on code found on www.html5rocks.com by
    // Monsur Hossain.
    // https://www.html5rocks.com/en/tutorials/cors/
    // Convenience method that creates and returns an XMLHttpRequest. Not meant for public use. For making requests, please use the OEIS.searchBy() family of functions.
    createCORSRequest(method, url, oeis, format, callback) {
        let xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);
        }
        // else if (typeof XDomainRequest != "undefined") {
        //     // Otherwise, check if XDomainRequest.
        //     // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        //     xhr = new XDomainRequest();
        //     xhr.open(method, url);
        // }
        else {
            // Otherwise, CORS is not supported by the browser.
            xhr = null;
        }
        xhr.oeis = oeis;
        xhr.customCallback = callback;
        xhr.format = format;
        // xhr.onload is called after a successful request.
        xhr.onload = function () {
            //console.log("request successful");
            this.oeis.lastRequest = xhr.responseText;
            if (this.customCallback) {
                let customCallback = this.customCallback;
                let customContext = this.customContext;
                //console.log("callback defined");
                // Check if format is set in order to determine in which format to return the response.
                if (this.format) {
                    let theFormat = this.format;
                    //console.log("format specified");
                    // check if format has toLowerCase and trim methods (i.e. check if format is a string)
                    if (theFormat.toLowerCase && theFormat.trim) {
                        //console.log("format is a string");
                        let cleanFormat = theFormat.toLowerCase().trim();
                        if (cleanFormat === "json") {
                            //console.log("calling callback with JSON");
                            //console.log(typeof(callback));
                            //console.log(xhr.responseText);
                            callback(JSON.parse(xhr.responseText));
                        }
                        else if (cleanFormat === "text") {
                            callback(xhr.responseText);
                        }
                        else if (cleanFormat === "png") {
                            callback(xhr.response);
                        }
                    }
                }
                else {
                    //console.log("no format specified");
                    callback(xhr.responseText);
                }
            }
            else {
                //console.log("callback undefined");
            }
        };
        xhr.onerror = function () {
            //console.log("xhr error");
        };
        xhr.ontimeout = function () {
            //console.log("xhr timeout");
        };
        return xhr;
    }
    getURLForGraph(id) {
      let url = this.endpoint + id + "/graph?png=1";
      return url;
    }
    // Retrieves the graph for a sequence by the sequence's ID.
    // id: A string containing the ID of the sequence. Example: "A000045".
    // format: "png"
    // callback: a function that is called with the data passed as an argument. The argument is returned as data since the format is PNG.
    getGraphForSequenceID(id, format, callback) {
        if (!format) {
            format = "png";
        }
        let URL = this.getURLForGraph(id);
        this.doRequest(URL, format, callback);
    }
    getURLForList(id) {
      let url = this.endpoint + id + "/list";
      return url;
    }
    getURLForRefs(id) {
      let url = this.endpoint + "/search?q=" + id + "+-id:" + id;
      return url;
    }
    getURLForListen(id) {
      let url = this.endpoint + id + "/listen";
      return url;
    }
    getURLForHistory(id) {
      let url = this.endpoint + "history?seq=" + id;
      return url;
    }
    getURLForText(id) {
      let url = this.buildSearchURLWithID("", id, "text");
      return url;
    }
    getURLForInternalFormat(id) {
      let url = this.endpoint + id + "/internal";
      return url;
    }
}
/**
 * Defines a sequence returned by OEIS. No property is
 * guaranteed to be present, so check existence before using
 * a property.
 */
class OEISSequence {
    constructor(jsonObject) {
        this.number = jsonObject["number"];
        this.id = jsonObject["id"];
        this.data = jsonObject["data"];
        this.name = jsonObject["name"];
        this.keyword = jsonObject["keyword"];
        this.offset = jsonObject["offset"];
        this.author = jsonObject["author"];
        this.references = jsonObject["references"];
        this.revision = jsonObject["revision"];
        this.time = jsonObject["time"];
        this.created = jsonObject["created"];
        this.comment = jsonObject["comment"];
        this.reference = jsonObject["reference"];
        this.link = jsonObject["link"];
        this.formula = jsonObject["formula"];
        this.example = jsonObject["example"];
        this.maple = jsonObject["maple"];
        this.mathematica = jsonObject["mathematica"];
        this.program = jsonObject["program"];
        this.xref = jsonObject["xref"];
        this.ext = jsonObject["ext"];
    }
}
class OEISResponse {
    constructor(jsonObject) {
        this.greeting = jsonObject["greeting"];
        this.query = jsonObject["query"];
        this.count = jsonObject["count"];
        this.start = jsonObject["start"];
        this.results = jsonObject["results"];
    }
}

export { OEIS, OEISSequence, OEISResponse };
// var defaultOEIS: OEIS = new OEIS("english", false);
