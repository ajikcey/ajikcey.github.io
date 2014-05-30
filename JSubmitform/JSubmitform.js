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
    
    // validation
    if (!form || typeof(form) != "object") {
        return false;
    }

    // default
    if (!params || typeof(params) != "object") {
        params = {
            img: "/files/images/ajax-loader.gif",
            success: function() {},
            error: function() {},
            warning: function() {},
            always: function() {}
        };
    } else {
        
    }

    var sub = false;    // send request flag

    form.find('#JSf_submit').on('click', function () {
        
        form.find('#JSf_error').hide();

        var err_b = false;
        
        form.find('*[necessary=""]').each(function() {
            
            // if not filled in the required fields
            if (!$(this).val()) {
                form.find('#JSf_error').html($(this).attr("JSf_error")).show();

                err_b = true;
                
                return false;
            } else {
                
            }
        });

        if (!sub && !err_b) {
            sub = true;
            
            // image loading insert to the place
            if (params.img) {
                form.find('#JSf_loading').html('<img src="' + params.img + '" /> ');
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
                            
                            form.find('#JSf_error').html(o.success).show();

                            // success
                            callf(params.success());
                        } else {
                            // error
                            callf(params.error());
                        }
                    } catch (e) {
                        
                        // for debug
                        form.find('#JSf_error').html('Error').show();
                        
                        // warning
                        callf(params.warning());
                    }
                    form.find('#JSf_loading').html("");

                    sub = false;
                }
            })
            .always(function() {
                // always
                callf(params.always());
            });
        }
        return false;
    });
}
