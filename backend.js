<%
function require(lib_code) {
    return  OpenCodeLib('x-local://wt/web/request_26839/'+lib_code+'.js?v='+Random(1,111111));
}

function get_categories(form) {
    var ret = []
    try{
		/*ctg_query=XQuery("sql:SELECT s.category FROM cc_stationerys s WHERE s.status='Открытый' GROUP BY s.category ORDER BY s.category ASC");
		for (c in ctg_query){
			ret.push(String(c.category))
		}*/
		ctg_query=XQuery("sql:SELECT s.category FROM cc_stationerys s WHERE s.status='Открытый' GROUP BY s.category ORDER BY s.category ASC");
		for (c in ctg_query){
			dt=[];
			stat_query=XQuery("sql:SELECT * FROM cc_stationerys s WHERE s.category='"+c.category+"' ORDER BY s.name ASC");
			for (s in stat_query){
				s_doc=tools.open_doc(s.id);
				dt.push({id:String(s.id),image:String(s_doc.TopElem.image),name:String(s.name),description:String(s_doc.TopElem.description),code:String(s.code)})
			}
			ret.push({ctg:String(c.category),data:dt})
		}

    }
    catch(err){
        throw Error('get_categories->'+err);
    }
    return ret;
}

function send_order(form) {
	try{
		TODAY=DateNewTime(Date());
		//alert("send_order"+tools.object_to_text(form.selectedItems,"json"));
		docObject =tools.new_doc_by_name("cc_stationery_request", false );
		docObject.BindToDb();
		docObject.TopElem.collaborator=form.userId;
		docObject.TopElem.creation_date=TODAY;
		docObject.TopElem.workflow_state="На исполнении";
		docObject.TopElem.status="Активная";
		for (it in form.selectedItems){
			item=docObject.TopElem.selected_productss.AddChild();
			item.product_name=it.name;
			item.product_code=it.code;
			item.product_col=it.col;
		}
		
		wf=docObject.TopElem.workflow_historys.AddChild();
		wf.create_date=Date();
		wf.fio=tools.open_doc(form.userId).TopElem.fullname;
		wf.action="Отправить"
		wf.finish_state="На исполнении"
		
		requests_col=ArrayCount(XQuery("for $elem in cc_stationery_requests return $elem"));
		docObject.TopElem.code=requests_col+1;
		docObject.Save();
		req_id=OptInt(docObject) == undefined ? docObject.DocID : docObject;
		tools.create_notification(7076887832577068155,OptInt(form.userId),"",req_id)//Ув 7
		group_admins=7076877487250109840;
		group_doc=tools.open_doc(group_admins);
		admins=group_doc.TopElem.collaborators;
		for (ad in admins){
			tools.create_notification(7076895309612274228,ad.collaborator_id,"",req_id)//Ув 7.1
		}

	}
	catch(err){
        throw Error('send_order->'+err);
    }
	return true;
}


var RESULT = {};
RESULT.data = {};

try{
    var action,form;
	var cmnLib = require('common');

    form = Request.Query.HasProperty("form") ? cmnLib.parse_json(Request.Query.form) : {};
    action = Request.Query.GetOptProperty('action');
	
    switch (action) {

        case 'get_categories':
			RESULT.data.categories = get_categories(form);
            break;
		case 'send_order':
			RESULT.data.res = send_order(form);
            break;

        default:
        throw Error('action '+action+' not valid')
    }
    RESULT.success = true;

}
catch(err){
    //alert(err);
    //alert(Request.Query.form)
    RESULT.err_msg = 'action:' + action + '->Ошибка:' + err;
    RESULT.success = false;
}
// alert(cmnLib.to_json(RESULT))
Response.Write(cmnLib.to_json(RESULT));
%>
