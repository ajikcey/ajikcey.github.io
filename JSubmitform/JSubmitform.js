function JSubmitform(form, params) {
    
    // validation
    if (!form || typeof(form) != "object") {
        return false;
    }

    // default
    if (!params || typeof(params) != "object") {
        params = {
            attr: "error",
            img: "/files/images/ajax-loader.gif",
            img_pend: "pre",
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
            if (params.img_pend == "pre") {
                form.find('#JSf_loading').prepend('<img src="' + params.img + '" /> ');
            } else if (params.img_pend == "ap") {
                form.find('#JSf_loading').append('<img src="' + params.img + '" /> ');
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
                        form.find('#JSf_error').html('Error').show();
                        
                        // warning
                        if (warning && typeof(warning) === "function") {
                            params.warning();
                        }
                    }
                    form.find('#JSf_loading').html("");

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
