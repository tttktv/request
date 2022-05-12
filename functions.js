function is_true(val) {
    if (val == true)
        return true;
    if (val == "true")
        return true;
    return false;

}

function isEmpty(param) {
    if (param == undefined)
        return true;
    if (param == null)
        return true;
    if (param == "")
        return true;

    return false;

}

function log(p1, p2) {
    if (p2)
        console.log(p1, p2);
    else
        console.log(p1)
}

function post(action, form, callback, self,backend) {
    //log('post action->' + action);

    let backend_template_code = backend||GLOBAL.BACKEND_TEMPLATE_CODE;

    let sendData = {
        dataType: "json"
        , data: {
            action: action
            , form: JSON.stringify(form)
        }
    }
    return $.ajax({
        type: "POST",
        url: '/custom_web_template.html?object_code=' + backend_template_code,
        dataType: "json"
        , data: {
            action: action
            , form: JSON.stringify(form)
        },
        beforeSend: function () {
            self.show = false;
        },
        success: function (res) {
            //console.log('post.success:');

            self.err_msg = '';
            self.war_msg = '';
            if (res.success) {

                if (res.war_msg)
                    self.war_msg = res.war_msg;

                callback(res.data);

            } else {
                console.error(res.err_msg);
                self.err_msg = res.err_msg;
            }

        }
    }).fail(function (res) {

        console.log('post.fail:');
        console.error(res.responseText);
        self.err_msg = res.err_msg;
        self.show = true;

    }).done(function (res) {
        //console.log('post.done:');
        self.show = true;
    })
}
