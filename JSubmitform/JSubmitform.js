/*

Elements:

#JSf_error - element for response
#JSf_loading - element for loading image
#JSf_submit - button submit

*/
function JSubmitform(form, params) {
    
    // call function
    function callf(f) {
        if (f && typeof(f) === "function") {
            f();
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
        params = {
            img: "/JSubmitform/load.gif",
            success: function() {},
            error: function() {},
            warning: function() {},
            always: function() {},
            noresponse: function() {}
        };
    } else {
        
    }

    var sub = false;    // send request flag

    form.find('#JSf_submit').on('click', function () {
        
        hideel(form.find('#JSf_error'));
        hideel(form.find('#JSf_loading'));

        var err_b = false;
        
        form.find('*[necessary=""]').each(function() {
            
            // if not filled in the required fields
            if (!$(this).val()) {
                showel(form.find('#JSf_error'), $(this).attr("JSf_error"));

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

                    try {
                        var o = $.parseJSON(data);
                        if (o.success) {
                            
                            showel(form.find('#JSf_error'), o.success);

                            // success
                            callf(params.success());
                        } else {
                            // error
                            callf(params.error());
                        }
                    } catch (e) {
                        
                        // for debug
                        showel(form.find('#JSf_error'), 'Error');
                        
                        // warning
                        callf(params.warning());
                    }
                    hideel(form.find('#JSf_loading'));

                    sub = false;
                },
                error: function() {
                    
                    hideel(form.find('#JSf_loading'));
                    
                    // for debug
                    showel(form.find('#JSf_error'), 'NO response');
                        
                    // noresponse
                    callf(params.noresponse());
                    
                    sub = false;
                }
            })
            .always(function() {
                // always
                callf(params.always);
            });
        }
        return false;
    });
}
