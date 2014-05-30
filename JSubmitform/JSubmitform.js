function JSubmitform(form, params) {
    
    // validation
    if (!form || typeof(form) != "object") {
        return false;
    }

    // default
    if (!params || typeof(params) != "object") {
        params.err = form.find('#JSf_error'),
        params.attr = "error",
        params.img_pl =  form.find('#JSf_loading'),
        params.img = "/files/images/ajax-loader.gif",
        params.img_pend = "pre",
        params.success = function() {},
        params.error = function() {},
        params.warning = function() {},
        params.always = function() {}
    } else {
        
    }

    var sub = false;    // send request flag

    form.find('*:submit').on('click', function () {
        
        params.err.hide();

        var err_b = false;
        
        form.find('*[necessary=""]').each(function() {
            
            // if not filled in the required fields
            if (!$(this).val()) {
                params.err.html($(this).attr(params.attr)).show();

                err_b = true;
                
                return false;
            } else {
                
            }
        });

        if (!sub && !err_b) {
            sub = true;
            
            // image loading insert to the place
            if (params.img_pend == "pre") {
                params.img_pl.prepend('<img src="' + params.img + '" /> ');
            } else if (params.img_pend == "ap") {
                params.img_pl.append('<img src="' + params.img + '" /> ');
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
                            
                            params.err.html(o.success).show();

                            // success
                            if (success && typeof(success) === "function") {
                                params.success();
                            }
                        } else {
                            // error
                            if (error && typeof(error) === "function") {
                                params.error();
                            }
                        }
                    } catch (e) {
                        
                        // for debug
                        params.err.html('Error').show();
                        
                        // warning
                        if (warning && typeof(warning) === "function") {
                            params.warning();
                        }
                    }
                    params.img_pl.html("");

                    sub = false;
                }
            })
            .always(function() {
                // always
                if (always && typeof(always) === "function") {
                    params.always();
                }
            });
        }
        return false;
    });
}
