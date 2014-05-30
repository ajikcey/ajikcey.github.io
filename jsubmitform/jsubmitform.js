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

#jsf_error      - element for response
#jsf_loading    - element for loading image
#jsf_submit     - button submit

Attributes:

jsf_necessary   - required fields and value

*/
function jsubmitform(form, params) {
    
    // call function "f" this parameters "p" as object
    function callf(f, p) {
        if (f && typeof(f) === "function") {
            f(p);
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
        params.img = "/jsubmitform/load.gif";
    }
    
    if (!params.error) {
        params.error = true;
    }

    var sub = false;    // send request flag

    form.find('#jsf_submit').on('click', function () {
        
        hideel(form.find('#jsf_error'));
        hideel(form.find('#jsf_loading'));

        var err_b = false;
        
        // before
        callf(params.before, {form: form});
        
        form.find('*[jsf_necessary==""]').each(function() {
            
            // if not filled in the required fields
            if (!$(this).val()) {
                
                // error
                if (params.error) {
                    showel(form.find('#jsf_error'), $(this).attr("jsf_necessary"));
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
                showel(form.find('#jsf_loading'), '<img src="' + params.img + '" /> ');
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
                        showel(form.find('#jsf_error'), 'Debug: no response');
                    }
                        
                    // noresponse
                    callf(params.noresponse, {form: form});
                }
            })
            .always(function() {
                // always
                callf(params.always, {form: form});
                
                hideel(form.find('#jsf_loading'));
                sub = false;
            });
        }
        return false;
    });
}
