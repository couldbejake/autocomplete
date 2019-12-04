// ==UserScript==
// @name         Job Application Auto Fill
// @namespace    http://github.com/couldbejake
// @version      0.1
// @description  A JS script to auto enter your information into job applications.
// @author       couldbejake
// @match        *://*/*
// @grant        none
// ==/UserScript==

/*

      A script to help you apply for software developer roles faster.
      Programmed by couldbejake @ github.com/couldbejake, use at your own risk!

      How to use:
        - Under the 'enter my details' section replace the fields surrounded by <> with your own details.
          - If there are any other fields you would like to change, add a new line inside the fillFields object.
        - Download tamper monkey for Google Chrome.
          - Press the tamper monkey button
          - Press 'Create a new script'
          - Paste this script in!


      Although this script doesn't catch every input field, it autofills a considerable amount!

      Enjoy!

*/

(function() {

    /* add window.jQuery if the page doesn't include it */
    if (typeof window.jQuery === 'undefined') {
        var jQueryEl = document.createElement('script');
        jQueryEl.src = 'https://code.jquery.com/jquery-3.4.1.slim.js';
        document.head.appendChild(window.jQueryEl);
    }

    /* ------------------------------------------------- Enter your details here -------------------------------------------------------*/
    /* set the inputs via found 'id' field, 'name' attributes or tag */
    var fillFields = [
        {searchFields : ['first_name', 'firstname', 'first name', 'nickname'], content: '<FIRST NAME HERE>', fieldType: 'text'},
        {searchFields : ['last_name', 'lastname', 'last name', 'surname'], content: '<LAST NAME HERE>', fieldType: 'text'},
        {searchFields : ['middle name', 'middle'], content: '<MIDDLE NAME HERE>', fieldType: 'text'},
        {searchFields : ['email', 'email_address'], content: '<EMAIL HERE>', fieldType: 'text'},
        {searchFields : ['tx_homeTel', 'phone', 'telephone', '<PHONE NUMBER HERE>', 'tel'], content: '<PHONE NUMBER HERE>', fieldType: 'text'},
        {searchFields : ['street address', 'address'], content: '<ADDRESS HERE>', fieldType: 'text'},
        {searchFields : ['postcode', 'post code', 'postal code', 'zip'], content: '<POSTCODE HERE>', fieldType: 'text'},
        {searchFields : ['city'], content: '<CITY HERE>', fieldType: 'text'},
        {searchFields : ['i agree'], content: true, fieldType: 'checkbox'}
    ]
    /* ----------------------------------------------------------------------------------------------------------------------------------*/

    /* trigger a key press to enable input fields */
    function enableInput(inputName){
        window.jQuery(inputName).keyup();
        window.jQuery(inputName).keydown();
        window.jQuery(inputName).change();
        window.jQuery(inputName).trigger("input");
    }

    function doReplace(fillFields){
        /* replace fields by input name */
        fillFields.forEach(function(replaceField){
            if(replaceField.hasOwnProperty('searchFields')){
                replaceField.searchFields.forEach(function(searchField){
                    var validID = searchField.replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '')
                    if(window.jQuery('input[name=' + validID + ']').length > 0){
                        console.log('Found element [' + validID + '] via input name!')
                        setInputBySelector('input[name=' + validID + ']', replaceField)
                        enableInput(window.jQuery('input[name=' + validID + ']'))
                    }
                });
            }
        });

        /* replace fields by related label */
        fillFields.forEach(function(replaceField){
            if(replaceField.hasOwnProperty('searchFields')){
                replaceField.searchFields.forEach(function(searchField){
                    window.jQuery('label').each(function(labelIndex, labelElement) {
                        if(window.jQuery(labelElement).text().toLowerCase().includes(searchField.toLowerCase())){
                            console.log('Found element [' + searchField + '] via label!')
                            // check whether the label's for property has been set
                            if(window.jQuery(labelElement).prop('for') == undefined){
                                // checked whether the label surrounds the text
                                if(window.jQuery(labelElement).find('input').length > 0){
                                    var thisInput = window.jQuery(labelElement).find('input')
                                    window.jQuery(thisInput).val(replaceField.content)
                                    enableInput(thisInput)
                                } else {
                                    // check the next element below the label element for an input
                                    if(window.jQuery(labelElement).next('input').length > 0){
                                        thisInput = window.jQuery(labelElement).next('input')
                                        window.jQuery(thisInput).val(replaceField.content)
                                        enableInput(thisInput)
                                    }
                                }
                            } else {
                                /* set the input value using the label's for value */
                                var labelFor = window.jQuery(labelElement).prop('for');
                                setInputBySelector('[id=' + labelFor + ']', replaceField)
                                enableInput(window.jQuery('[id=' + labelFor + ']'))
                            }
                        }
                    });
                });
            }
        });

    }

    /* adds a floating blue 'replace' button to the page */
    function addReplaceButton(){
        window.jQuery("<div id='replaceButton' style='position:fixed;background-color: rgba(0, 90, 156,0.7);top: 3%;left: 3%;color: white;z-index: 99999;cursor: pointer;font-size: 15px;width: 100px;text-align: center;line-height: 100px;border-radius: 50%;font-family: sans-serif;font-weight: 100;'>Autocomplete</div>").insertBefore('body');
        window.jQuery('#replaceButton').on('click', function(event) {
            doReplace(fillFields);
        });
    }

    /* replace fields on wizard next button */
    function attachUpdate(){
        window.jQuery('body').on('click', 'button', function(event) {
            if(window.jQuery(this).text().toLowerCase().includes('next')){
                doReplace(fillFields);
            }
        });
        console.log('****\n\nJob autocomplete created by couldbejake, if you have any issues or suggestions contact me on github @ couldbejake@gmail.com\n\n****')
    }

    function setInputBySelector(inputSelector, inputData){

      /* account for developers who don't know about the html spec
        and put two elements in their page with the same ID */

      var inputElements = window.jQuery(inputSelector)

      switch (inputData.fieldType) {
        default:
        case 'text':
          inputElements.val(inputData.content)
          break;
        case 'checkbox':
          inputElements.prop('checked', true)
          break;
      }

      enableInput(window.jQuery(inputElements))
    }

    /* delay the first replacement while jQuery loads */

    setTimeout(function () {
        doReplace(fillFields);
        addReplaceButton();
        attachUpdate();
    }, 500);


})();
