/*

Parameters:

img             - image loading <img src="...">
debug           - show debug info
error           - show error info

Functions:

before({form: form});
success({form: form, data: data});
noresponse({form: form});
always({form: form});

Elements:

#JSf_error      - element for response
#JSf_loading    - element for loading image
#JSf_submit     - button submit

Attributes:

JSf_necessary   - required fields
JSf_error       - empty required fields

*/
function JSubmitform(form, params) {
    
    // call function "f" this parameters "JS" as object
    function callf(f, JS) {
        if (f && typeof(f) === "function") {
            f(JS);
        }
    }
    
    // show element "what" in "where"
    function showel(where, what) {
        where.html(what).show();
    }
    
    // hide element
    function hideel(where) {
        where.html("").hide();
    }
    
    // validation
    if (!form || typeof(form) != "object") {
        return false;
    }

    // default
    if (!params || typeof(params) != "object") {
        params = {};
    }
    
    if (!params.img) {
        params.img = "/JSubmitform/load.gif";
    }
    
    if (!params.error) {
        params.error = true;
    }

    var sub = false;    // send request flag

    form.find('#JSf_submit').on('click', function () {
        
        hideel(form.find('#JSf_error'));
        hideel(form.find('#JSf_loading'));

        var err_b = false;
        
        // before
        callf(params.before, {form: form});
        
        form.find('*[JSf_necessary=""]').each(function() {
            
            // if not filled in the required fields
            if (!$(this).val()) {
                
                // error
                if (params.error) {
                    showel(form.find('#JSf_error'), $(this).attr("JSf_error"));
                }

                err_b = true;
                
                return false;
            } else {
                
            }
        });

        if (!sub && !err_b) {
            sub = true;
            
            // image loading insert to the place
            if (params.img) {
                showel(form.find('#JSf_loading'), '<img src="' + params.img + '" /> ');
            }
            
            // ajax
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                success: function (data) {

                    //try {
                        //var o = $.parseJSON(data);
                        //if (o.success) {
                        //    
                        //    showel(form.find('#JSf_error'), o.success);
                        //
                        //    // success
                            callf(params.success, {form: form, data: data});
                        //} else {
                            // error
                        //    callf(params.error, {
                        //        data: data,
                        //        form: form
                        //    });
                        //}
                    //} catch (e) {
                        
                        
                        // warning
                        //callf(params.error, {form: form});
                    //}
                },
                error: function() {
                    
                    // debug
                    if (params.debug) {
                        showel(form.find('#JSf_error'), 'Debug: no response');
                    }
                        
                    // noresponse
                    callf(params.noresponse, {form: form});
                }
            })
            .always(function() {
                // always
                callf(params.always, {form: form});
                
                hideel(form.find('#JSf_loading'));
                sub = false;
            });
        }
        return false;
    });
}
