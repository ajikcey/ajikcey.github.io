/*

Parameters:

debug           - show debug info (default = false)
error           - show error info (default = true)
animate         - show loading animate (default = true)
handle          - handle request (default = false)

Functions:

before({form: form});
success({form: form, data: data});
noresponse({form: form});
after({form: form});

Elements:

#jsf_error      - element for response/error
#jsf_submit     - button submit
#jsf_animate    - element for loading animate

Attributes:

jsf_necessary   - required fields and value

*/
function jsubmitform(form, params) {

    // validation
    if (!form || typeof(form) != "object") {
        return false;
    }

    // default
    if (!params || typeof(params) != "object") {
        params = {};
    }
    
    if (!params.debug) {
        params.debug = false;
    }
    if (!params.error) {
        params.error = true;
    }
    if (!params.animate) {
        params.animate = true;
    }
    if (!params.handle) {
        params.handle = false;
    }

    form.find('#jsf_submit').on('click', function () {
        
        hideel(form.find('#jsf_error'));
        var err_b = false;
        
        // before
        callf(params.before, {form: form});
        
        form.find('*[jsf_necessary]').each(function() {
            
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

        if (!err_b) {
            sub = true;
            
            // desabled button
            form.find('#jsf_submit').attr('disabled', 'disabled');
            
            // animate
            if (params.animate) {
                showel(form.find('#jsf_animate'), '<div id="facebookG"><div id="blockG_1" class="facebook_blockG"></div><div id="blockG_2" class="facebook_blockG"></div><div id="blockG_3" class="facebook_blockG"></div></div>');
            }

            // ajax
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize(),
                success: function (data) {
                    // success
                    callf(params.success, {form: form, data: data});
                    
                    // handle
                    if (params.handle) {
                        callf('handle_request', {form: form, data: data});
                    }
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
                // after
                callf(params.after, {form: form});
                
                // enbled button
                form.find('#jsf_submit').removeAttr("disabled");
                
                // hide animate
                hideel(form.find('#jsf_animate'));
            });
        }
        return false;
    });
    
    // handle request
    function handle_request(obj) {
        try {
            var o_data = $.parseJSON(obj.data);
            if (o_data.success) {
                showel(obj.form.find('#JSf_error'), o_data.success);                    
             } else {
                
             }
        } catch (e) {
            // debug
            if (params.debug) {
                showel(obj.form.find('#jsf_error'), 'Debug: incorrect data');
            }
        }
    }
    
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

}
