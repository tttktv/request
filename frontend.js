var App = new Vue({
	el: '#App',
	data: {
        categories:[],
		selected_items:[],
		v_show:false,
    },
	
	methods:{	
		checkOrder:function (){	
			const self = this;
			self.selected_items=[];
			var inputs = document.querySelectorAll(".col_input");
			var ctg_col=Object.keys(self.categories).length;
			//var selected_items=[];
			for(i=0;i<inputs.length;i++){
				if(inputs[i].value!="" && inputs[i].value!="0"){
					item=inputs[i].id.split(";");
					item_id=item[0];
					item_ctg=item[1];
					item_col=inputs[i].value;
					result = self.categories[item_ctg]['data'].filter((item) => item.id === item_id);
					result[0].col=item_col;
					self.selected_items.push(result[0]);
				}
			}
		},
		sendOrder:function (){
			const self = this;
			self.checkOrder();
			if (self.selected_items.length==0){
				alert("Заполните все обязательные поля")
			}
			else{
				post("send_order"
				,{userId:GLOBAL.curUserID,
				  selectedItems:self.selected_items,}
				, function (data) {
						if(data.res==true){
							window.location.href = '/view_doc.html?mode=requests' 
						}
					}, self);
			}
 
		},
	},
	
	
	created: function created() {
        const self = this;
        log('App created');
        self.person_id = GLOBAL.curUserID;
		
		post("get_categories"
            ,{}
            , function (data) {

                self.categories = Object.assign({}, self.categories, data.categories);
				log("категории",JSON.stringify(self.categories))
            }, self)
            .then(function () {
				self.v_show=true;
            });




    }
})
