import _ from 'lodash'


const defaultConfiguration = {
  isFormValid: 'parsleyValid',
  focus: 'none',
  errorClass: 'has-error',
  successClass: 'has-success',
  classHandler: function(ParsleyField) {
    return ParsleyField.$element.parents('.form-group');
  },
  errorsContainer: function(ParsleyField) {
    return ParsleyField.$element.parents('.form-group');
  },
  errorsWrapper: '<span class="help-block">',
  errorTemplate: '<div></div>'
};


// A decorator function takes two arguments. The DOM element the decorator was called from
// and any additional arguments added to the decorator attribute of that element.
let parsleyDecorator = function(node, content) {

  // Have not investigated any source code but couldn't find any docs stating context
  // of invocation was ractive library BUT seems to work.
  let ractive = this;
  
  // use ractive to set the data model. Initially form is not valid. 
  ractive.set(parsleyDecorator.config.isFormValid, false);

  // When parsley loads it registers itself with jquery and adds a parsley function.
  // this function creates a new ParsleyFactory from the JQ element and the extra argument
  // passed directly.
  let parsleyForm = $(node).parsley(parsleyDecorator.config)

  // Gets all the input elements of the form.
  let inputFields = $(node).children('.form-group').children('input') || []

  // Function that validates the from and sets the 'parsleyValid' model.
  function validate() {
    ractive.set(parsleyDecorator.config.isFormValid, parsleyForm.validate());
  }

  // attaches a callback to validate the form whenever the 'blur' or 'keyup' event occur
  // for each input field.
  _.forEach(inputFields, elem => {
    // The blur event is sent to an element when it loses focus.
    $(elem).blur(validate);
    $(elem).keyup(validate);
  });

  // Ractive requires decorators to return a teardown function. The
  // teardown functions defines any action required if the DOM element
  // is removed.
  return {
    teardown: function(){
      // unbind removes event handlers.
      _.forEach(inputFields, elem => ($elem).unbind());
      parsleyForm.destroy();
    }
  }

}

// Best practise to assign any decorator variables by attaching them to the function 
// rather than adding them as a long string of arguments to the decorator in the html
parsleyDecorator.config = defaultConfiguration;
export default parsleyDecorator;
