$(document).ready(function () {

});

function formsubmit(btn, callback) {
    var sub = false;    // флаг отправки запроса

    $(btn).on('click', function () {
        var form = $(this).parents('form');
        form.find('#_error').hide();

        var err_b = false;
        $('form *[necessary=""]').each(function() {
            if (!$(this).val()) {
                form.find('#_error').show().find('#_txt').html($(this).attr('error'));
                error($(this));
                err_b = true;
                return false;
            } else {
                success($(this));
            }
        });

        if (!sub && !err_b) {
            sub = true;
            $(this).prepend('<img id="_form_loading" src="/files/images/ajax-loader.gif" /> ');
            $.post(form.attr('action'), form.serialize(),
                function (data) {

                    try {
                        var o = $.parseJSON(data);
                        if (o.success) {
                            form.find('#_error').show().find('#_txt').html(o.success);

                            // очистка всего, что было заполнено
                            form.find('*').val('');

                            // callback
                            if (callback && typeof(callback) === "function") {
                                callback();
                            }
                        } else {
                            form.find('#_error').show().find('#_txt').html(o.error);
                            error(form.find('* [name="' + o.input_name + '"]'));
                        }
                    } catch (e) {
                        form.find('#_error').show().find('#_txt').html('Ошибка!');
                    }
                    $('#_form_loading').remove();

                    sub = false;
                });
        }
        return false;
    });
}

function success(input) {
    remove(input);
    input.parent().addClass('has-feedback').addClass('has-success').append('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
}

function error(input) {
    remove(input);
    input.parent().addClass('has-feedback').addClass('has-error').append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
}

function remove(input) {
    input.parent().find('span').remove();
    input.parent().removeClass('has-feedback').removeClass('has-success').removeClass('has-error');
}